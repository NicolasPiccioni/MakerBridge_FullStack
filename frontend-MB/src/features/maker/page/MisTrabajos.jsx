import { useEffect, useState } from 'react'
import JobFilters from '../components/FiltrosTrabajo'
import JobCard from '../components/TarjetaTrabajos'
import Pagination from '../components/Pagination'
import { getTrabajos, avanzarTrabajo } from '../../../api/pedidosApi'
import { toJobCard } from '../data/jobMapper'
import { JOB_STATUS } from '../data/jobStatus'
import { SIGUIENTE_ESTADO } from '../data/jobTransitions'
import { DEFAULT_STATUSES, DEFAULT_MATERIALS } from '../data/jobFilters'

const PAGE_SIZE = 4

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export default function MisTrabajos() {
  // --- Lo que el usuario elige ---
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES)
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS)
  const [page, setPage] = useState(1)

  // --- Lo que responde el back ---
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({ status: {}, materials: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // --- Avanzar el estado de un trabajo ---
  const [refresco, setRefresco] = useState(0) // al cambiarlo, se vuelve a pedir la lista
  const [accion, setAccion] = useState({ id: null, error: '' })

  useEffect(() => {
    let ignore = false // evita que una respuesta vieja pise a una más nueva
    setLoading(true)
    setError('')

    getTrabajos({ status: statuses, materials, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (ignore) return
        setJobs(data.results.map(toJobCard))
        setTotal(data.count)
        setCounts(data.facets)
      })
      .catch(() => {
        if (!ignore) setError('No pudimos cargar tus trabajos. Revisá tu conexión y recargá la página.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [statuses, materials, page, refresco])

  const handleAvanzar = async (job) => {
    const siguiente = SIGUIENTE_ESTADO[job.estado]
    if (!siguiente || accion.id) return

    const nombre = JOB_STATUS[siguiente]?.label ?? siguiente
    if (!window.confirm(`¿Pasar "${job.title}" a "${nombre}"? Se le avisará al cliente por mail.`)) return

    setAccion({ id: job.id, error: '' })
    try {
      await avanzarTrabajo(job.id, job.estado)
      setAccion({ id: null, error: '' })
    } catch (err) {
      setAccion({ id: null, error: err.message || 'No pudimos actualizar el trabajo' })
    }
    setRefresco((n) => n + 1) // en cualquier caso, mostramos el estado real
  }

  // Cualquier cambio de filtro vuelve a la página 1
  const toggleStatus = (id) => {
    setStatuses((prev) => toggleIn(prev, id))
    setPage(1)
  }
  const toggleMaterial = (id) => {
    setMaterials((prev) => toggleIn(prev, id))
    setPage(1)
  }
  const resetStatus = () => {
    setStatuses(DEFAULT_STATUSES)
    setPage(1)
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Título */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="text-[34px] md:text-[42px] font-extrabold text-[#1c1917] tracking-tight leading-tight">
            Mis Trabajos{' '}
            <span className="text-[#e06d53] decoration-[#e06d53]/20 decoration-wavy decoration-2">
              Asignados
            </span>
          </h1>
          <p className="text-[15px] leading-6 text-[#78716c] mt-2 max-w-2xl">
            Gestioná los pedidos que te fueron asiganados por clientes tras postularte. Descargá los modelos 3D, revisá parámetros y coordiná la logística.
          </p>
        </div>
      </section>

      {/* Filtros + lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <JobFilters
          statuses={statuses}
          materials={materials}
          counts={counts}
          onToggleStatus={toggleStatus}
          onToggleMaterial={toggleMaterial}
          onResetStatus={resetStatus}
        />

        <section className="lg:col-span-8 flex flex-col gap-6">
          {error && (
            <p role="alert" className="text-[15px] text-red-700 py-10 text-center">
              {error}
            </p>
          )}

          {accion.error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {accion.error}
            </p>
          )}

          {!error && loading && jobs.length === 0 && (
            <p className="text-[15px] text-[#78716c] py-10 text-center">Cargando trabajos…</p>
          )}

          {!error && !loading && jobs.length === 0 && (
            <p className="text-[15px] text-[#78716c] py-10 text-center">
              No tenés trabajos con los filtros elegidos.
            </p>
          )}

          {/* Mientras recarga dejamos los resultados anteriores, atenuados */}
          <div
            className={`flex flex-col gap-6 transition-opacity ${loading ? 'opacity-60' : ''}`}
            aria-busy={loading}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAction={SIGUIENTE_ESTADO[job.estado] ? () => handleAvanzar(job) : undefined}
                busy={accion.id === job.id}
              />
            ))}
          </div>

          {total > 0 && (
            <Pagination
              shown={jobs.length}
              total={total}
              page={page}
              pages={pages}
              onChange={goToPage}
              label="pedidos asignados activos"
            />
          )}
        </section>
      </div>
    </>
  )
}