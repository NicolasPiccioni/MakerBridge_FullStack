import json
import re

from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .auth import crear_token, requiere_rol
from .models import Usuario

# Por el registro público solo se puede ser cliente o maker (admin se crea a mano)
ROLES_REGISTRO = ("cliente", "maker")


def leer_json(request):
    """Lee el JSON que manda React. Devuelve None si viene mal armado."""
    try:
        return json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def error_json(mensaje, status, campo=None):
    """Respuesta de error con el mismo formato en todos lados."""
    cuerpo = {"error": mensaje}
    if campo:
        cuerpo["campo"] = campo  # para que React marque el campo con problema
    return JsonResponse(cuerpo, status=status)


def datos_usuario(u):
    """Los datos del usuario que se le devuelven a React (nunca la contraseña)."""
    return {
        "id_usuario": u.id_usuario,
        "nombre": u.nombre,
        "email": u.email,
        "rol": u.rol,
    }


@csrf_exempt
@require_POST
def register_user(request):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido", 400)

    nombre = str(datos.get("nombre", "")).strip()
    email = str(datos.get("email", "")).strip().lower()
    password = str(datos.get("password", ""))
    rol = datos.get("rol")

    # --- Validaciones ---
    if len(nombre) < 2:
        return error_json("Ingresá tu nombre y apellido", 400, "nombre")
    if len(nombre) > 150:
        return error_json("El nombre es demasiado largo", 400, "nombre")

    try:
        validate_email(email)
    except ValidationError:
        return error_json("El correo electrónico no es válido", 400, "email")
    if len(email) > 150:
        return error_json("El correo electrónico es demasiado largo", 400, "email")

    if len(password) < 8:
        return error_json("La contraseña debe tener al menos 8 caracteres", 400, "password")
    if len(password) > 128:
        return error_json("La contraseña es demasiado larga", 400, "password")
    if not (re.search(r"[A-Za-z]", password) and re.search(r"\d", password)):
        return error_json("La contraseña debe tener letras y números", 400, "password")

    if rol not in ROLES_REGISTRO:
        return error_json("Rol no válido", 400, "rol")

    # --- Crear el usuario ---
    if Usuario.objects.filter(email=email).exists():
        return error_json("Ese correo ya está registrado", 409, "email")

    try:
        usuario = Usuario.objects.create(
            nombre=nombre,
            email=email,
            password_hash=make_password(password),  # se guarda encriptada
            rol=rol,
        )
    except IntegrityError:
        # Dos pedidos al mismo tiempo con el mismo email: la base lo frena
        return error_json("Ese correo ya está registrado", 409, "email")

    # Devolvemos token + usuario, igual que el login: queda logueado al registrarse
    return JsonResponse(
        {
            "mensaje": "Usuario registrado",
            "token": crear_token(usuario),
            "usuario": datos_usuario(usuario),
        },
        status=201,
    )


@csrf_exempt
@require_POST
def login_user(request):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido", 400)

    email = str(datos.get("email", "")).strip().lower()
    password = str(datos.get("password", ""))

    usuario = Usuario.objects.filter(email=email).first()

    # Mismo mensaje para "no existe" y "contraseña mala"
    if usuario is None or not check_password(password, usuario.password_hash):
        return error_json("Email o contraseña incorrectos", 401)

    if not usuario.activo:
        return error_json("Usuario desactivado", 403)

    return JsonResponse(
        {
            "mensaje": "Login exitoso",
            "token": crear_token(usuario),
            "usuario": datos_usuario(usuario),
        },
        status=200,
    )


@require_GET
@requiere_rol("cliente", "maker", "admin")
def me(request):
    """Devuelve el usuario del token. React lo usa para validar la sesión."""
    return JsonResponse({"usuario": datos_usuario(request.usuario)})


@require_GET
@requiere_rol("cliente")
def panel_cliente(request):
    return JsonResponse({"mensaje": f"Panel de cliente de {request.usuario.nombre}"})


@require_GET
@requiere_rol("maker")
def panel_maker(request):
    return JsonResponse({"mensaje": f"Panel de maker de {request.usuario.nombre}"})


@require_GET
@requiere_rol("admin")
def panel_admin(request):
    return JsonResponse({"mensaje": f"Panel de admin de {request.usuario.nombre}"})