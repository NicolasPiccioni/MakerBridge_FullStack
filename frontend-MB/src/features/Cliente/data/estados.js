// Cómo se muestra cada estado de un pedido
export const ESTADOS = {
  abierto: { label: 'Abierto a cotizaciones', clase: 'bg-sky-50 text-sky-700 border-sky-200' },
  asignado: { label: 'Asignado a un maker', clase: 'bg-amber-50 text-amber-800 border-amber-200' },
  en_proceso: { label: 'En fabricación', clase: 'bg-violet-50 text-violet-700 border-violet-200' },
  listo_despacho: { label: 'Listo para despacho', clase: 'bg-teal-50 text-teal-700 border-teal-200' },
  en_transito: { label: 'En camino', clase: 'bg-blue-50 text-blue-700 border-blue-200' },
  finalizado: { label: 'Finalizado', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelado: { label: 'Cancelado', clase: 'bg-stone-100 text-stone-600 border-stone-200' },
}

export const estadoDe = (valor) =>
  ESTADOS[valor] ?? { label: valor, clase: 'bg-stone-100 text-stone-600 border-stone-200' }

// Cómo se muestra el estado de una cotización
export const ESTADOS_COTIZACION = {
  pendiente: { label: 'Pendiente', clase: 'bg-amber-50 text-amber-800 border-amber-200' },
  aceptada: { label: 'Aceptada', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rechazada: { label: 'No elegida', clase: 'bg-stone-100 text-stone-500 border-stone-200' },
}

export const MATERIAL_COTIZACION = { pla: 'PLA+ Pro', petg: 'PETG Técnico', tpu: 'TPU Flexible' }

// 27075 -> '$ 27.075 ARS'
export const formatARS = (n) => `$ ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ARS`

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// '2026-11-02' o '2026-11-02T09:30:00-03:00' -> '2 Nov 2026'
export function formatFecha(valor) {
  if (!valor) return '—'
  const [y, m, d] = String(valor).slice(0, 10).split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${y}`
}