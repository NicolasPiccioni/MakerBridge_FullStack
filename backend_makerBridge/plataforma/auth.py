import datetime
from functools import wraps

import jwt
from django.conf import settings
from django.http import JsonResponse

from .models import Usuario

DURACION_HORAS = 8


def crear_token(usuario):
    ahora = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(usuario.id_usuario),
        "iat": ahora,
        "exp": ahora + datetime.timedelta(hours=DURACION_HORAS),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def requiere_rol(*roles_permitidos):
    """Protege una vista: exige token válido y que el rol esté permitido."""

    def decorador(vista):
        @wraps(vista)
        def envoltura(request, *args, **kwargs):
            cabecera = request.headers.get("Authorization", "")
            if not cabecera.startswith("Bearer "):
                return JsonResponse({"error": "Tenés que iniciar sesión"}, status=401)

            token = cabecera[len("Bearer "):]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                id_usuario = int(payload["sub"])
            except jwt.ExpiredSignatureError:
                return JsonResponse({"error": "La sesión expiró"}, status=401)
            except (jwt.InvalidTokenError, KeyError, ValueError):
                return JsonResponse({"error": "Token inválido"}, status=401)

            usuario = Usuario.objects.filter(id_usuario=id_usuario, activo=True).first()
            if usuario is None:
                return JsonResponse({"error": "Usuario no válido"}, status=401)

            # El rol se lee de la base de datos, no del token
            if roles_permitidos and usuario.rol not in roles_permitidos:
                return JsonResponse({"error": "No tenés permiso para esto"}, status=403)

            request.usuario = usuario
            return vista(request, *args, **kwargs)

        return envoltura

    return decorador