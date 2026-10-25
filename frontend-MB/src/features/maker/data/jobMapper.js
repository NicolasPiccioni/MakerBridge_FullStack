import { ORDER_DEFAULTS as D } from './orderDefaults'
import { formatDate, timeAgo } from './orderMapper'
import { JOB_STATUS, JOB_STATUS_FALLBACK } from './jobStatus'

const URGENT_DAYS = 7 // hasta cuántos días antes se pinta en rojo la fecha límite

const formatPrice = (n) => `$ ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ARS`

// Días que faltan para una fecha 'YYYY-MM-DD' (negativo si ya pasó)
function daysUntil(value) {
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(y, m - 1, d) - today) / 86400000)
}

function buildDeadline(value, trackDeadline) {
  const date = formatDate(value)
  if (!trackDeadline) return { text: date, urgent: false }
  const days = daysUntil(value)
  const suffix = days < 0 ? 'vencido' : days === 0 ? 'hoy' : `${days} ${days === 1 ? 'día' : 'días'}`
  return { text: `${date} (${suffix})`, urgent: days <= URGENT_DAYS }
}

// Fila (pedido + cotización adjudicada) -> props de <JobCard />
export function toJobCard(row) {
  const key = String(row.estado).toLowerCase()
  const status = JOB_STATUS[key] ?? { ...JOB_STATUS_FALLBACK, label: row.estado }

  return {
    id: row.id_pedido,
    estado: key, // 'asignado', 'en_proceso', etc.
    orderCode: `PEDIDO #MK-${row.id_pedido}`,
    quotationCode: `COTIZACIÓN #COT-${row.id_cotizacion}`,
    awardedAgo: timeAgo(row.fecha_adjudicacion).replace('Publicado', 'Adjudicado'),
    status,
    title: row.titulo,
    client: row.nombre_usuario ?? D.client.name,
    location: row.ubicacion,
    image: { src: D.image.src, alt: D.image.alt },
    specs: {
      quantity: `${row.cantidad} ${row.cantidad === 1 ? 'unidad' : 'unidades'}`,
      material: row.material,
      color: row.color,
    },
    deadline: buildDeadline(row.fecha_limite, status.trackDeadline),
    amount: formatPrice(row.precio),
    commitment: `${row.tiempo_entrega_dias} días hábiles`,
    message: row.mensaje,
    file: row.archivo_url ? { url: row.archivo_url } : null,
  }
}
