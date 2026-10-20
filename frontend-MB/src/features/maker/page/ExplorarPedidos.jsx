import { useEffect, useState } from 'react'
import FiltersSidebar from '../components/FiltersSidebar'
import OrderCard from '../components/OrderCard'
import Pagination from '../components/Pagination'
import SearchSortBar from '../components/Buscador'
import { getPedidos } from '../../../api/pedidosApi'
import { toOrderCard } from '../data/orderMapper'
import useDebounce from '../../../hooks/useDebounce'

const DEFAULT_MATERIALS = ['pla', 'petg']
const DEFAULT_SERVICIOS = ['impresion']
const DEFAULT_LOCATION = 'all'
const DEFAULT_SORT = 'recent'
const PAGE_SIZE = 6   // pedidos que mostramos por página

export default function ExplorarPedidos() {
  // --- Lo que el usuario elige ---
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS)
  const [servicios, setServicios] = useState(DEFAULT_SERVICIOS)
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [page, setPage] = useState(1)

  // --- Lo que responde el back ---
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Esperamos a que el usuario deje de tipear antes de pedir al back
  const debouncedQuery = useDebounce(query, 350)

  // Cada vez que cambia algo de lo que el usuario eligió, pedimos de nuevo.
  useEffect(() => {
    let ignore = false // evita que una respuesta vieja pise a una más nueva
    setLoading(true)
    setError('')

    getPedidos({
      q: debouncedQuery,
      sort,
      materials,
      location,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((data) => {
        if (ignore) return
        setOrders(data.results.map(toOrderCard))
        setTotal(data.count)
      })
      .catch(() => {
        if (ignore) return
        setError('No pudimos cargar los pedidos. Revisá tu conexión y recargá la página.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [debouncedQuery, sort, materials, location, servicios, page])

  // --- Handlers: cualquier cambio de búsqueda/filtro/orden vuelve a la página 1 ---
  // (si no, podrías pedir la página 3 de una lista que ahora tiene solo 1)
  const handleChangeQuery = (value) => {
    setQuery(value)
    setPage(1)
  }
  const handleChangeSort = (value) => {
    setSort(value)
    setPage(1)
  }
  const handleChangeLocation = (value) => {
    setLocation(value)
    setPage(1)
  }
  const toggleMaterial = (id) => {
    setMaterials((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
    setPage(1)
  }
  const toggleServicios = (id) => {
    setServicios((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
    setPage(1)
  }
  const clearFilters = () => {
    setMaterials([])
    setServicios([])
    setLocation(DEFAULT_LOCATION)
    setQuery('')
    setPage(1)
  }

  // Paginación: el back nos dice cuántos pedidos hay en total (count)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Título */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[34px] md:text-[42px] font-extrabold text-[#1c1917] tracking-tight leading-tight">
              Explorar Pedidos <span className="text-brand-primary">Disponibles</span>
            </h1>
            <p className="text-[16px] text-[#78716c] max-w-2xl mt-1.5">
              Encontrá solicitudes de impresión y diseño 3D publicadas por clientes, revisá especificaciones técnicas y enviá tus cotizaciones antes de la fecha límite.
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y orden */}
        <SearchSortBar
          query={query}
          onChangeQuery={handleChangeQuery}
          sort={sort}
          onChangeSort={handleChangeSort}
        />
      </section>

      {/* Sidebar + feed */}
      <div className="flex flex-col lg:flex-row items-start gap-7">
        <FiltersSidebar
          materials={materials}
          location={location}
          servicios={servicios}
          onToggleMaterial={toggleMaterial}
          onToggleServicios={toggleServicios}
          onChangeLocation={handleChangeLocation}
          onClear={clearFilters}
        />

        <section className="flex-1 w-full flex flex-col gap-5">
          {error && (
            <p role="alert" className="text-[15px] text-red-700 py-10 text-center">
              {error}
            </p>
          )}

          {/* Primera carga: todavía no hay nada para mostrar */}
          {!error && loading && orders.length === 0 && (
            <p className="text-[15px] text-[#78716c] py-10 text-center">Cargando pedidos…</p>
          )}

          {/* Sin resultados */}
          {!error && !loading && orders.length === 0 && (
            <p className="text-[15px] text-[#78716c] py-10 text-center">
              {debouncedQuery.trim()
                ? `No encontramos pedidos para “${debouncedQuery.trim()}”. Probá con otra palabra o limpiá la búsqueda.`
                : 'No hay pedidos que coincidan con los filtros elegidos.'}
            </p>
          )}

          {/* Mientras recarga dejamos los resultados anteriores, atenuados */}
          <div
            className={`flex flex-col gap-5 transition-opacity ${loading ? 'opacity-60' : ''}`}
            aria-busy={loading}
          >
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {total > 0 && (
            <Pagination
              shown={orders.length}
              total={total}
              page={page}
              pages={pages}
              onChange={goToPage}
            />
          )}
        </section>
      </div>
    </>
  )
}
