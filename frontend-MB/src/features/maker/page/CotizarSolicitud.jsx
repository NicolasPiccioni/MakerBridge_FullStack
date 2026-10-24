import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import OrderSummaryCard from '../components/TarjetaSolicitud'
import PlatformGuarantee from '../components/CartelVerificacion'
import QuoteForm from '../components/FormCotizacion'
import { formatARS } from '../components/CampoPrecio'
import { getPedido, crearCotizacion } from '../../../api/pedidosApi'
import { toOrderDetail } from '../data/orderDetailMapper'

const VACIO = { price: '', days: '4', materialType: 'pla', customMaterial: '', message: '' }

function Aviso({ mensaje, linkVolver = true }) {
  return (
    <div className="bg-white rounded-xl border border-[#ECDDC7] p-8 text-center shadow-sm">
      <p className="text-gray-700 font-semibold">{mensaje}</p>
      {linkVolver && (
        <Link to=".." className="inline-block mt-3 text-sm font-bold text-brand-primary hover:underline">
          Volver a Explorar Pedidos
        </Link>
      )}
    </div>
  )
}

export default function PostularPedido() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [estado, setEstado] = useState('cargando') // cargando | ok | no_existe | error
  const [envio, setEnvio] = useState({ estado: 'inactivo' }) // inactivo | enviando | ok | error
  const enviando = useRef(false) // evita enviar dos veces si se hace doble clic

  useEffect(() => {
    let ignore = false
    setEstado('cargando')

    getPedido(id)
      .then((row) => {
        if (ignore) return
        if (!row) {
          setEstado('no_existe')
          return
        }
        setOrder(toOrderDetail(row))
        setEstado('ok')
      })
      .catch(() => {
        if (!ignore) setEstado('error')
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (estado === 'cargando') return <Aviso mensaje="Cargando pedido…" linkVolver={false} />
  if (estado === 'no_existe') return <Aviso mensaje={`No encontramos el pedido #MK-${id}.`} />
  if (estado === 'error') {
    return <Aviso mensaje="No pudimos cargar el pedido. Revisá tu conexión y volvé a intentar." />
  }

  const handleSubmit = async (quote) => {
    if (enviando.current) return
    enviando.current = true
    setEnvio({ estado: 'enviando' })

    try {
      const data = await crearCotizacion(order.id, quote)
      setEnvio({ estado: 'ok', data })
    } catch (err) {
      setEnvio({ estado: 'error', mensaje: err.message || 'No pudimos enviar la cotización' })
    } finally {
      enviando.current = false
    }
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

        <div className="lg:col-span-6 flex flex-col gap-4">
          {envio.estado === 'ok' ? (
            <div
              role="status"
              className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                <Icon name="check_circle" className="text-[24px]" />
                ¡Cotización enviada!
              </div>
              <p className="text-sm text-gray-700">
                Ofertaste <strong>{formatARS(envio.data.precio)}</strong>. Después de la comisión de la
                plataforma, recibirías <strong>{formatARS(envio.data.neto)}</strong>.
              </p>
              <p className="text-sm text-gray-600">
                {envio.data.mail_enviado
                  ? 'Le avisamos al cliente por mail.'
                  : 'La cotización quedó guardada, pero no pudimos enviarle el mail al cliente.'}
              </p>
              <Link
                to=".."
                className="inline-flex self-start mt-1 text-sm font-bold text-brand-primary hover:underline"
              >
                Volver a Explorar Pedidos
              </Link>
            </div>
          ) : (
            <>
              {envio.estado === 'error' && (
                <p
                  role="alert"
                  className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  {envio.mensaje}
                </p>
              )}
              {envio.estado === 'enviando' && (
                <p className="text-sm text-gray-500">Enviando cotización…</p>
              )}
              <QuoteForm initialValues={VACIO} onSubmit={handleSubmit} />
            </>
          )}
        </div>
      </div>
    </>
  )
}