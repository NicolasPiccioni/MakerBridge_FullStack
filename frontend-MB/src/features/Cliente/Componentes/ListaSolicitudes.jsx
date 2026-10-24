import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMisPedidos, confirmarRecepcion } from '../../../api/clienteApi'
import { estadoDe, formatARS, formatFecha } from '../data/estados'

const PAGE_SIZE = 6

// Los ids que entiende el backend. Cualquier otro id del filtro se ignora.
const MATERIALES_API = ['pla', 'petg', 'tpu']
const UBICACIONES_API = ['caba', 'cordoba']

export default function ListaSolicitudes({ materials = [], location = 'all' }) {
  const materiales = materials.filter((m) => MATERIALES_API.includes(m)).join(',')
  const ubicacion = UBICACIONES_API.includes(location) ? location : 'all'

  const [page, setPage] = useState(1)
  const [pedidos, setPedidos] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresco, setRefresco] = useState(0) // al cambiarlo, se vuelve a pedir la lista
  const [accion, setAccion] = useState({ id: null, aviso: '', error: '' })

  useEffect(() => {
    let ignore = false // evita que una respuesta vieja pise a una más nueva
    setLoading(true)
    setError('')

    getMisPedidos({
      materials: materiales ? materiales.split(',') : [],
      location: ubicacion,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((data) => {
        if (ignore) return
        setPedidos(data.results)
        setTotal(data.count)
      })
      .catch(() => {
        if (!ignore) setError('No pudimos cargar tus solicitudes. Revisá tu conexión y recargá la página.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [materiales, ubicacion, page, refresco])

  const handleConfirmar = async (pedido) => {
    if (accion.id) return
    if (!window.confirm(`¿Confirmás que recibiste "${pedido.titulo}"? Esto cierra el pedido.`)) return

    setAccion({ id: pedido.id_pedido, aviso: '', error: '' })
    try {
      await confirmarRecepcion(pedido.id_pedido)
      setAccion({ id: null, aviso: '¡Listo! Confirmaste la recepción del pedido.', error: '' })
    } catch (err) {
      setAccion({ id: null, aviso: '', error: err.message || 'No pudimos confirmar la recepción' })
    }
    setRefresco((n) => n + 1) // en cualquier caso, mostramos el estado real
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p role="alert" className="text-[15px] text-red-700 py-10 text-center">{error}</p>
      )}
      {accion.error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {accion.error}
        </p>
      )}
      {accion.aviso && (
        <p role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          {accion.aviso}
        </p>
      )}

      {!error && loading && pedidos.length === 0 && (
        <p className="text-[15px] text-brand-dark-muted py-10 text-center">Cargando tus solicitudes…</p>
      )}

      {!error && !loading && pedidos.length === 0 && (
        <div className="bg-white rounded-2xl border border-brand-border-subtle shadow-card p-8 text-center">
          <p className="text-brand-dark font-semibold">Todavía no tenés solicitudes con estos filtros.</p>
          <Link
            to="nueva-solicitud"
            className="inline-block mt-3 text-sm font-bold text-brand-terracota hover:underline"
          >
            Publicar una nueva solicitud
          </Link>
        </div>
      )}

      {/* Mientras recarga dejamos los resultados anteriores, atenuados */}
      <div className={`flex flex-col gap-5 transition-opacity ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
        {pedidos.map((p) => {
          const estado = estadoDe(p.estado)
          return (
            <article
              key={p.id_pedido}
              className="bg-white rounded-2xl border border-brand-border-subtle shadow-card p-5 sm:p-6 flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold tracking-wider text-brand-dark-muted">
                    #MK-{p.id_pedido} · Publicado el {formatFecha(p.fecha_creacion)}
                  </span>
                  <h3 className="text-lg font-extrabold text-brand-dark leading-snug">{p.titulo}</h3>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${estado.clase}`}>
                  {estado.label}
                </span>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-brand-crema border border-brand-border-subtle">
                {[
                  ['Cantidad', `${p.cantidad} ${p.cantidad === 1 ? 'unidad' : 'unidades'}`],
                  ['Material', p.material],
                  ['Ubicación', p.ubicacion],
                  ['Fecha límite', formatFecha(p.fecha_limite)],
                ].map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="min-w-0">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark-muted">{etiqueta}</dt>
                    <dd className="text-sm font-bold text-brand-dark truncate">{valor}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-brand-dark-muted">
                  {p.estado === 'abierto' ? (
                    <>
                      <strong className="text-brand-dark">{p.cotizaciones_pendientes}</strong>{' '}
                      {p.cotizaciones_pendientes === 1 ? 'cotización recibida' : 'cotizaciones recibidas'}
                    </>
                  ) : p.maker_asignado ? (
                    <>
                      Maker: <strong className="text-brand-dark">{p.maker_asignado}</strong>
                      {p.precio_aceptado != null && <> · {formatARS(p.precio_aceptado)}</>}
                    </>
                  ) : null}
                </p>

                <div className="flex items-center gap-2.5">
                  {p.estado === 'en_transito' && (
                    <button
                      type="button"
                      onClick={() => handleConfirmar(p)}
                      disabled={accion.id === p.id_pedido}
                      className="h-10 px-4 rounded-xl bg-brand-salvia text-brand-dark text-[13px] font-bold hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {accion.id === p.id_pedido ? 'Guardando…' : 'Confirmé que lo recibí'}
                    </button>
                  )}
                  <Link
                    to={`solicitudes/${p.id_pedido}`}
                    className="h-10 px-4 rounded-xl bg-brand-terracota text-white text-[13px] font-bold hover:bg-brand-terracota-hover transition flex items-center"
                  >
                    {p.estado === 'abierto' ? 'Ver cotizaciones' : 'Ver detalle'}
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-brand-border-subtle shadow-card">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((n) => n - 1)}
            className="h-9 px-3 rounded-lg border border-brand-border-subtle text-sm font-medium text-brand-dark hover:bg-brand-crema transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-brand-dark-muted">
            Página <strong className="text-brand-dark">{page}</strong> de {pages} · {total} solicitudes
          </span>
          <button
            type="button"
            disabled={page === pages}
            onClick={() => setPage((n) => n + 1)}
            className="h-9 px-3 rounded-lg border border-brand-border-subtle text-sm font-medium text-brand-dark hover:bg-brand-crema transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}