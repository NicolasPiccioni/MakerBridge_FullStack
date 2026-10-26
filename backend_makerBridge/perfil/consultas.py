from django.db import connection

COLUMNAS = [
    "id_usuario", "nombre", "email", "rol", "activo", "fecha_registro",
    "telefono", "localidad", "direccion", "codigo_postal",
    "notif_whatsapp", "notif_email",
]

# Lista blanca: campo de la API -> columna. Solo estos se pueden editar.
# El email, el rol, "activo" y la contraseña NO están acá a propósito.
EDITABLES = {
    "nombre": "nombre",
    "telefono": "telefono",
    "localidad": "localidad",
    "direccion": "direccion",
    "codigo_postal": "codigo_postal",
    "notif_whatsapp": "notif_whatsapp",
    "notif_email": "notif_email",
}


def obtener_perfil(id_usuario):
    with connection.cursor() as cursor:
        cursor.execute(
            f"SELECT {', '.join(COLUMNAS)} FROM usuarios WHERE id_usuario = %s",
            [id_usuario],
        )
        fila = cursor.fetchone()
        return dict(zip(COLUMNAS, fila)) if fila else None


def actualizar_perfil(id_usuario, cambios):
    """`cambios` ya viene validado y solo con claves de EDITABLES.
    Los nombres de columna salen de la lista blanca; los valores van como parámetros."""
    asignaciones = ", ".join(f"{EDITABLES[campo]} = %s" for campo in cambios)
    with connection.cursor() as cursor:
        cursor.execute(
            f"UPDATE usuarios SET {asignaciones} WHERE id_usuario = %s",
            [*cambios.values(), id_usuario],
        )
    return obtener_perfil(id_usuario)


def password_hash_de(id_usuario):
    with connection.cursor() as cursor:
        cursor.execute("SELECT password_hash FROM usuarios WHERE id_usuario = %s", [id_usuario])
        fila = cursor.fetchone()
        return fila[0] if fila else None


def guardar_password_hash(id_usuario, nuevo_hash):
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE usuarios SET password_hash = %s WHERE id_usuario = %s",
            [nuevo_hash, id_usuario],
        )