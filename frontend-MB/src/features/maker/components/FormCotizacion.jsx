import { useState } from 'react'
import Icon from './Icon'
import PriceField from './CampoPrecio'
import MaterialSelector from './SelectorMateriales'

const DELIVERY_OPTIONS = [
  { value: '2', label: '2 días hábiles (Express)' },
  { value: '3', label: '3 días hábiles' },
  { value: '4', label: '4 días hábiles (Recomendado)' },
  { value: '5', label: '5 días hábiles' },
  { value: '7', label: '7 días hábiles' },
]

const MAX_MESSAGE = 800

// Valores iniciales: los del diseño. Para un formulario vacío usá '' en price y message.
export const INITIAL_QUOTE = {
  price: '28500',
  days: '4',
  materialType: 'tpu',
  customMaterial: '',
  message:
    'Hola Martín, cuento con taller especializado en resinas técnicas de ingeniería. He fabricado engranajes helicoidales similares con resina Siraya Tech Blu curada a 65°C para garantizar tenacidad a la fricción y resistencia a lubricantes. Puedo asegurar la tolerancia de ±0.05 mm y enviaré reporte fotográfico con calibre digital antes del despacho.',
}

const fieldClass =
  'w-full bg-white border border-[#ECDDC7] text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E06D53] focus:border-[#E06D53] shadow-sm'

export default function QuoteForm({ initialValues = INITIAL_QUOTE, onSubmit }) {
  const [price, setPrice] = useState(initialValues.price)
  const [days, setDays] = useState(initialValues.days)
  const [materialType, setMaterialType] = useState(initialValues.materialType)
  const [customMaterial, setCustomMaterial] = useState(initialValues.customMaterial)
  const [message, setMessage] = useState(initialValues.message)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      precio: Number(price),
      tiempo_entrega_dias: Number(days),
      material_tipo: materialType,
      material_personalizado: customMaterial.trim(),
      mensaje: message.trim(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[#ECDDC7] p-6 shadow-sm flex flex-col gap-5"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F4EFE6]">
        <div>
          <span className="text-[11px] font-mono font-bold text-brand-primary uppercase tracking-wider block">Propuesta Maker</span>
          <h2 className="text-lg font-bold text-gray-900">Formulario de Cotización</h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold shrink-0">
          <Icon name="shield" className="text-[15px] text-sky-600" />
          <span>Cobro Asegurado</span>
        </div>
      </div>

      {/* 1. Presupuesto */}
      <PriceField value={price} onChange={setPrice} />

      {/* 2. Tiempo de entrega */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tiempo-estimado" className="text-xs sm:text-sm font-bold text-gray-900">
          Tiempo estimado de entrega / despacho
        </label>
        <div className="relative">
          <select
            id="tiempo-estimado"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className={`${fieldClass} py-2.5 pl-3 pr-10 text-xs sm:text-sm font-medium cursor-pointer appearance-none`}
          >
            {DELIVERY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Material */}
      <MaterialSelector
        value={materialType}
        onChange={setMaterialType}
        custom={customMaterial}
        onCustomChange={setCustomMaterial}
      />

      {/* 4. Propuesta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="mensaje-propuesta" className="text-xs sm:text-sm font-bold text-gray-900">
            Propuesta y observaciones técnicas para el cliente
          </label>
          <span className="text-[11px] text-gray-500 font-mono shrink-0">Máx. {MAX_MESSAGE} caracteres</span>
        </div>
        <textarea
          id="mensaje-propuesta"
          rows={4}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} p-3 text-xs sm:text-sm resize-none leading-relaxed transition-all`}
        />
      </div>

      {/* 5. CTA */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          type="submit"
          disabled={!Number(price)}
          className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-dark text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="send" className="text-[18px]" />
          <span>Enviar Cotización</span>
        </button>
        <p className="text-[11px] text-gray-500 text-center">
          Al enviar aceptas los términos de cumplimiento técnico y garantía de entrega de MakerBridge.
        </p>
      </div>
    </form>
  )
}
