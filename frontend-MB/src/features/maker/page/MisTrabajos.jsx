import { useState } from 'react'
import JobFilters from '../components/FiltrosTrabajo'
import JobCard from '../components/TarjetaTrabajos'
import Pagination from '../components/Pagination'
import jobsData from '../data/jobs.json'
import { toJobCard } from '../data/jobMapper'
import { DEFAULT_STATUSES, DEFAULT_MATERIALS } from '../data/jobFilters'

const PAGE_SIZE = 4

// Cuando tengas API: reemplazá `jobsData` por el resultado del fetch.
const jobs = jobsData.map(toJobCard)

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export default function MisTrabajos() {
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES)
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS)
  const [page, setPage] = useState(1)

  // Paginación
  const total = jobs.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visibleJobs = jobs.slice(start, start + PAGE_SIZE)

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
          onToggleStatus={(id) => setStatuses((prev) => toggleIn(prev, id))}
          onToggleMaterial={(id) => setMaterials((prev) => toggleIn(prev, id))}
          onResetStatus={() => setStatuses(DEFAULT_STATUSES)}
        />

        <section className="lg:col-span-8 flex flex-col gap-6">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          <Pagination
            shown={visibleJobs.length}
            total={total}
            page={page}
            pages={pages}
            onChange={goToPage}
            label="pedidos asignados activos"
          />
        </section>
      </div>
    </>
  )
}
