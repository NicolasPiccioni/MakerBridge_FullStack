import Icon from './Icon'

export default function Pagination({ shown, total, page, pages, onChange, label = 'pedidos disponibles' }) {
  const numbers = Array.from({ length: pages }, (_, i) => i + 1)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#ebdccb] shadow-sm mt-2">
      <span className="text-[13px] text-[#78716c]">
        Mostrando <strong className="text-[#1c1917]">{shown}</strong> de <strong className="text-[#1c1917]">{total}</strong> {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="h-9 px-3 rounded-lg border border-[#ebdccb] text-[#78716c] hover:bg-[#fbf7f0] text-[13px] font-medium flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="chevron_left" className="text-[18px]" />
          <span>Anterior</span>
        </button>

        {numbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={
              n === page
                ? 'w-9 h-9 rounded-lg bg-brand-primary text-white font-bold text-[13px] flex items-center justify-center shadow-sm'
                : 'w-9 h-9 rounded-lg text-[#57534e] hover:bg-[#fbf7f0] border border-[#ebdccb] font-medium text-[13px] flex items-center justify-center transition-colors'
            }
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
          className="h-9 px-3 rounded-lg border border-[#ebdccb] text-[#57534e] hover:bg-[#fbf7f0] text-[13px] font-medium flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Siguiente</span>
          <Icon name="chevron_right" className="text-[18px]" />
        </button>
      </div>
    </div>
  )
}
