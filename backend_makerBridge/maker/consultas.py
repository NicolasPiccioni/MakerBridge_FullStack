from django.db import connection

COLUMNAS = [
    "id_pedido", "id_usuario", "nombre_usuario", "titulo", "descripcion",
    "cantidad", "material", "color", "archivo_url", "fecha_limite",
    "estado", "fecha_creacion", "ubicacion",
]


def contar_pedidos(estado):
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM pedidos WHERE estado = %s", [estado])
        return cursor.fetchone()[0]


def listar_pedidos_por_estado(estado, limite, desplazamiento):
    """Devuelve los pedidos de un estado, los más nuevos primero."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT p.id_pedido, p.id_usuario, u.nombre AS nombre_usuario,
                   p.titulo, p.descripcion, p.cantidad, p.material, p.color,
                   p.archivo_url, p.fecha_limite, p.estado, p.fecha_creacion,
                   p.ubicacion
            FROM pedidos p
            JOIN usuarios u ON u.id_usuario = p.id_usuario
            WHERE p.estado = %s
            ORDER BY p.fecha_creacion DESC, p.id_pedido DESC
            LIMIT %s OFFSET %s
            """,
            [estado, limite, desplazamiento],
        )
        return [dict(zip(COLUMNAS, fila)) for fila in cursor.fetchall()]