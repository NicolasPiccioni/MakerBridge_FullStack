import Icon from './Icon'

const OPTIONS = [
  { value: 'pla', label: 'PLA+ Pro' },
  { value: 'petg', label: 'PETG Técnico' },
  { value: 'tpu', label: 'TPU Flexible' },
  { value: 'otro', label: 'Otro', isOther: true },
]

const SELECTED = 'border-2 border-[#E06D53] bg-[#FEF4F0]'
const BASE = 'border border-[#ECDDC7] bg-white hover:border-gray-400'
const OTHER = 'border border-dashed border-[#E06D53] bg-white hover:bg-[#FEF4F0]'

export default function MaterialSelector({ value, onChange, custom, onCustomChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <Icon name="category" className="text-[18px] text-brand-primary" />
          Tipo de Material
        </span>
        <span className="text-[10px] uppercase font-bold text-gray-500 bg-[#FAF6F0] border border-[#ECDDC7] px-2 py-0.5 rounded">
          Selección única
        </span>
      </div>
      <p className="text-xs text-gray-500">
        Selecciona la resina o termoplástico con el que fabricarás el lote o propón uno personalizado:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {OPTIONS.map((o) => {
          const selected = value === o.value
          const style = selected ? SELECTED : o.isOther ? OTHER : BASE
          return (
            <label
              key={o.value}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all shadow-sm ${style}`}
            >
              <span
                className={`text-xs flex items-center gap-1 ${selected ? 'font-bold text-brand-primary' : 'font-semibold text-gray-700'
                  }`}
              >
                {o.isOther && <Icon name="add" className="text-[15px] text-brand-primary" />}
                {o.label}
              </span>
              <input
                type="radio"
                name="material_tipo"
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="accent-brand-primary"
              />
            </label>
          )
        })}
      </div>

      {/* Material personalizado */}

      {value === 'otro' && (<div className="mt-1 p-3 bg-[#FAF6F0] border border-[#ECDDC7] rounded-lg flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Icon name="tune" className="text-[15px] text-brand-primary" /> Proponer material personalizado
          </span>
          <span className="text-[10px] font-mono font-medium text-brand-primary bg-[#FEF4F0] border border-[#FCD5CC] px-1.5 py-0.5 rounded">
            Opcional
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            id="material-personalizado"
            name="material_personalizado"
            type="text"
            value={custom}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Escribe el material (ej. Nylon Carbono, Resina Alta Temperatura, PEEK...)"
            className="w-full pl-3 pr-28 py-2 bg-white border border-[#ECDDC7] text-gray-900 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-sm transition-all"
          />
        </div>
      </div>)}

    </div>
  )
}
