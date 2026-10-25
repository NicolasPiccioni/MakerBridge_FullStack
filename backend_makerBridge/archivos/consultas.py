from django.db import connection


def archivo_autorizado(id_pedido, id_usuario, rol):
    """Devuelve (autorizado, archivo_url). Puede ver el archivo:
    - el cliente dueño del pedido,
    - un maker, si el pedido está abierto o si tiene una cotización pendiente/aceptada,
    - un admin."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT p.archivo_url
            FROM pedidos p
            WHERE p.id_pedido = %s
              AND (
                    p.id_usuario = %s
                 OR %s::text = 'admin'
                 OR (
                      %s::text = 'maker'
                      AND (
                            p.estado = 'abierto'
                         OR EXISTS (
                              SELECT 1 FROM cotizaciones c
                              WHERE c.id_pedido = p.id_pedido
                                AND c.id_maker = %s
                                AND c.estado IN ('pendiente', 'aceptada')
                            )
                          )
                    )
                  )
            """,
            [id_pedido, id_usuario, rol, rol, id_usuario],
        )
        fila = cursor.fetchone()
        return (False, None) if fila is None else (True, fila[0])