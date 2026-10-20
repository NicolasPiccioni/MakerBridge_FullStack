from datetime import timedelta, timezone

from django.http import JsonResponse
from django.views.decorators.http import require_GET

from plataforma.auth import requiere_rol

from . import consultas

# Argentina no tiene horario de verano: siempre UTC-3
ARGENTINA = timezone(timedelta(hours=-3))

# Un maker solo puede explorar pedidos abiertos; los demás estados son
# trabajos en curso de otros makers y datos privados de los clientes.
ESTADOS_EXPLORABLES = ("abierto",)

PAGE_SIZE_POR_DEFECTO = 10
PAGE_SIZE_MAXIMO = 50


def error_json(mensaje, status=400):
    return JsonResponse({"error": mensaje}, status=status)


def leer_entero(request, nombre, por_defecto, minimo, maximo=None):
    """Devuelve (valor, error). Si el parámetro no viene, usa el valor por defecto."""
    crudo = request.GET.get(nombre)
    if crudo is None:
        return por_defecto, None
    try:
        valor = int(crudo)
    except ValueError:
        return None, f"{nombre} debe ser un número entero"
    if valor < minimo:
        return None, f"{nombre} debe ser mayor o igual a {minimo}"
    if maximo is not None and valor > maximo:
        return None, f"{nombre} no puede ser mayor a {maximo}"
    return valor, None


def pedido_a_json(fila):
    creado = fila["fecha_creacion"]
    if creado is not None:
        if creado.tzinfo is None:           # la base guarda la hora en UTC
            creado = creado.replace(tzinfo=timezone.utc)
        creado = creado.astimezone(ARGENTINA).isoformat()

    limite = fila["fecha_limite"]
    return {
        **fila,
        "fecha_creacion": creado,
        "fecha_limite": limite.isoformat() if limite else None,
    }


@require_GET
@requiere_rol("maker")
def listar_pedidos(request):
    estado = request.GET.get("estado", "abierto")
    if estado not in ESTADOS_EXPLORABLES:
        return error_json("Por ahora solo se pueden explorar pedidos con estado 'abierto'")

    page, error = leer_entero(request, "page", 1, 1)
    if error:
        return error_json(error)

    page_size, error = leer_entero(
        request, "page_size", PAGE_SIZE_POR_DEFECTO, 1, PAGE_SIZE_MAXIMO
    )
    if error:
        return error_json(error)

    filas = consultas.listar_pedidos_por_estado(
        estado, limite=page_size, desplazamiento=(page - 1) * page_size
    )

    return JsonResponse(
        {
            "count": consultas.contar_pedidos(estado),
            "results": [pedido_a_json(f) for f in filas],
        }
    )