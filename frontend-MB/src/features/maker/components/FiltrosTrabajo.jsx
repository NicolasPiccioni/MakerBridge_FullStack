import { STATUS_FILTERS, MATERIAL_FILTERS } from '../data/jobFilters'

export default function JobFilters({ statuses, materials, onToggleStatus, onToggleMaterial, onResetStatus }) {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-6">
      {/* Estado del pedido */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] leading-6.5 font-semibold text-[#1c1917]">Estado del Pedido</h3>
          <button
            type="button"
            onClick={onResetStatus}
            className=" text-[10px] font-bold text-[#e06d53] hover:underline"
          >
            Restablecer
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {STATUS_FILTERS.map((f) => {
            const checked = statuses.includes(f.id)
            return (
              <label
                key={f.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  checked ? 'bg-[#fbf7f0] hover:bg-[#f4ebe1]' : 'hover:bg-[#fbf7f0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleStatus(f.id)}
                    className="w-4 h-4 accent-[#e06d53] rounded cursor-pointer"
                  />
                  <span
                    className={` text-[12px] font-semibold ${checked ? 'text-[#1c1917]' : 'text-[#78716c]'}`}
                  >
                    {f.label}
                  </span>
                </div>
                <span
                  className={` text-[10px] px-2 py-0.5 rounded-full ${
                    checked ? `font-bold ${f.activeBadge}` : 'bg-[#f4ebe1] text-[#78716c]'
                  }`}
                >
                  {f.count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Material del proyecto */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
        <h3 className="text-[18px] leading-6.5 font-semibold text-[#1c1917]">Material del Proyecto</h3>
        <div className="flex flex-col gap-2">
          {MATERIAL_FILTERS.map((m) => {
            const checked = materials.includes(m.id)
            return (
              <label
                key={m.id}
                className={`flex items-center justify-between text-[13px] cursor-pointer ${
                  checked ? 'text-[#1c1917]' : 'text-[#78716c]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleMaterial(m.id)}
                    className="w-4 h-4 accent-[#e06d53] rounded"
                  />
                  <span>{m.label}</span>
                </span>
                <span className="font-mono text-[10px] text-[#78716c]">({m.count})</span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
