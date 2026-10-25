import json
from datetime import date, datetime, timedelta, timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods

from plataforma.auth import requiere_rol

from . import consultas, correo

# Argentina no tiene horario de verano: siempre UTC-3
ARGENTINA = timezone(timedelta(hours=-3))

PAGE_SIZE_POR_DEFECTO = 10
PAGE_SIZE_MAXIMO = 50
CANTIDAD_MAXIMA = 10_000

# nombre: (etiqueta, obligatorio, largo máximo)  -> los máximos son los de la tabla
CAMPOS_TEXTO = {
    "titulo": ("El título", True, 200),
    "descripcion": ("La descripción", True, 2000),
    "material": ("El material", True, 50),
    "color": ("El color", False, 50),
    "ubicacion": ("La ubicación", True, 150),
    "archivo_url": ("El link del archivo", False, 300),
}


# ------------------------------------------------------------------ Ayudas
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


def leer_entero(request, nombre, por_defecto, minimo, maximo=None):
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


def leer_lista(request, nombre):
    """'a,b,a' -> ['a', 'b'] (sin repetidos y en minúscula)."""
    crudo = request.GET.get(nombre, "")
    return list(dict.fromkeys(x.strip().lower() for x in crudo.split(",") if x.strip()))


def entero_positivo(valor, maximo):
    if isinstance(valor, bool):
        return None
    if isinstance(valor, float) and valor.is_integer():
        valor = int(valor)
    if isinstance(valor, int) and 1 <= valor <= maximo:
        return valor
    return None


def hora_argentina(valor):
    if valor is None:
        return None
    if valor.tzinfo is None:        # la base guarda la hora en UTC
        valor = valor.replace(tzinfo=timezone.utc)
    return valor.astimezone(ARGENTINA).isoformat()


def numero(valor):
    """28500.00 (Decimal) -> 28500, para que el front lo muestre como número."""
    if valor is None:
        return None
    return int(valor) if valor == int(valor) else float(valor)


def pedido_a_json(fila):
    limite = fila["fecha_limite"]
    return {
        **fila,
        "fecha_creacion": hora_argentina(fila["fecha_creacion"]),
        "fecha_limite": limite.isoformat() if limite else None,
        "precio_aceptado": numero(fila["precio_aceptado"]),
    }


# --------------------------------------------------- Mis pedidos (listar / crear)
def _listar_pedidos(request):
    page, error = leer_entero(request, "page", 1, 1)
    if error:
        return error_json(error)

    page_size, error = leer_entero(request, "page_size", PAGE_SIZE_POR_DEFECTO, 1, PAGE_SIZE_MAXIMO)
    if error:
        return error_json(error)

    estados = leer_lista(request, "status")
    desconocidos = [e for e in estados if e not in consultas.ESTADOS_PEDIDO]
    if desconocidos:
        return error_json("status desconocidos: " + ", ".join(desconocidos))

    materiales = leer_lista(request, "materials")
    desconocidos = [m for m in materiales if m not in consultas.MATERIALES]
    if desconocidos:
        return error_json("materials desconocidos: " + ", ".join(desconocidos))

    ubicacion = request.GET.get("location", "all")
    if ubicacion != "all" and ubicacion not in consultas.UBICACIONES:
        return error_json("location debe ser: all, " + ", ".join(consultas.UBICACIONES))

    # El id sale del token: un cliente solo ve sus propios pedidos
    id_usuario = request.usuario.id_usuario

    filas = consultas.listar_pedidos(
        id_usuario, estados, materiales, ubicacion,
        limite=page_size, desplazamiento=(page - 1) * page_size,
    )
    return JsonResponse(
        {
            "count": consultas.contar_pedidos(id_usuario, estados, materiales, ubicacion),
            "results": [pedido_a_json(f) for f in filas],
        }
    )


def _crear_pedido(request):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido")

    textos = {}
    for nombre, (etiqueta, obligatorio, maximo) in CAMPOS_TEXTO.items():
        valor = datos.get(nombre)
        valor = valor.strip() if isinstance(valor, str) else ""
        if obligatorio and not valor:
            return error_json(f"{etiqueta} es obligatorio", campo=nombre)
        if len(valor) > maximo:
            return error_json(f"{etiqueta} no puede superar {maximo} caracteres", campo=nombre)
        textos[nombre] = valor

    # Un link web, o una ruta que subió ESTE mismo cliente (así no puede adjuntar archivos ajenos)
    archivo = textos["archivo_url"]
    es_link = archivo.lower().startswith(("http://", "https://"))
    es_propio = archivo.startswith(f"pedidos/{request.usuario.id_usuario}/") and ".." not in archivo
    if archivo and not (es_link or es_propio):
        return error_json("El archivo no es válido: subilo de nuevo o pegá un link que empiece con https://",
                          campo="archivo_url")

    cantidad = entero_positivo(datos.get("cantidad"), CANTIDAD_MAXIMA)
    if cantidad is None:
        return error_json(f"La cantidad debe ser un número entre 1 y {CANTIDAD_MAXIMA}", campo="cantidad")

    try:
        fecha_limite = date.fromisoformat(str(datos.get("fecha_limite")))
    except ValueError:
        return error_json("La fecha límite debe tener el formato AAAA-MM-DD", campo="fecha_limite")
    if fecha_limite < datetime.now(ARGENTINA).date():
        return error_json("La fecha límite no puede ser anterior a hoy", campo="fecha_limite")

    id_pedido = consultas.crear_pedido(
        request.usuario.id_usuario,
        textos["titulo"], textos["descripcion"], cantidad, textos["material"],
        textos["color"], textos["archivo_url"], fecha_limite, textos["ubicacion"],
    )
    return JsonResponse({"mensaje": "Pedido publicado", "id_pedido": id_pedido, "estado": "abierto"},
                        status=201)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@requiere_rol("cliente")
def pedidos(request):
    if request.method == "GET":
        return _listar_pedidos(request)
    return _crear_pedido(request)


# ---------------------------------------------------- Cotizaciones de un pedido
@require_GET
@requiere_rol("cliente")
def cotizaciones_de_pedido(request, id_pedido):
    resultado = consultas.cotizaciones_del_pedido(id_pedido, request.usuario.id_usuario)
    if resultado is None:
        return error_json("No encontramos ese pedido", status=404)

    pedido, cotizaciones = resultado
    return JsonResponse(
        {
            "pedido": pedido,
            "cotizaciones": [
                {
                    **c,
                    "precio": numero(c["precio"]),
                    "fecha_creacion": hora_argentina(c["fecha_creacion"]),
                }
                for c in cotizaciones
            ],
        }
    )


# ------------------------------------------------------------ Aceptar y cerrar
@csrf_exempt
@require_POST
@requiere_rol("cliente")
def aceptar_cotizacion(request, id_cotizacion):
    cliente = request.usuario
    resultado, datos = consultas.aceptar_cotizacion(id_cotizacion, cliente.id_usuario)

    if resultado == "no_existe":
        return error_json("No encontramos esa cotización", status=404)
    if resultado == "no_abierto":
        return error_json("Este pedido ya no está abierto a cotizaciones", status=409)
    if resultado == "no_pendiente":
        return error_json("Esa cotización ya no está disponible", status=409)

    # El mail no puede romper la aceptación: ya quedó guardada
    maker = consultas.contacto_usuario(datos["id_maker"])
    mail_enviado = False
    if maker:
        mail_enviado = correo.enviar_aviso_aceptacion(
            destinatario=maker["email"],
            nombre_maker=maker["nombre"],
            nombre_cliente=cliente.nombre,
            titulo_pedido=consultas.titulo_pedido(datos["id_pedido"]) or f"#MK-{datos['id_pedido']}",
            precio=datos["precio"],
        )

    return JsonResponse(
        {
            "mensaje": "Cotización aceptada",
            "id_pedido": datos["id_pedido"],
            "estado": "asignado",
            "precio": numero(datos["precio"]),
            "mail_enviado": mail_enviado,
        }
    )


@csrf_exempt
@require_POST
@requiere_rol("cliente")
def confirmar_recepcion(request, id_pedido):
    cliente = request.usuario
    resultado, datos = consultas.confirmar_recepcion(id_pedido, cliente.id_usuario)

    if resultado == "no_existe":
        return error_json("No encontramos ese pedido", status=404)
    if resultado == "estado_incorrecto":
        return error_json("Solo podés confirmar la recepción de un pedido que está en tránsito",
                          status=409)

    mail_enviado = False
    if datos["maker"]:
        mail_enviado = correo.enviar_aviso_recepcion(
            destinatario=datos["maker"]["email"],
            nombre_maker=datos["maker"]["nombre"],
            nombre_cliente=cliente.nombre,
            titulo_pedido=datos["titulo"] or f"#MK-{id_pedido}",
        )

    return JsonResponse(
        {"mensaje": "Recepción confirmada", "id_pedido": id_pedido,
         "estado": "finalizado", "mail_enviado": mail_enviado}
    )