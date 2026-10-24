// Pedidos reales: le habla al backend de Django.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

// Hace el pedido con el token y maneja la sesión vencida en un solo lugar
async function pedirAlBack(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      ...opciones.headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.assign('/login')
    throw new Error('Sesión vencida')
  }
  return res
}

export async function getPedidos({
  q = '',
  sort = 'recent',
  materials = [],
  location = 'all',
  page = 1,
  pageSize = 6,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort,
    location,
  })
  if (q.trim()) params.set('q', q.trim())
  if (materials.length) params.set('materials', materials.join(','))

  const res = await pedirAlBack(`/pedidos/?${params}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json() // { count, results }
}

// Devuelve el pedido, o null si no existe
export async function getPedido(id) {
  const res = await pedirAlBack(`/pedidos/${encodeURIComponent(id)}/`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

// Envía la cotización. Si el servidor la rechaza, lanza un Error con su mensaje.
export async function crearCotizacion(idPedido, datos) {
  const res = await pedirAlBack(`/pedidos/${encodeURIComponent(idPedido)}/cotizaciones/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

// Trabajos del maker (cotizaciones que el cliente aceptó)
export async function getTrabajos({ status = [], materials = [], page = 1, pageSize = 4 } = {}) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (status.length) params.set('status', status.join(','))
  if (materials.length) params.set('materials', materials.join(','))

  const res = await pedirAlBack(`/maker/trabajos/?${params}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json() // { count, results, facets }
}

// Avanza un trabajo al siguiente estado. `desde` es el estado que la pantalla está mostrando:
// si ya cambió (doble clic, otra pestaña), el servidor responde 409 y no avanza dos veces.
export async function avanzarTrabajo(idPedido, desde) {
  const res = await pedirAlBack(`/maker/trabajos/${encodeURIComponent(idPedido)}/avanzar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ desde }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}