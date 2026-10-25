import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from plataforma.auth import requiere_rol

from . import consultas, storage

logger = logging.getLogger(__name__)

EXTENSIONES_MODELO = ("stl", "obj", "step", "stp", "3mf")
TAMANO_MAXIMO_MB = 50


def error_json(mensaje, status=400, campo=None):
    cuerpo = {"error": mensaje}
    if campo:
        cuerpo["campo"] = campo
    return JsonResponse(cuerpo, status=status)


@csrf_exempt
@require_POST
@requiere_rol("cliente")
def subir_archivo(request):
    archivo = request.FILES.get("archivo")
    if archivo is None:
        return error_json("Falta el archivo", campo="archivo")

    base, extension = storage.partir_nombre(archivo.name)
    if extension not in EXTENSIONES_MODELO:
        return error_json("Formato no soportado. Usá STL, OBJ, STEP o 3MF.", campo="archivo")
    if archivo.size == 0:
        return error_json("El archivo está vacío", campo="archivo")
    if archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024:
        return error_json(f"El archivo supera los {TAMANO_MAXIMO_MB} MB.", status=413, campo="archivo")

    ruta = storage.ruta_nueva(request.usuario.id_usuario, base, extension)
    try:
        # Siempre como binario genérico: los navegadores mandan tipos distintos para un STL
        storage.subir(ruta, archivo.read(), "application/octet-stream")
    except storage.ErrorDeAlmacenamiento:
        logger.exception("No se pudo subir el archivo a Supabase Storage")
        return error_json("No pudimos guardar el archivo. Probá de nuevo en unos minutos.", status=502)

    return JsonResponse(
        {"archivo": ruta, "nombre": f"{base}.{extension}", "tamano": archivo.size},
        status=201,
    )


@require_GET
@requiere_rol("cliente", "maker", "admin")
def archivo_de_pedido(request, id_pedido):
    usuario = request.usuario
    autorizado, archivo = consultas.archivo_autorizado(id_pedido, usuario.id_usuario, usuario.rol)

    # Mismo mensaje si no existe, no tiene archivo o no sos quien puede verlo
    if not autorizado or not archivo:
        return error_json("No encontramos el archivo", status=404)

    url = storage.url_de_descarga(archivo)
    if url is None:
        return error_json("No pudimos generar el link de descarga. Probá de nuevo.", status=502)

    return JsonResponse(
        {"url": url, "nombre": storage.nombre_de_archivo(archivo), "expira_en": storage.EXPIRA_SEGUNDOS}
    )