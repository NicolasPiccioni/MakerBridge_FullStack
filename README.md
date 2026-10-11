# MakerBridge

Plataforma que conecta clientes con makers de impresión 3D.

- **Backend:** Django (Python) + PostgreSQL (Supabase)
- **Frontend:** React + Vite
- **Roles:** `cliente`, `maker` y `admin`. Cada uno tiene su propio dashboard.

```
MK-Back/
├── backend_makerBridge/    # API en Django
└── frontend_makerBridge/   # Interfaz en React
```

## Requisitos

- [Python](https://www.python.org/downloads/) 3.12 o superior
- [Node.js](https://nodejs.org/) 20 o superior
- [Git](https://git-scm.com/)
- Acceso a la base de datos (credenciales de Supabase, ver más abajo)

## 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPO>
cd <NOMBRE-DE-LA-CARPETA>
```

## 2. Backend (Django)

Abrí una terminal y entrá a la carpeta del backend:

```bash
cd backend_makerBridge
```

### 2.1 Crear y activar el entorno virtual

```powershell
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\activate
```

```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

Cuando esté activo, vas a ver `(venv)` al principio de la línea de la terminal.
Si PowerShell bloquea la activación, ejecutá una vez:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### 2.2 Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2.3 Configurar variables de entorno

Copiá el archivo de ejemplo y completalo:

```powershell
# Windows
copy .env.example .env
```

```bash
# Linux / macOS
cp .env.example .env
```

Variables del `.env`:

| Variable      | Descripción                                                            |
|---------------|------------------------------------------------------------------------|
| `DB_NAME`     | Nombre de la base (en Supabase suele ser `postgres`)                   |
| `DB_USER`     | Usuario del pooler (formato `postgres.<codigo-del-proyecto>`)          |
| `DB_PASSWORD` | Contraseña de la base de datos. Ponela **entre comillas dobles**       |
| `DB_HOST`     | Host del Session pooler (ej: `aws-0-us-east-1.pooler.supabase.com`)    |
| `DB_PORT`     | Puerto, `5432`                                                         |
| `SECRET_KEY`  | Clave secreta de Django. Se usa también para firmar los tokens de login |

Para generar una `SECRET_KEY` propia:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

> **Importante:** el archivo `.env` contiene secretos y **nunca** se sube al repositorio.
> Las credenciales de la base de datos se las pide cada integrante al responsable del proyecto,
> por un canal privado.

Dónde encontrar los datos de conexión en Supabase: abrí el proyecto, tocá el botón
**Connect** (arriba) y elegí **Session pooler**. Ahí se ven el host, el usuario y el puerto.

### 2.4 Base de datos

**Si usás la base compartida del equipo:** las tablas ya existen, no hay que crear nada.
Solo ejecutá:

```bash
python manage.py migrate
```

> **No ejecutes el script SQL de `diseño.txt` sobre la base compartida.** Empieza con varios
> `DROP TABLE` y borra todos los datos.

**Si usás tu propio proyecto de Supabase (base vacía):** ejecutá el script SQL de `diseño.txt`
(sección "BASE DE DATOS | ESTRUCTURA SQL") en el *SQL Editor* de Supabase, y después corré
`python manage.py migrate`. Los modelos de la app `plataforma` son `managed = False`, por eso
Django no crea esas tablas por su cuenta.

### 2.4.1 Crear un usuario admin

Por la API solo se pueden registrar usuarios `cliente` y `maker`. Para tener un admin:
registrá un usuario normal y, en el *Table Editor* de Supabase (tabla `usuarios`),
cambiale la columna `rol` a `admin`.

### 2.5 Levantar el servidor

```bash
python manage.py runserver
```

La API queda en `http://127.0.0.1:8000/api/`. Dejá esa terminal abierta.

## 3. Frontend (React)

En **otra terminal**:

```bash
cd frontend_makerBridge
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

> El frontend debe correr en el puerto **5173** y el backend en `127.0.0.1:8000`.
> Con otros puertos falla por CORS (ver `CORS_ALLOWED_ORIGINS` en `backend_makerBridge/config/settings.py`).

## 4. Probar que todo funciona

1. Con los dos servidores corriendo, entrá a `http://localhost:5173/Login`.
2. Iniciá sesión con un usuario existente. Te lleva al dashboard de su rol:
   - `cliente` → `/cliente`
   - `maker` → `/maker`
   - `admin` → `/admin`
3. Si intentás entrar a un dashboard que no es de tu rol, te devuelve al tuyo.

## API

Base: `http://127.0.0.1:8000/api`

| Método | Ruta                   | Acceso                | Descripción                              |
|--------|------------------------|-----------------------|------------------------------------------|
| POST   | `/auth/register/`      | Público               | Registra un usuario (`cliente` o `maker`) |
| POST   | `/auth/login/`         | Público               | Inicia sesión y devuelve un token        |
| GET    | `/auth/me/`            | Cualquier usuario     | Devuelve el usuario del token            |
| GET    | `/cliente/panel/`      | Solo `cliente`        | Panel de cliente                         |
| GET    | `/maker/panel/`        | Solo `maker`          | Panel de maker                           |
| GET    | `/admin/panel/`        | Solo `admin`          | Panel de admin                           |

Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en `/auth/login/` y dura 8 horas. El rol se verifica siempre en el servidor.

Ejemplo de registro:

```json
{
  "nombre": "Nombre Apellido",
  "email": "persona@example.com",
  "password": "una-contraseña-segura",
  "rol": "cliente"
}
```

El diseño completo de endpoints planificados está en `diseño.txt`.

## Problemas comunes

| Problema | Causa probable |
|----------|----------------|
| `ModuleNotFoundError` | No está activo el entorno virtual, o falta `pip install -r requirements.txt` |
| `venv\Scripts\activate` no se reconoce | En PowerShell hay que escribir `.\venv\Scripts\activate` |
| `password authentication failed` | La contraseña del `.env` es incorrecta |
| `could not translate host name` | `DB_HOST` mal escrito |
| `relation "usuarios" does not exist` | Faltan crear las tablas (ver 2.4) |
| `relation "django_session" already exists` al migrar | Ejecutá `python manage.py migrate sessions 0001 --fake` y luego `python manage.py migrate` |
| Error de CORS en el navegador | El frontend no corre en `localhost:5173` |
| El login dice "No se pudo conectar con el servidor" | El backend no está corriendo |
| Cambié el `.env` y no pasa nada | Hay que reiniciar `runserver`; el `.env` solo se lee al arrancar |

## Seguridad

- Las contraseñas se guardan encriptadas (hash), nunca en texto plano.
- El `.env`, las claves de Supabase y el `SECRET_KEY` no deben compartirse en chats ni subirse al repositorio.
- Este proyecto está en desarrollo (`DEBUG = True`). Antes de publicarlo hay que revisar `ALLOWED_HOSTS`, desactivar `DEBUG` y usar un servidor de producción (Gunicorn o similar).
