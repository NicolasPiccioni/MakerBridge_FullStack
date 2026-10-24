import logging
import os

from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)


def _pesos(n):
    return "$ " + f"{int(n):,}".replace(",", ".") + " ARS"


def _limpio(texto):
    # Un salto de línea en el asunto se podría usar para inyectar encabezados
    return " ".join(str(texto).split())


def _enviar(destinatario, asunto, cuerpo):
    """Si el mail falla, la acción ya quedó guardada: solo se avisa en la respuesta."""
    try:
        EmailMessage(
            subject=asunto[:200],
            body=cuerpo,
            from_email=os.getenv("EMAIL_FROM", "MakerBridge <no-reply@makerbridge.local>"),
            to=[destinatario],
        ).send()
        return True
    except Exception:
        logger.exception("No se pudo enviar el mail")
        return False


def enviar_aviso_aceptacion(destinatario, nombre_maker, nombre_cliente, titulo_pedido, precio):
    titulo = _limpio(titulo_pedido)
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
    cuerpo = (
        f"Hola {nombre_maker},\n\n"
        f"¡Buenas noticias! {nombre_cliente} aceptó tu cotización de {_pesos(precio)} "
        f"para el pedido \"{titulo}\".\n\n"
        f"El trabajo ya aparece en \"Mis trabajos\":\n{frontend}/maker/mis-trabajos\n\n"
        "El equipo de MakerBridge\n"
    )
    return _enviar(destinatario, f"Aceptaron tu cotización: {titulo}", cuerpo)


def enviar_aviso_recepcion(destinatario, nombre_maker, nombre_cliente, titulo_pedido):
    titulo = _limpio(titulo_pedido)
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
    cuerpo = (
        f"Hola {nombre_maker},\n\n"
        f"{nombre_cliente} confirmó que recibió el pedido \"{titulo}\". "
        "El trabajo quedó finalizado.\n\n"
        f"Podés verlo en:\n{frontend}/maker/mis-trabajos\n\n"
        "El equipo de MakerBridge\n"
    )
    return _enviar(destinatario, f"Pedido recibido: {titulo}", cuerpo)