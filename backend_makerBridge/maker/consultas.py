from django.db import connection

COLUMNAS = [
    "id_pedido", "id_usuario", "nombre_usuario", "titulo", "descripcion",
    "cantidad", "material", "color", "archivo_url", "fecha_limite",
    "estado", "fecha_creacion", "ubicacion",
]

# Orden permitido: el valor que llega del front elige una de estas cláusulas fijas
ORDEN = {
    "recent": "p.fecha_creacion DESC, p.id_pedido DESC",
    "oldest": "p.fecha_creacion ASC, p.id_pedido ASC",
    "deadline": "p.fecha_limite ASC NULLS LAST, p.id_pedido ASC",
}

# id del filtro del front -> texto que se busca dentro de pedidos.material
MATERIALES = {"pla": "PLA", "petg": "PETG", "tpu": "TPU"}

# id del filtro del front -> textos posibles dentro de pedidos.ubicacion
UBICACIONES = {
    "caba": ["Buenos Aires", "CABA", "GBA", "Capital Federal"],
    "cordoba": ["Córdoba", "Cordoba"],
}


def _escapar_like(texto):
    """Para que un % o _ escrito por el usuario se busque como texto común."""
    return texto.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _filtros(estado, q, materiales, ubicacion):
    condiciones = ["p.estado = %s"]
    params = [estado]

    if q:
        patron = f"%{_escapar_like(q)}%"
        condiciones.append("(p.titulo ILIKE %s OR p.descripcion ILIKE %s)")
        params += [patron, patron]

    if materiales:
        condiciones.append("(" + " OR ".join(["p.material ILIKE %s"] * len(materiales)) + ")")
        params += [f"%{MATERIALES[m]}%" for m in materiales]

    if ubicacion in UBICACIONES:
        textos = UBICACIONES[ubicacion]
        condiciones.append("(" + " OR ".join(["p.ubicacion ILIKE %s"] * len(textos)) + ")")
        params += [f"%{t}%" for t in textos]

    return " AND ".join(condiciones), params


def contar_pedidos(estado, q="", materiales=(), ubicacion="all"):
    donde, params = _filtros(estado, q, materiales, ubicacion)
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT COUNT(*) FROM pedidos p WHERE {donde}", params)
        return cursor.fetchone()[0]


def listar_pedidos(estado, q="", materiales=(), ubicacion="all",
                   orden="recent", limite=10, desplazamiento=0):
    donde, params = _filtros(estado, q, materiales, ubicacion)
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT p.id_pedido, p.id_usuario, u.nombre AS nombre_usuario,
                   p.titulo, p.descripcion, p.cantidad, p.material, p.color,
                   p.archivo_url, p.fecha_limite, p.estado, p.fecha_creacion,
                   p.ubicacion
            FROM pedidos p
            JOIN usuarios u ON u.id_usuario = p.id_usuario
            WHERE {donde}
            ORDER BY {ORDEN[orden]}
            LIMIT %s OFFSET %s
            """,
            params + [limite, desplazamiento],
        )
        return [dict(zip(COLUMNAS, fila)) for fila in cursor.fetchall()]

def obtener_pedido(id_pedido):
    """Devuelve un pedido por id, o None si no existe."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT p.id_pedido, p.id_usuario, u.nombre AS nombre_usuario,
                   p.titulo, p.descripcion, p.cantidad, p.material, p.color,
                   p.archivo_url, p.fecha_limite, p.estado, p.fecha_creacion,
                   p.ubicacion
            FROM pedidos p
            JOIN usuarios u ON u.id_usuario = p.id_usuario
            WHERE p.id_pedido = %s
            """,
            [id_pedido],
        )
        fila = cursor.fetchone()
        return dict(zip(COLUMNAS, fila)) if fila else None

def existe_cotizacion(id_pedido, id_maker):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT 1 FROM cotizaciones WHERE id_pedido = %s AND id_maker = %s",
            [id_pedido, id_maker],
        )
        return cursor.fetchone() is not None


def insertar_cotizacion(id_pedido, id_maker, precio, comision, dias,
                        material_tipo, material_personalizado, mensaje):
    """Devuelve el id de la cotización, o None si el pedido no existe,
    no está abierto o es del propio maker."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO cotizaciones
                (id_pedido, id_maker, precio, comision, tiempo_estimado_dias,
                 material_tipo, material_personalizado, mensaje, estado)
            SELECT p.id_pedido, %s::integer, %s::numeric, %s::numeric, %s::integer,
                   %s::varchar, %s::varchar, %s::text, 'pendiente'
            FROM pedidos p
            WHERE p.id_pedido = %s AND p.estado = 'abierto' AND p.id_usuario <> %s::integer
            RETURNING id_cotizacion
            """,
            [id_maker, precio, comision, dias, material_tipo,
             material_personalizado, mensaje, id_pedido, id_maker],
        )
        fila = cursor.fetchone()
        return fila[0] if fila else None


def contacto_del_pedido(id_pedido):
    """Email y nombre del cliente dueño del pedido, y el título."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT u.email, u.nombre, p.titulo
            FROM pedidos p
            JOIN usuarios u ON u.id_usuario = p.id_usuario
            WHERE p.id_pedido = %s
            """,
            [id_pedido],
        )
        fila = cursor.fetchone()
        return dict(zip(["email", "nombre", "titulo"], fila)) if fila else None

# ---------------------------------------------------------------- Mis trabajos
ESTADOS_TRABAJO = ("asignado", "en_proceso", "listo_despacho", "en_transito", "finalizado")

# id del filtro del front -> textos que se buscan dentro de pedidos.material
MATERIALES_TRABAJO = {
    "nylon": ["Nylon", "PA12"],
    "petg": ["PETG"],
    "pla": ["PLA"],
    "tpu": ["TPU"],
    "carbono": ["Carbon", "-CF"],
}

COLUMNAS_TRABAJO = COLUMNAS + [
    "id_cotizacion", "precio", "tiempo_entrega_dias", "mensaje", "fecha_adjudicacion",
]

_DESDE_TRABAJOS = """
    FROM cotizaciones c
    JOIN pedidos p ON p.id_pedido = c.id_pedido
    JOIN usuarios u ON u.id_usuario = p.id_usuario
"""


def _filtros_trabajos(id_maker, estados, materiales):
    condiciones = ["c.id_maker = %s", "c.estado = 'aceptada'", "p.estado = ANY(%s)"]
    # Sin estados elegidos se muestran todos los estados de trabajo
    params = [id_maker, list(estados) if estados else list(ESTADOS_TRABAJO)]

    if materiales:
        textos = [t for m in materiales for t in MATERIALES_TRABAJO[m]]
        condiciones.append("(" + " OR ".join(["p.material ILIKE %s"] * len(textos)) + ")")
        params += [f"%{t}%" for t in textos]

    return " AND ".join(condiciones), params


def contar_trabajos(id_maker, estados, materiales):
    donde, params = _filtros_trabajos(id_maker, estados, materiales)
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT COUNT(*) {_DESDE_TRABAJOS} WHERE {donde}", params)
        return cursor.fetchone()[0]


def listar_trabajos(id_maker, estados, materiales, limite, desplazamiento):
    donde, params = _filtros_trabajos(id_maker, estados, materiales)
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT p.id_pedido, p.id_usuario, u.nombre AS nombre_usuario,
                   p.titulo, p.descripcion, p.cantidad, p.material, p.color,
                   p.archivo_url, p.fecha_limite, p.estado, p.fecha_creacion,
                   p.ubicacion,
                   c.id_cotizacion, c.precio,
                   c.tiempo_estimado_dias AS tiempo_entrega_dias, c.mensaje,
                   COALESCE(c.fecha_aceptacion, p.fecha_creacion) AS fecha_adjudicacion
            {_DESDE_TRABAJOS}
            WHERE {donde}
            ORDER BY COALESCE(c.fecha_aceptacion, p.fecha_creacion) DESC, c.id_cotizacion DESC
            LIMIT %s OFFSET %s
            """,
            params + [limite, desplazamiento],
        )
        return [dict(zip(COLUMNAS_TRABAJO, fila)) for fila in cursor.fetchall()]


def facetas_trabajos(id_maker):
    """Contadores para los filtros: cuántos trabajos hay por estado y por material."""
    base = f"""
        {_DESDE_TRABAJOS}
        WHERE c.id_maker = %s AND c.estado = 'aceptada' AND p.estado = ANY(%s)
    """
    estados = list(ESTADOS_TRABAJO)

    with connection.cursor() as cursor:
        cursor.execute(f"SELECT p.estado, COUNT(*) {base} GROUP BY p.estado", [id_maker, estados])
        por_estado = {e: 0 for e in ESTADOS_TRABAJO}
        por_estado.update({estado: cantidad for estado, cantidad in cursor.fetchall()})

        partes, params = [], []
        for textos in MATERIALES_TRABAJO.values():
            condicion = " OR ".join(["p.material ILIKE %s"] * len(textos))
            partes.append(f"COUNT(*) FILTER (WHERE {condicion})")
            params += [f"%{t}%" for t in textos]
        cursor.execute(f"SELECT {', '.join(partes)} {base}", params + [id_maker, estados])
        por_material = dict(zip(MATERIALES_TRABAJO, cursor.fetchone()))

    return {"status": por_estado, "materials": por_material}

# ------------------------------------------------- Avanzar el estado de un trabajo
# Orden en el que el maker puede avanzar un trabajo propio
SIGUIENTE_ESTADO = {
    "asignado": "en_proceso",
    "en_proceso": "listo_despacho",
    "listo_despacho": "en_transito",
}

_ES_TRABAJO_DEL_MAKER = """
    EXISTS (
        SELECT 1 FROM cotizaciones c
        WHERE c.id_pedido = pedidos.id_pedido
          AND c.id_maker = %s
          AND c.estado = 'aceptada'
    )
"""


def estado_de_trabajo(id_pedido, id_maker):
    """Estado actual del pedido si el maker tiene la cotización aceptada; si no, None."""
    with connection.cursor() as cursor:
        cursor.execute(
            f"SELECT estado FROM pedidos WHERE id_pedido = %s AND {_ES_TRABAJO_DEL_MAKER}",
            [id_pedido, id_maker],
        )
        fila = cursor.fetchone()
        return fila[0] if fila else None


def cambiar_estado_trabajo(id_pedido, id_maker, desde, hacia):
    """Cambia el estado solo si todavía es `desde` (evita saltear estados con un doble clic).
    Devuelve True si cambió."""
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            UPDATE pedidos SET estado = %s
            WHERE id_pedido = %s AND estado = %s AND {_ES_TRABAJO_DEL_MAKER}
            """,
            [hacia, id_pedido, desde, id_maker],
        )
        return cursor.rowcount == 1