import Icon from './Icon'

export const MATERIALS = [
  { id: 'pla', label: 'PLA' },
  { id: 'petg', label: 'PETG' },
  { id: 'tpu', label: 'TPU Flexible' },

]
export const SERVICIOS = [
  { id: 'impresion', label: 'Impresión 3D' },
  { id: 'impydis', label: 'Impresión y Diseño' },
  { id: 'disenio', label: 'Diseño 3D' },
]

export const LOCATIONS = [
  { id: 'all', label: 'Todo el país (Envío)' },
  { id: 'caba', label: 'CABA & GBA' },
  { id: 'cordoba', label: 'Córdoba / Centro' },
  { id: 'pickup', label: 'Retiro directo' },
]

const Title = ({ children }) => (
  <span className="text-[11px] font-mono font-bold text-[#a8a29e] uppercase tracking-wider">{children}</span>
)

export default function FiltersSidebar({ materials, servicios, location, onToggleMaterial, onToggleServicios, onChangeLocation, onClear }) {
  return (
    <aside className="w-full lg:w-70 shrink-0 flex flex-col gap-5 lg:sticky lg:top-28">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ede3d5] flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#f5ecdf]">
          <div className="flex items-center gap-2">
            <Icon name="filter_list" className="text-brand-primary text-[20px]" />
            <h2 className="font-bold text-[16px] text-[#1c1917]">Filtrar Pedidos</h2>
          </div>
          <button type="button" onClick={onClear} className="text-[12px] font-semibold text-brand-primary hover:underline">
            Limpiar
          </button>
        </div>

        {/* Materiales */}
        <div className="flex flex-col gap-2.5">
          <Title>Materiales</Title>
          <div className="flex flex-col gap-2 font-medium text-[13px] text-[#44403c]">
            {MATERIALS.map((m) => (
              <label key={m.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={materials.includes(m.id)}
                  onChange={() => onToggleMaterial(m.id)}
                  className="w-4 h-4 accent-brand-primary rounded border-gray-300"
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        
        {/* Servicio */}
        <div className="flex flex-col gap-2.5">
          <Title>Servicio</Title>
          <div className="flex flex-col gap-2 font-medium text-[13px] text-[#44403c]">
            {SERVICIOS.map((s) => (
              <label key={s.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={servicios.includes(s.id)}
                  onChange={() => onToggleServicios(s.id)}
                  className="w-4 h-4 accent-brand-primary rounded border-gray-300"
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-2.5">
          <Title>UBICACIÓN Y DESPACHO</Title>
          <div className="flex flex-col gap-2 font-medium text-[13px] text-[#44403c]">
            {LOCATIONS.map((l) => (
              <label key={l.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loc"
                  checked={location === l.id}
                  onChange={() => onChangeLocation(l.id)}
                  className="w-4 h-4 accent-brand-primary border-gray-300"
                />
                <span>{l.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
