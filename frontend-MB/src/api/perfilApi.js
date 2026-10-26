// Le habla al backend de Django con la sesión del usuario (sirve para cualquier rol).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

async function pedirAlBack(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      ...opciones.headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  // Sesión vencida: volver al login
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.assign('/login')
    throw new Error('Sesión vencida')
  }
  return res
}

// Devuelve el JSON, o lanza un Error con el mensaje del servidor (y el campo con problema)
async function leerRespuesta(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`)
    err.campo = data.campo
    throw err
  }
  return data
}

const enJson = (metodo, cuerpo) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(cuerpo),
})

export async function getPerfil() {
  return leerRespuesta(await pedirAlBack('/perfil/'))
}

// Manda solo los campos editables; el servidor ignora cualquier otro (email, rol...)
export async function guardarPerfil(cambios) {
  return leerRespuesta(await pedirAlBack('/perfil/', enJson('PATCH', cambios)))
}

export async function cambiarPassword(actual, nueva) {
  return leerRespuesta(await pedirAlBack('/perfil/password/', enJson('POST', { actual, nueva })))
}