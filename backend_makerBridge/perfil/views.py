import json
import re

from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST

from plataforma.auth import requiere_rol

from . import consultas

ROLES = ("cliente", "maker", "admin")

# campo, etiqueta, largo máximo, patrón (o None), mensaje si no cumple el patrón
OPCIONALES = [
    ("telefono", "El teléfono", 30, re.compile(r"[0-9+()\s-]{6,30}"),
     "El teléfono solo puede tener números, espacios y los símbolos + - ( )"),
    ("localidad", "La localidad", 100, None, None),
    ("direccion", "La dirección", 200, None, None),
    ("codigo_postal", "El código postal", 10, re.compile(r"[A-Za-z0-9 -]{3,10}"),
     "El código postal no es válido"),
]


def error_json(mensaje, status=400, campo=None):
    cuerpo = {"error": mensaje}
    if campo:
        cuerpo["campo"] = campo
    return JsonResponse(cuerpo, status=status)


def leer_json(request):
    try:
        return json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def perfil_a_json(f):
    registro = f["fecha_registro"]
    return {
        "id_usuario": f["id_usuario"],
        "codigo": f"MB-{registro.year}-{f['id_usuario']:04d}",  # se arma, no se guarda
        "nombre": f["nombre"],
        "email": f["email"],
        "rol": f["rol"],
        "estado": "Activa" if f["activo"] else "Inactiva",
        "fecha_registro": registro.date().isoformat(),
        "telefono": f["telefono"] or "",
        "localidad": f["localidad"] or "",
        "direccion": f["direccion"] or "",
        "codigo_postal": f["codigo_postal"] or "",
        "notif_whatsapp": f["notif_whatsapp"],
        "notif_email": f["notif_email"],
    }


def validar_cambios(datos):
    """Devuelve (cambios, None) o (None, (mensaje, campo)). Los campos que no están en la
    lista blanca (email, rol, activo...) se ignoran: no hay forma de cambiarlos desde acá."""
    cambios = {}

    if "nombre" in datos:
        nombre = datos["nombre"]
        nombre = nombre.strip() if isinstance(nombre, str) else ""
        if len(nombre) < 2:
            return None, ("Ingresá tu nombre y apellido", "nombre")
        if len(nombre) > 150:
            return None, ("El nombre es demasiado largo", "nombre")
        cambios["nombre"] = nombre

    for campo, etiqueta, maximo, patron, mensaje in OPCIONALES:
        if campo not in datos:
            continue
        valor = datos[campo]
        if valor is not None and not isinstance(valor, str):
            return None, (f"{etiqueta} no es válido", campo)
        valor = (valor or "").strip()
        if len(valor) > maximo:
            return None, (f"{etiqueta} no puede superar {maximo} caracteres", campo)
        if valor and patron and not patron.fullmatch(valor):
            return None, (mensaje, campo)
        cambios[campo] = valor or None

    for campo in ("notif_whatsapp", "notif_email"):
        if campo in datos:
            if not isinstance(datos[campo], bool):
                return None, ("Las preferencias de aviso deben ser verdadero o falso", campo)
            cambios[campo] = datos[campo]

    return cambios, None


@csrf_exempt
@require_http_methods(["GET", "PATCH"])
@requiere_rol(*ROLES)
def perfil(request):
    id_usuario = request.usuario.id_usuario

    if request.method == "GET":
        return JsonResponse(perfil_a_json(consultas.obtener_perfil(id_usuario)))

    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido")

    cambios, problema = validar_cambios(datos)
    if problema:
        return error_json(problema[0], campo=problema[1])
    if not cambios:
        return error_json("No hay cambios para guardar")

    return JsonResponse(perfil_a_json(consultas.actualizar_perfil(id_usuario, cambios)))


@csrf_exempt
@require_POST
@requiere_rol(*ROLES)
def cambiar_password(request):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido")

    actual = datos.get("actual") if isinstance(datos.get("actual"), str) else ""
    nueva = datos.get("nueva") if isinstance(datos.get("nueva"), str) else ""

    # Con 400 y no 401: el front interpreta un 401 como "sesión vencida" y te saca al login
    hash_actual = consultas.password_hash_de(request.usuario.id_usuario)
    if not hash_actual or not check_password(actual, hash_actual):
        return error_json("La contraseña actual no es correcta", campo="actual")

    if len(nueva) < 8:
        return error_json("La contraseña nueva debe tener al menos 8 caracteres", campo="nueva")
    if len(nueva) > 128:
        return error_json("La contraseña nueva es demasiado larga", campo="nueva")
    if not (re.search(r"[A-Za-z]", nueva) and re.search(r"\d", nueva)):
        return error_json("La contraseña nueva debe tener letras y números", campo="nueva")
    if nueva == actual:
        return error_json("La contraseña nueva tiene que ser distinta de la actual", campo="nueva")

    consultas.guardar_password_hash(request.usuario.id_usuario, make_password(nueva))
    return JsonResponse({"mensaje": "Contraseña actualizada"})