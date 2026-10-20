import { ORDER_DEFAULTS as D } from './orderDefaults'
import { formatDate, timeAgo } from './orderMapper'
//------------------------------------------------------Datos que se usan para el detalle de un pedido en la ¿vista de cotizacion---------
// No está en la base de datos -> constante por el momento o sacarlo!!!
const FILE_SIZE = '32.4 MB'

// 'https://.../archivos/pedido-9510.stl?x=1' -> 'pedido-9510.stl'
function fileNameFromUrl(url = '') {
  try {
    return decodeURIComponent(url.split('?')[0].split('/').pop()) || 'archivo.stl'
  } catch {
    return 'archivo.stl'
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
    file: { name: fileNameFromUrl(row.archivo_url), size: FILE_SIZE, url: row.archivo_url },
    specs: {
      quantity: `${row.cantidad} ${row.cantidad === 1 ? 'unidad' : 'unidades'}`,
      material: row.material,
      color: row.color,
      deadline: formatDate(row.fecha_limite),
    },
    description: row.descripcion,
  }
}
