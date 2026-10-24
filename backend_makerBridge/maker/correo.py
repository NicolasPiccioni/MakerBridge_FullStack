import logging
import os

from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)

MATERIALES = {"pla": "PLA+ Pro", "petg": "PETG Técnico", "tpu": "TPU Flexible"}


def _pesos(n):
    return "$ " + f"{n:,}".replace(",", ".") + " ARS"


def enviar_aviso_cotizacion(destinatario, nombre_cliente, titulo_pedido, nombre_maker,
                            precio, dias, material_tipo, material_personalizado, mensaje):
    """Avisa al cliente que recibió una cotización. Devuelve True si se envió."""
    material = MATERIALES.get(material_tipo) or material_personalizado or "A convenir"
    # Un salto de línea en el asunto se podría usar para inyectar encabezados
    titulo_limpio = " ".join(str(titulo_pedido).split())
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")

    cuerpo = (
        f"Hola {nombre_cliente},\n\n"
        f"{nombre_maker} cotizó tu pedido \"{titulo_limpio}\".\n\n"
        f"Precio: {_pesos(precio)}\n"
        f"Plazo de entrega: {dias} días hábiles\n"
        f"Material propuesto: {material}\n\n"
        + (f"Mensaje del maker:\n{mensaje}\n\n" if mensaje else "")
        + f"Ingresá a MakerBridge para ver la propuesta y aceptarla:\n{frontend}/cliente\n\n"
        "El equipo de MakerBridge\n"
    )

    try:
        # Sin "connection": Django usa el mailer "default" definido en MAILERS (settings.py)
        EmailMessage(
            subject=f"Recibiste una cotización para tu pedido: {titulo_limpio}"[:200],
            body=cuerpo,
            from_email=os.getenv("EMAIL_FROM", "MakerBridge <no-reply@makerbridge.local>"),
            to=[destinatario],
        ).send()
        return True
    except Exception:
        # Si falla el mail, la cotización igual queda guardada
        logger.exception("No se pudo enviar el aviso de cotización")
        return False

TEXTO_ESTADO = {
    "en_proceso": "empezó a fabricar tu pedido",
    "listo_despacho": "terminó tu pedido y lo está preparando para despacharlo",
    "en_transito": "despachó tu pedido: ya va en camino",
}


def enviar_aviso_estado(destinatario, nombre_cliente, titulo_pedido, nombre_maker, estado_nuevo):
    """Avisa al cliente que su pedido cambió de estado. Devuelve True si se envió."""
    titulo_limpio = " ".join(str(titulo_pedido).split())
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")

    cuerpo = (
        f"Hola {nombre_cliente},\n\n"
        f"{nombre_maker} {TEXTO_ESTADO.get(estado_nuevo, 'actualizó el estado de tu pedido')}.\n\n"
        f"Pedido: \"{titulo_limpio}\"\n\n"
        f"Podés seguirlo desde MakerBridge:\n{frontend}/cliente\n\n"
        "El equipo de MakerBridge\n"
    )

    try:
        EmailMessage(
            subject=f"Novedades de tu pedido: {titulo_limpio}"[:200],
            body=cuerpo,
            from_email=os.getenv("EMAIL_FROM", "MakerBridge <no-reply@makerbridge.local>"),
            to=[destinatario],
        ).send()
        return True
    except Exception:
        logger.exception("No se pudo enviar el aviso de cambio de estado")
        return False