// Barra de búsqueda + selector de orden.
// Es un componente "controlado": no guarda estado propio, el padre
// (ExplorarPedidos) le pasa los valores y le dice qué hacer cuando cambian.

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Más recientes' },
  { id: 'oldest', label: 'Más antiguos' },
  { id: 'deadline', label: 'Más próximos a la fecha límite' },
]

export default function SearchSortBar({ query, onChangeQuery, sort, onChangeSort }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Búsqueda */}
      <div className="relative flex-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c] pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Buscar por título o descripción"
          aria-label="Buscar pedidos"
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#e7e5e4] bg-white text-[15px] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
        />
      </div>

      {/* Orden */}
      <select
        value={sort}
        onChange={(e) => onChangeSort(e.target.value)}
        aria-label="Ordenar pedidos"
        className="h-11 px-3.5 rounded-xl border border-[#e7e5e4] bg-white text-[15px] text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary sm:w-65"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
