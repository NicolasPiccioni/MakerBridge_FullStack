from django.db import connection, transaction

ESTADOS_PEDIDO = (
    "abierto", "asignado", "en_proceso", "listo_despacho",
    "en_transito", "finalizado", "cancelado",
)

# id del filtro del front -> texto que se busca dentro de pedidos.material
MATERIALES = {"pla": "PLA", "petg": "PETG", "tpu": "TPU"}

# id del filtro del front -> textos posibles dentro de pedidos.ubicacion
UBICACIONES = {
    "caba": ["Buenos Aires", "CABA", "GBA", "Capital Federal"],
    "cordoba": ["Córdoba", "Cordoba"],
}

COLUMNAS_LISTA = [
    "id_pedido", "titulo", "descripcion", "cantidad", "material", "color",
    "archivo_url", "fecha_limite", "estado", "fecha_creacion", "ubicacion",
    "cotizaciones_pendientes", "precio_aceptado", "maker_asignado",
]

COLUMNAS_COTIZACION = [
    "id_cotizacion", "nombre_maker", "precio", "tiempo_entrega_dias",
    "material_tipo", "material_personalizado", "mensaje", "estado", "fecha_creacion",
]


# ------------------------------------------------------------------ Pedidos
def crear_pedido(id_usuario, titulo, descripcion, cantidad, material, color,
                 archivo_url, fecha_limite, ubicacion):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO pedidos
                (id_usuario, titulo, descripcion, cantidad, material, color,
                 archivo_url, fecha_limite, ubicacion, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'abierto')
            RETURNING id_pedido
            """,
            [id_usuario, titulo, descripcion, cantidad, material,
             color or None, archivo_url or None, fecha_limite, ubicacion],
        )
        return cursor.fetchone()[0]


def _filtros(id_usuario, estados, materiales, ubicacion):
    condiciones = ["p.id_usuario = %s"]
    params = [id_usuario]

    if estados:
        condiciones.append("p.estado = ANY(%s)")
        params.append(list(estados))

    if materiales:
        condiciones.append("(" + " OR ".join(["p.material ILIKE %s"] * len(materiales)) + ")")
        params += [f"%{MATERIALES[m]}%" for m in materiales]

    if ubicacion in UBICACIONES:
        textos = UBICACIONES[ubicacion]
        condiciones.append("(" + " OR ".join(["p.ubicacion ILIKE %s"] * len(textos)) + ")")
        params += [f"%{t}%" for t in textos]

    return " AND ".join(condiciones), params


def contar_pedidos(id_usuario, estados, materiales, ubicacion):
    donde, params = _filtros(id_usuario, estados, materiales, ubicacion)
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT COUNT(*) FROM pedidos p WHERE {donde}", params)
        return cursor.fetchone()[0]


def listar_pedidos(id_usuario, estados, materiales, ubicacion, limite, desplazamiento):
    donde, params = _filtros(id_usuario, estados, materiales, ubicacion)
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT p.id_pedido, p.titulo, p.descripcion, p.cantidad, p.material,
                   p.color, p.archivo_url, p.fecha_limite, p.estado,
                   p.fecha_creacion, p.ubicacion,
                   (SELECT COUNT(*) FROM cotizaciones c
                     WHERE c.id_pedido = p.id_pedido AND c.estado = 'pendiente')
                        AS cotizaciones_pendientes,
                   ok.precio AS precio_aceptado,
                   ok.nombre AS maker_asignado
            FROM pedidos p
            LEFT JOIN LATERAL (
                SELECT c.precio, u.nombre
                FROM cotizaciones c
                JOIN usuarios u ON u.id_usuario = c.id_maker
                WHERE c.id_pedido = p.id_pedido AND c.estado = 'aceptada'
                ORDER BY c.fecha_aceptacion DESC NULLS LAST, c.id_cotizacion DESC
                LIMIT 1
            ) ok ON TRUE
            WHERE {donde}
            ORDER BY p.fecha_creacion DESC, p.id_pedido DESC
            LIMIT %s OFFSET %s
            """,
            params + [limite, desplazamiento],
        )
        return [dict(zip(COLUMNAS_LISTA, fila)) for fila in cursor.fetchall()]


def cotizaciones_del_pedido(id_pedido, id_usuario):
    """Devuelve (pedido, cotizaciones), o None si el pedido no existe o no es del usuario.
    No incluye la comisión ni el email del maker."""
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id_pedido, titulo, estado FROM pedidos WHERE id_pedido = %s AND id_usuario = %s",
            [id_pedido, id_usuario],
        )
        fila = cursor.fetchone()
        if fila is None:
            return None
        pedido = dict(zip(["id_pedido", "titulo", "estado"], fila))

        cursor.execute(
            """
            SELECT c.id_cotizacion, u.nombre AS nombre_maker, c.precio,
                   c.tiempo_estimado_dias AS tiempo_entrega_dias,
                   c.material_tipo, c.material_personalizado, c.mensaje,
                   c.estado, c.fecha_creacion
            FROM cotizaciones c
            JOIN usuarios u ON u.id_usuario = c.id_maker
            WHERE c.id_pedido = %s
            ORDER BY (c.estado = 'aceptada') DESC, c.precio ASC, c.id_cotizacion ASC
            """,
            [id_pedido],
        )
        cotizaciones = [dict(zip(COLUMNAS_COTIZACION, f)) for f in cursor.fetchall()]
        return pedido, cotizaciones


# ------------------------------------------------------- Aceptar una cotización
def aceptar_cotizacion(id_cotizacion, id_cliente):
    """Todo o nada. Devuelve (resultado, datos) con resultado en:
    'ok', 'no_existe', 'no_abierto' o 'no_pendiente'."""
    with transaction.atomic(), connection.cursor() as cursor:
        cursor.execute("SELECT id_pedido FROM cotizaciones WHERE id_cotizacion = %s", [id_cotizacion])
        fila = cursor.fetchone()
        if fila is None:
            return "no_existe", None
        id_pedido = fila[0]

        # Bloquea el pedido (y comprueba que sea de este cliente). Un segundo clic
        # espera acá y cuando entra ya ve el estado nuevo.
        cursor.execute(
            "SELECT estado FROM pedidos WHERE id_pedido = %s AND id_usuario = %s FOR UPDATE",
            [id_pedido, id_cliente],
        )
        fila = cursor.fetchone()
        if fila is None:
            return "no_existe", None
        if fila[0] != "abierto":
            return "no_abierto", None

        cursor.execute(
            """
            UPDATE cotizaciones
            SET estado = 'aceptada', fecha_aceptacion = (NOW() AT TIME ZONE 'UTC')
            WHERE id_cotizacion = %s AND estado = 'pendiente'
            RETURNING id_maker, precio
            """,
            [id_cotizacion],
        )
        fila = cursor.fetchone()
        if fila is None:
            return "no_pendiente", None
        id_maker, precio = fila

        cursor.execute(
            """
            UPDATE cotizaciones SET estado = 'rechazada'
            WHERE id_pedido = %s AND id_cotizacion <> %s AND estado = 'pendiente'
            """,
            [id_pedido, id_cotizacion],
        )
        cursor.execute("UPDATE pedidos SET estado = 'asignado' WHERE id_pedido = %s", [id_pedido])

        # Deja registrado el pago pendiente (todavía no se cobra nada)
        cursor.execute(
            """
            INSERT INTO pagos (id_cotizacion, monto, estado)
            VALUES (%s, %s, 'pendiente')
            ON CONFLICT (id_cotizacion) DO NOTHING
            """,
            [id_cotizacion, precio],
        )

        return "ok", {"id_pedido": id_pedido, "id_maker": id_maker, "precio": precio}


# ------------------------------------------------------ Confirmar la recepción
def confirmar_recepcion(id_pedido, id_cliente):
    """Devuelve (resultado, datos) con resultado en 'ok', 'no_existe' o 'estado_incorrecto'."""
    with transaction.atomic(), connection.cursor() as cursor:
        cursor.execute(
            "SELECT estado, titulo FROM pedidos WHERE id_pedido = %s AND id_usuario = %s FOR UPDATE",
            [id_pedido, id_cliente],
        )
        fila = cursor.fetchone()
        if fila is None:
            return "no_existe", None
        estado, titulo = fila
        if estado != "en_transito":
            return "estado_incorrecto", None

        cursor.execute("UPDATE pedidos SET estado = 'finalizado' WHERE id_pedido = %s", [id_pedido])

        cursor.execute(
            """
            SELECT u.email, u.nombre
            FROM cotizaciones c
            JOIN usuarios u ON u.id_usuario = c.id_maker
            WHERE c.id_pedido = %s AND c.estado = 'aceptada'
            ORDER BY c.fecha_aceptacion DESC NULLS LAST, c.id_cotizacion DESC
            LIMIT 1
            """,
            [id_pedido],
        )
        maker = cursor.fetchone()
        return "ok", {
            "titulo": titulo,
            "maker": dict(zip(["email", "nombre"], maker)) if maker else None,
        }


# ------------------------------------------------------------------ Contactos
def contacto_usuario(id_usuario):
    with connection.cursor() as cursor:
        cursor.execute("SELECT email, nombre FROM usuarios WHERE id_usuario = %s", [id_usuario])
        fila = cursor.fetchone()
        return dict(zip(["email", "nombre"], fila)) if fila else None


def titulo_pedido(id_pedido):
    with connection.cursor() as cursor:
        cursor.execute("SELECT titulo FROM pedidos WHERE id_pedido = %s", [id_pedido])
        fila = cursor.fetchone()
        return fila[0] if fila else None