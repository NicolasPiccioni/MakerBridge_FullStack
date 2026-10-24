// Le habla al backend de Django con la sesión del cliente.
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

const enJson = (cuerpo) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(cuerpo),
})

// { count, results }
export async function getMisPedidos({ status = [], materials = [], location = 'all', page = 1, pageSize = 6 } = {}) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize), location })
  if (status.length) params.set('status', status.join(','))
  if (materials.length) params.set('materials', materials.join(','))
  return leerRespuesta(await pedirAlBack(`/cliente/pedidos/?${params}`))
}

// Publica un pedido. Si el servidor lo rechaza, el Error trae `campo`.
export async function crearPedido(datos) {
  return leerRespuesta(await pedirAlBack('/cliente/pedidos/', enJson(datos)))
}

// { pedido, cotizaciones }, o null si el pedido no existe
export async function getCotizaciones(idPedido) {
  const res = await pedirAlBack(`/cliente/pedidos/${encodeURIComponent(idPedido)}/cotizaciones/`)
  if (res.status === 404) return null
  return leerRespuesta(res)
}

export async function aceptarCotizacion(idCotizacion) {
  return leerRespuesta(
    await pedirAlBack(`/cliente/cotizaciones/${encodeURIComponent(idCotizacion)}/aceptar/`, enJson({})),
  )
}

export async function confirmarRecepcion(idPedido) {
  return leerRespuesta(
    await pedirAlBack(`/cliente/pedidos/${encodeURIComponent(idPedido)}/confirmar-recepcion/`, enJson({})),
  )
}