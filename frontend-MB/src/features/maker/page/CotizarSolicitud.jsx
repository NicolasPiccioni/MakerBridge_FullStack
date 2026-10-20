import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import OrderSummaryCard from '../components/TarjetaSolicitud'
import PlatformGuarantee from '../components/CartelVerificacion'
import QuoteForm from '../components/FormCotizacion'
import ordersData from '../data/orders.json'
import { toOrderDetail } from '../data/orderDetailMapper'

export default function PostularPedido() {
  const { id } = useParams()

  // Cuando tengas API: reemplazá este find por un fetch del pedido `id`.
  const row = ordersData.find((o) => String(o.id_pedido) === id)

  if (!row) {
    return (
      <div className="bg-white rounded-xl border border-[#ECDDC7] p-8 text-center shadow-sm">
        <p className="text-gray-700 font-semibold">No encontramos el pedido #MK-{id}.</p>
        <Link to=".." className="inline-block mt-3 text-sm font-bold text-brand-primary hover:underline">
          Volver a Explorar Pedidos
        </Link>
      </div>
    )
  }

  const order = toOrderDetail(row)

  const handleSubmit = (quote) => {
    // TODO: enviar a tu API. Los nombres de campo son provisorios: adaptalos a tu tabla de cotizaciones.
    console.log('Cotización', { id_pedido: order.id, ...quote })
  }

  return (
    <>
      {/* Volver + estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to=".."
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-brand-primary bg-white border border-[#ECDDC7] px-3.5 py-1.5 rounded-lg shadow-sm transition-colors self-start"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          <span>Volver a Explorar Pedidos</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          {order.statusLabel}
        </span>
      </div>

      {/* 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <OrderSummaryCard order={order} />
          <PlatformGuarantee />
        </div>
        <div className="lg:col-span-6">
          <QuoteForm onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  )
}
