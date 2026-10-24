import json
from datetime import timedelta, timezone

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from plataforma.auth import requiere_rol

from . import consultas, correo

# Argentina no tiene horario de verano: siempre UTC-3
ARGENTINA = timezone(timedelta(hours=-3))

# Un maker solo puede explorar pedidos abiertos; los demás estados son
# trabajos en curso y datos privados de los clientes.
ESTADOS_EXPLORABLES = ("abierto",)

UBICACIONES_VALIDAS = ("all", "caba", "cordoba", "pickup")
PAGE_SIZE_POR_DEFECTO = 10
PAGE_SIZE_MAXIMO = 50
LARGO_MAXIMO_BUSQUEDA = 100

# Cotización
COMISION_PORCENTAJE = 5            # la calcula el servidor, no el navegador
PRECIO_MAXIMO = 99_999_999
DIAS_MAXIMOS = 90
MATERIALES_COTIZACION = ("pla", "petg", "tpu", "otro")
LARGO_MAXIMO_MENSAJE = 800
LARGO_MAXIMO_MATERIAL = 100


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


def entero_positivo(valor, maximo):
    """Acepta 28500 o 28500.0 (no True/False ni texto). Devuelve el entero o None."""
    if isinstance(valor, bool):
        return None
    if isinstance(valor, float) and valor.is_integer():
        valor = int(valor)
    if isinstance(valor, int) and 1 <= valor <= maximo:
        return valor
    return None


def calcular_comision(precio):
    """5% redondeado al peso más cercano (igual que el cálculo que muestra el front)."""
    return (precio * COMISION_PORCENTAJE + 50) // 100


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

    q = request.GET.get("q", "").strip()[:LARGO_MAXIMO_BUSQUEDA]

    orden = request.GET.get("sort", "recent")
    if orden not in consultas.ORDEN:
        return error_json("sort debe ser: " + ", ".join(consultas.ORDEN))

    ubicacion = request.GET.get("location", "all")
    if ubicacion not in UBICACIONES_VALIDAS:
        return error_json("location debe ser: " + ", ".join(UBICACIONES_VALIDAS))

    crudo = request.GET.get("materials", "")
    materiales = list(dict.fromkeys(m.strip().lower() for m in crudo.split(",") if m.strip()))
    desconocidos = [m for m in materiales if m not in consultas.MATERIALES]
    if desconocidos:
        return error_json("materials desconocidos: " + ", ".join(desconocidos))

    filas = consultas.listar_pedidos(
        estado, q=q, materiales=materiales, ubicacion=ubicacion, orden=orden,
        limite=page_size, desplazamiento=(page - 1) * page_size,
    )

    return JsonResponse(
        {
            "count": consultas.contar_pedidos(estado, q, materiales, ubicacion),
            "results": [pedido_a_json(f) for f in filas],
        }
    )


@require_GET
@requiere_rol("maker")
def detalle_pedido(request, id_pedido):
    pedido = consultas.obtener_pedido(id_pedido)

    # Mismo mensaje si no existe o si no es explorable: no revelamos qué ids existen
    if pedido is None or pedido["estado"] not in ESTADOS_EXPLORABLES:
        return error_json("No encontramos ese pedido", status=404)

    return JsonResponse(pedido_a_json(pedido))


@csrf_exempt
@require_POST
@requiere_rol("maker")
def crear_cotizacion(request, id_pedido):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido")

    precio = entero_positivo(datos.get("precio"), PRECIO_MAXIMO)
    if precio is None:
        return error_json("El precio debe ser un número entero mayor a 0", campo="precio")

    dias = entero_positivo(datos.get("tiempo_entrega_dias"), DIAS_MAXIMOS)
    if dias is None:
        return error_json(f"El plazo debe ser de 1 a {DIAS_MAXIMOS} días", campo="tiempo_entrega_dias")

    material_tipo = datos.get("material_tipo")
    if material_tipo not in MATERIALES_COTIZACION:
        return error_json("Material no válido", campo="material_tipo")

    material_personalizado = ""
    if material_tipo == "otro":
        material_personalizado = str(datos.get("material_personalizado") or "").strip()
        if len(material_personalizado) > LARGO_MAXIMO_MATERIAL:
            return error_json("El material personalizado es demasiado largo",
                              campo="material_personalizado")

    mensaje = str(datos.get("mensaje") or "").strip()
    if len(mensaje) > LARGO_MAXIMO_MENSAJE:
        return error_json(f"El mensaje no puede superar {LARGO_MAXIMO_MENSAJE} caracteres",
                          campo="mensaje")

    maker = request.usuario

    if consultas.existe_cotizacion(id_pedido, maker.id_usuario):
        return error_json("Ya cotizaste este pedido", status=409)

    comision = calcular_comision(precio)

    try:
        id_cotizacion = consultas.insertar_cotizacion(
            id_pedido, maker.id_usuario, precio, comision, dias,
            material_tipo, material_personalizado, mensaje,
        )
    except IntegrityError:
        # Dos pedidos simultáneos del mismo maker: el índice único frena el segundo
        return error_json("Ya cotizaste este pedido", status=409)

    if id_cotizacion is None:
        return error_json("No encontramos ese pedido o ya no está abierto", status=404)

    # El aviso al cliente no puede romper la cotización: si el mail falla, se avisa en la respuesta
    contacto = consultas.contacto_del_pedido(id_pedido)
    mail_enviado = False
    if contacto:
        mail_enviado = correo.enviar_aviso_cotizacion(
            destinatario=contacto["email"],
            nombre_cliente=contacto["nombre"],
            titulo_pedido=contacto["titulo"] or f"#MK-{id_pedido}",
            nombre_maker=maker.nombre,
            precio=precio,
            dias=dias,
            material_tipo=material_tipo,
            material_personalizado=material_personalizado,
            mensaje=mensaje,
        )

    return JsonResponse(
        {
            "mensaje": "Cotización enviada",
            "id_cotizacion": id_cotizacion,
            "precio": precio,
            "comision": comision,
            "neto": precio - comision,
            "mail_enviado": mail_enviado,
        },
        status=201,
    )

# ---------------------------------------------------------------- Mis trabajos
def leer_lista(request, nombre):
    """'a,b,a' -> ['a', 'b'] (sin repetidos y en minúscula)."""
    crudo = request.GET.get(nombre, "")
    return list(dict.fromkeys(x.strip().lower() for x in crudo.split(",") if x.strip()))


def _hora_argentina(valor):
    if valor is None:
        return None
    if valor.tzinfo is None:        # la base guarda la hora en UTC
        valor = valor.replace(tzinfo=timezone.utc)
    return valor.astimezone(ARGENTINA).isoformat()


def _numero(valor):
    """28500.00 (Decimal) -> 28500, para que el front lo muestre como número."""
    if valor is None:
        return None
    return int(valor) if valor == int(valor) else float(valor)


def trabajo_a_json(fila):
    limite = fila["fecha_limite"]
    return {
        **fila,
        "fecha_creacion": _hora_argentina(fila["fecha_creacion"]),
        "fecha_adjudicacion": _hora_argentina(fila["fecha_adjudicacion"]),
        "fecha_limite": limite.isoformat() if limite else None,
        "precio": _numero(fila["precio"]),
    }


@require_GET
@requiere_rol("maker")
def listar_trabajos(request):
    page, error = leer_entero(request, "page", 1, 1)
    if error:
        return error_json(error)

    page_size, error = leer_entero(
        request, "page_size", PAGE_SIZE_POR_DEFECTO, 1, PAGE_SIZE_MAXIMO
    )
    if error:
        return error_json(error)

    estados = leer_lista(request, "status")
    desconocidos = [e for e in estados if e not in consultas.ESTADOS_TRABAJO]
    if desconocidos:
        return error_json("status desconocidos: " + ", ".join(desconocidos))

    materiales = leer_lista(request, "materials")
    desconocidos = [m for m in materiales if m not in consultas.MATERIALES_TRABAJO]
    if desconocidos:
        return error_json("materials desconocidos: " + ", ".join(desconocidos))

    # El id sale del token: un maker solo ve sus propios trabajos
    id_maker = request.usuario.id_usuario

    filas = consultas.listar_trabajos(
        id_maker, estados, materiales,
        limite=page_size, desplazamiento=(page - 1) * page_size,
    )

    return JsonResponse(
        {
            "count": consultas.contar_trabajos(id_maker, estados, materiales),
            "results": [trabajo_a_json(f) for f in filas],
            "facets": consultas.facetas_trabajos(id_maker),
        }
    )

@csrf_exempt
@require_POST
@requiere_rol("maker")
def avanzar_trabajo(request, id_pedido):
    datos = leer_json(request)
    if not isinstance(datos, dict):
        return error_json("JSON inválido")

    desde = datos.get("desde")
    if desde not in consultas.SIGUIENTE_ESTADO:
        return error_json("Ese estado no se puede avanzar desde acá", campo="desde")

    maker = request.usuario
    actual = consultas.estado_de_trabajo(id_pedido, maker.id_usuario)

    # Mismo mensaje si no existe o es de otro maker: no revelamos qué ids existen
    if actual is None:
        return error_json("No encontramos ese trabajo", status=404)
    if actual != desde:
        return error_json("El estado del trabajo cambió. Recargá la página.", status=409)

    hacia = consultas.SIGUIENTE_ESTADO[desde]
    if not consultas.cambiar_estado_trabajo(id_pedido, maker.id_usuario, desde, hacia):
        return error_json("El estado del trabajo cambió. Recargá la página.", status=409)

    # Si el mail falla, el cambio de estado igual queda guardado
    contacto = consultas.contacto_del_pedido(id_pedido)
    mail_enviado = False
    if contacto:
        mail_enviado = correo.enviar_aviso_estado(
            destinatario=contacto["email"],
            nombre_cliente=contacto["nombre"],
            titulo_pedido=contacto["titulo"] or f"#MK-{id_pedido}",
            nombre_maker=maker.nombre,
            estado_nuevo=hacia,
        )

    return JsonResponse(
        {"mensaje": "Estado actualizado", "id_pedido": id_pedido,
         "estado": hacia, "mail_enviado": mail_enviado}
    )