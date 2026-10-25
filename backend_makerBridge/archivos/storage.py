import logging
import os
import re
import uuid
from urllib.parse import quote, unquote

import requests

logger = logging.getLogger(__name__)

TIMEOUT = 30
EXPIRA_SEGUNDOS = 3600  # los links de descarga duran 1 hora


class ErrorDeAlmacenamiento(Exception):
    """Falló la comunicación con Supabase Storage."""


def _config():
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    clave = os.getenv("SUPABASE_SECRET_KEY", "")
    bucket = os.getenv("SUPABASE_BUCKET", "")
    if not (url and clave and bucket):
        raise ErrorDeAlmacenamiento(
            "Falta configurar SUPABASE_URL, SUPABASE_SECRET_KEY y SUPABASE_BUCKET en el .env"
        )
    return url, clave, bucket


def _cabeceras(clave):
    cabeceras = {"apikey": clave}
    # Las claves nuevas (sb_secret_...) no son JWT y van solo en "apikey".
    # Las viejas (JWT) llevan además Authorization.
    if not clave.startswith("sb_"):
        cabeceras["Authorization"] = f"Bearer {clave}"
    return cabeceras


def partir_nombre(nombre):
    """'Mi pieza (1).STL' -> ('Mi_pieza_1', 'stl'). Deja solo caracteres seguros."""
    nombre = os.path.basename(nombre or "archivo")
    base, extension = os.path.splitext(nombre)
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("._") or "archivo"
    return base[:80], extension.lower().lstrip(".")


def ruta_nueva(id_usuario, base, extension):
    """Ruta única dentro del bucket: pedidos/<usuario>/<código al azar>/<nombre>.<ext>"""
    return f"pedidos/{id_usuario}/{uuid.uuid4().hex}/{base}.{extension}"


def es_ruta_de_storage(valor):
    """True si `archivo_url` es una ruta del bucket y no un link web."""
    return bool(valor) and not str(valor).lower().startswith(("http://", "https://"))


def nombre_de_archivo(valor):
    return unquote(str(valor).split("?")[0].rstrip("/").split("/")[-1]) or "archivo"


def subir(ruta, contenido, tipo_mime):
    url, clave, bucket = _config()
    try:
        res = requests.post(
            f"{url}/storage/v1/object/{bucket}/{quote(ruta, safe='/')}",
            headers={**_cabeceras(clave), "Content-Type": tipo_mime, "x-upsert": "false"},
            data=contenido,
            timeout=TIMEOUT,
        )
    except requests.RequestException as err:
        raise ErrorDeAlmacenamiento(f"No se pudo conectar con Supabase: {err}") from err

    if res.status_code >= 300:
        raise ErrorDeAlmacenamiento(f"Supabase respondió {res.status_code}: {res.text[:300]}")


def url_firmada(ruta, descargar_como=None):
    """Link temporal para descargar un archivo del bucket privado."""
    url, clave, bucket = _config()
    try:
        res = requests.post(
            f"{url}/storage/v1/object/sign/{bucket}/{quote(ruta, safe='/')}",
            headers={**_cabeceras(clave), "Content-Type": "application/json"},
            json={"expiresIn": EXPIRA_SEGUNDOS},
            timeout=TIMEOUT,
        )
    except requests.RequestException as err:
        raise ErrorDeAlmacenamiento(f"No se pudo conectar con Supabase: {err}") from err

    if res.status_code >= 300:
        raise ErrorDeAlmacenamiento(f"Supabase respondió {res.status_code}: {res.text[:300]}")

    firmada = res.json().get("signedURL")
    if not firmada:
        raise ErrorDeAlmacenamiento("Supabase no devolvió el link firmado")

    enlace = f"{url}/storage/v1{firmada}"
    if descargar_como:
        enlace += f"&download={quote(descargar_como)}"  # fuerza la descarga con el nombre original
    return enlace


def url_de_descarga(valor):
    """Un link web queda igual; una ruta del bucket se convierte en link firmado.
    Devuelve None si no hay archivo o si no se pudo firmar."""
    if not valor:
        return None
    if not es_ruta_de_storage(valor):
        return valor
    try:
        return url_firmada(valor, descargar_como=nombre_de_archivo(valor))
    except ErrorDeAlmacenamiento:
        logger.exception("No se pudo firmar el link de descarga")
        return None