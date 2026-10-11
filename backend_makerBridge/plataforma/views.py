import json

from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .auth import crear_token, requiere_rol
from .models import Usuario


def leer_json(request):
    """Lee el JSON que manda React. Devuelve None si viene mal armado."""
    try:
        return json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@csrf_exempt
@require_POST
def register_user(request):
    datos = leer_json(request)
    if datos is None:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    nombre = str(datos.get("nombre", "")).strip()
    email = str(datos.get("email", "")).strip().lower()
    password = str(datos.get("password", ""))
    rol = datos.get("rol")

    if not nombre or not email or not password:
        return JsonResponse({"error": "Faltan datos"}, status=400)

    # Por registro público solo se puede ser cliente o maker (admin se crea a mano)
    if rol not in ("cliente", "maker"):
        return JsonResponse({"error": "Rol no válido"}, status=400)

    if Usuario.objects.filter(email=email).exists():
        return JsonResponse({"error": "Ese email ya está registrado"}, status=409)

    usuario = Usuario.objects.create(
        nombre=nombre,
        email=email,
        password_hash=make_password(password),  # se guarda encriptada
        rol=rol,
    )

    return JsonResponse(
        {"mensaje": "Usuario registrado", "id_usuario": usuario.id_usuario},
        status=201,
    )


@csrf_exempt
@require_POST
def login_user(request):
    datos = leer_json(request)
    if datos is None:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    email = str(datos.get("email", "")).strip().lower()
    password = str(datos.get("password", ""))

    usuario = Usuario.objects.filter(email=email).first()

    # Mismo mensaje para "no existe" y "contraseña mala"
    if usuario is None or not check_password(password, usuario.password_hash):
        return JsonResponse({"error": "Email o contraseña incorrectos"}, status=401)

    if not usuario.activo:
        return JsonResponse({"error": "Usuario desactivado"}, status=403)

    return JsonResponse(
        {
            "mensaje": "Login exitoso",
            "token": crear_token(usuario),
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol,
            },
        },
        status=200,
    )


@require_GET
@requiere_rol("cliente", "maker", "admin")
def me(request):
    """Devuelve el usuario del token. React lo usa para validar la sesión."""
    u = request.usuario
    return JsonResponse(
        {
            "usuario": {
                "id_usuario": u.id_usuario,
                "nombre": u.nombre,
                "email": u.email,
                "rol": u.rol,
            }
        }
    )


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