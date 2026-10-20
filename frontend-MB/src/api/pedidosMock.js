// MOCK = versión de prueba que imita al back usando orders.json.
// Se borra cuando exista la API real.
//
// Responde con el mismo formato que va a devolver Django:
//   { count: 42, results: [ { id_pedido, titulo, ... } ] }
//
// ⚠️ orders.json tiene que usar los mismos nombres de campo que el contrato
// (todo en minúscula: titulo, ubicacion, fecha_limite, fecha_creacion...).

import ordersData from '../features/maker/data/orders.json'

// Saca tildes y mayúsculas para que "pieza" encuentre "Pieza"
const normalize = (text) =>
  String(text ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const SORTERS = {
  recent: (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion),
  oldest: (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion),
  // 'YYYY-MM-DD' se ordena bien como texto
  deadline: (a, b) => String(a.fecha_limite).localeCompare(String(b.fecha_limite)),
}

const FAKE_DELAY_MS = 300 // simula la demora de la red para ver el estado "cargando"

export async function getPedidos({ q = '', sort = 'recent', page = 1, pageSize = 4 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

  const needle = normalize(q.trim())
  const rows = needle
    ? ordersData.filter((r) => normalize(`${r.titulo} ${r.descripcion}`).includes(needle))
    : [...ordersData]

  // TODO (lo hará el back): filtrar por `materials` y `location`.
  // Acá se ignoran a propósito, porque `material` viene como texto libre
  // ("Nylon PA12 / Resina") y no coincide con los ids del sidebar ('pla', 'petg').

  rows.sort(SORTERS[sort] ?? SORTERS.recent)

  const start = (page - 1) * pageSize
  return { count: rows.length, results: rows.slice(start, start + pageSize) }
}
