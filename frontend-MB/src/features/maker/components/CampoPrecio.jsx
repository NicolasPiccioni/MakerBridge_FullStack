import Icon from './Icon'

export const COMMISSION_RATE = 0.05

// 27075 -> '$ 27.075 ARS'
export const formatARS = (n) => `$ ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ARS`

export default function PriceField({ value, onChange }) {
  const price = parseInt(value, 10) || 0
  const commission = Math.round(price * COMMISSION_RATE)
  const net = price - commission

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="precio-cotizado" className="text-xs sm:text-sm font-bold text-gray-900">
        Presupuesto total a cotizar ($ ARS)
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-base font-bold text-gray-400 font-mono">$</span>
        <input
          id="precio-cotizado"
          name="precio"
          type="text"
          inputMode="numeric"
          placeholder="28500"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          className="w-full pl-8 pr-16 py-2.5 bg-white border border-[#ECDDC7] text-gray-900 text-base font-bold font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E06D53] focus:border-brand-primary shadow-sm transition-all"
        />
        <span className="absolute right-3.5 text-xs font-bold text-gray-400 font-mono uppercase">ARS</span>
      </div>

      {/* Desglose */}
      <div className="mt-2 p-3 rounded-lg bg-[#FAF6F0] border border-[#ECDDC7] flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Comisión de plataforma ({COMMISSION_RATE * 100}%):</span>
          <span className="font-mono text-gray-500">- {formatARS(commission)}</span>
        </div>
        <div className="pt-2 mt-1 border-t border-[#ECDDC7] flex items-center justify-between font-semibold">
          <span className="text-gray-900 flex items-center gap-1.5">
            <Icon name="account_balance_wallet" className="text-brand-primary text-[16px]" />
            Neto a recibir en tu cuenta:
          </span>
          <span className="font-mono text-sm font-bold text-brand-primary">{formatARS(net)}</span>
        </div>
      </div>
    </div>
  )
}
