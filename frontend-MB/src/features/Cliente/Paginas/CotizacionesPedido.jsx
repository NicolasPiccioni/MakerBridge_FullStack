import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../layout/Header'
import { getCotizaciones, aceptarCotizacion } from '../../../api/clienteApi'
import {
  ESTADOS_COTIZACION, MATERIAL_COTIZACION, estadoDe, formatARS, formatFecha,
} from '../data/estados'

const materialDe = (c) =>
  c.material_tipo === 'otro'
    ? c.material_personalizado || 'A convenir'
    : MATERIAL_COTIZACION[c.material_tipo] ?? 'A convenir'

function Aviso({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border-subtle shadow-card p-8 text-center">
      <p className="text-brand-dark font-semibold">{children}</p>
      <Link to=".." className="inline-block mt-3 text-sm font-bold text-brand-terracota hover:underline">
        Volver a Mis solicitudes
      </Link>
    </div>
  )
}

export default function CotizacionesPedido() {
  const { id } = useParams()
  const [datos, setDatos] = useState(null) // { pedido, cotizaciones }
  const [estado, setEstado] = useState('cargando') // cargando | ok | no_existe | error
  const [refresco, setRefresco] = useState(0)
  const [accion, setAccion] = useState({ id: null, aviso: '', error: '' })

  useEffect(() => {
    let ignore = false

    getCotizaciones(id)
      .then((data) => {
        if (ignore) return
        if (!data) {
          setEstado('no_existe')
          return
        }
        setDatos(data)
        setEstado('ok')
      })
      .catch(() => {
        if (!ignore) setEstado('error')
      })

    return () => {
      ignore = true
    }
  }, [id, refresco])

  if (estado === 'cargando') return <p className="py-10 text-center text-brand-dark-muted">Cargando cotizaciones…</p>
  if (estado === 'no_existe') return <Aviso>No encontramos esa solicitud.</Aviso>
  if (estado === 'error') return <Aviso>No pudimos cargar las cotizaciones. Revisá tu conexión y volvé a intentar.</Aviso>

  const { pedido, cotizaciones } = datos
  const abierto = pedido.estado === 'abierto'
  const estadoPedido = estadoDe(pedido.estado)

  const handleAceptar = async (cot) => {
    if (accion.id) return
    const aviso = `¿Aceptar la cotización de ${cot.nombre_maker} por ${formatARS(cot.precio)}? ` +
      'Las demás cotizaciones se descartan y no se puede deshacer.'
    if (!window.confirm(aviso)) return

    setAccion({ id: cot.id_cotizacion, aviso: '', error: '' })
    try {
      const res = await aceptarCotizacion(cot.id_cotizacion)
      setAccion({
        id: null,
        aviso: res.mail_enviado
          ? 'Aceptaste la cotización. Le avisamos al maker por mail.'
          : 'Aceptaste la cotización. No pudimos avisarle por mail al maker.',
        error: '',
      })
    } catch (err) {
      setAccion({ id: null, aviso: '', error: err.message || 'No pudimos aceptar la cotización' })
    }
    setRefresco((n) => n + 1) // en cualquier caso, mostramos el estado real
  }

  return (
    <>
      <Header
        title="Cotizaciones"
        accent="recibidas"
        description={`Pedido #MK-${pedido.id_pedido}: ${pedido.titulo}`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to=".."
          className="inline-flex items-center text-xs font-semibold text-brand-dark hover:text-brand-terracota bg-white border border-brand-border-subtle px-3.5 py-1.5 rounded-lg shadow-card transition-colors"
        >
          ← Volver a Mis solicitudes
        </Link>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${estadoPedido.clase}`}>
          {estadoPedido.label}
        </span>
      </div>

      {accion.error && (
        <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {accion.error}
        </p>
      )}
      {accion.aviso && (
        <p role="status" className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          {accion.aviso}
        </p>
      )}

      {cotizaciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-border-subtle shadow-card p-8 text-center">
          <p className="text-brand-dark font-semibold">Todavía no recibiste cotizaciones.</p>
          <p className="text-sm text-brand-dark-muted mt-1">
            Cuando un maker cotice tu pedido, te avisamos por mail y la vas a ver acá.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {cotizaciones.map((c) => {
            const estadoCot = ESTADOS_COTIZACION[c.estado] ?? ESTADOS_COTIZACION.pendiente
            return (
              <article
                key={c.id_cotizacion}
                className={`bg-white rounded-2xl border shadow-card p-5 sm:p-6 flex flex-col gap-4 ${
                  c.estado === 'aceptada' ? 'border-emerald-300' : 'border-brand-border-subtle'
                } ${c.estado === 'rechazada' ? 'opacity-70' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold text-brand-dark">{c.nombre_maker}</p>
                    <p className="text-xs text-brand-dark-muted">Cotizó el {formatFecha(c.fecha_creacion)}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${estadoCot.clase}`}>
                    {estadoCot.label}
                  </span>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-brand-crema border border-brand-border-subtle">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark-muted">Precio total</dt>
                    <dd className="text-lg font-extrabold text-brand-dark">{formatARS(c.precio)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark-muted">Plazo</dt>
                    <dd className="text-sm font-bold text-brand-dark">{c.tiempo_entrega_dias} días hábiles</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark-muted">Material</dt>
                    <dd className="text-sm font-bold text-brand-dark">{materialDe(c)}</dd>
                  </div>
                </dl>

                {c.mensaje && (
                  <p className="text-sm text-brand-dark-muted italic bg-brand-crema rounded-lg p-3">
                    “{c.mensaje}”
                  </p>
                )}

                {abierto && c.estado === 'pendiente' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAceptar(c)}
                      disabled={accion.id !== null}
                      className="h-10 px-5 rounded-xl bg-brand-terracota text-white text-[13px] font-bold hover:bg-brand-terracota-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {accion.id === c.id_cotizacion ? 'Aceptando…' : 'Aceptar esta cotización'}
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}