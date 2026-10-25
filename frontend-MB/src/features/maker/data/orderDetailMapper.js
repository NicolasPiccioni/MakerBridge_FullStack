import { ORDER_DEFAULTS as D } from './orderDefaults'
import { formatDate, timeAgo } from './orderMapper'
//------------------------------------------------------Datos que se usan para el detalle de un pedido en la ¿vista de cotizacion---------

// 'https://.../archivos/pedido-9510.stl?x=1' -> 'pedido-9510.stl'
function fileNameFromUrl(url) {
  try {
    return decodeURIComponent(String(url ?? '').split('?')[0].split('/').pop()) || 'archivo'
  } catch {
    return 'archivo'
  }
}

// Fila de la tabla `pedidos` -> props para <OrderSummaryCard />
export function toOrderDetail(row) {
  return {
    id: row.id_pedido,
    code: `#MK-${row.id_pedido}`,
    publishedLabel: `${timeAgo(row.fecha_creacion)} (${formatDate(row.fecha_creacion)})`,
    statusLabel: D.statusLabels[String(row.estado).toLowerCase()] ?? row.estado,
    title: row.titulo,
    // Si hacés JOIN con usuarios y devolvés `nombre_usuario`, se usa acá.
    client: { name: row.nombre_usuario ?? D.client.name, location: row.ubicacion },
    // null si el pedido no tiene archivo (o no se pudo generar el link de descarga)
    file: row.archivo_url ? { name: fileNameFromUrl(row.archivo_url), url: row.archivo_url } : null,
    specs: {
      quantity: `${row.cantidad} ${row.cantidad === 1 ? 'unidad' : 'unidades'}`,
      material: row.material,
      color: row.color,
      deadline: formatDate(row.fecha_limite),
    },
    description: row.descripcion,
  }
}