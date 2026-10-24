import Icon from './Icon'

const labelSm = 'text-[10px] font-bold tracking-wider uppercase text-[#78716c] block'
const valueLg = 'text-[14px] font-bold'

export default function JobCard({ job, onAction, busy = false }) {
  const {
    orderCode, quotationCode, awardedAgo, status, title, client, location,
    image, specs, deadline, amount, commitment, message, file,
  } = job

  return (
    <article className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden">
      {/* Barra superior según estado */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${status.accent}`} />

      {/* Metadatos + estado */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-wider bg-[#f4ebe1] px-2.5 py-1 rounded-md text-[#1c1917]">
            {orderCode}
          </span>
          <span className={`font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md ${status.quotationBadge}`}>
            {quotationCode}
          </span>
          <span className="text-[13px] text-[#78716c]">• {awardedAgo}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${status.badge.className}`}>
          {status.badge.pulse && <span className="w-2 h-2 rounded-full bg-[#006878] animate-ping" />}
          {status.badge.icon && <Icon name={status.badge.icon} className="text-[16px]" />}
          <span>{status.label}</span>
        </div>
      </div>

      {/* Título + cliente */}
      <div className="pb-4">
        <h3 className="text-[20px] leading-7 font-bold text-[#1c1917] hover:text-[#e06d53] transition-colors">{title}</h3>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[13px] text-[#78716c]">
          <span className="flex items-center gap-1.5 text-[#1c1917] font-semibold">
            <Icon name="person" className="text-[18px] text-[#e06d53]" />
            {client}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Icon name="location_on" className="text-[16px] text-[#78716c]" />
            {location}
          </span>
        </div>
      </div>

      {/* Preview + especificaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 bg-[#fbf7f0] rounded-xl">
        <div className="sm:col-span-4 relative rounded-lg overflow-hidden bg-[#f4ebe1] aspect-square sm:aspect-auto sm:h-36 shadow-inner">
          <img className="w-full h-full object-cover" src={image.src} alt={image.alt} />
          <span className="absolute bottom-2 left-2 bg-[#263143]/85 text-[#ecf1ff] px-2 py-0.5 rounded font-mono text-[10px] font-bold flex items-center gap-1">
            <Icon name={status.previewChip.icon} className="text-[14px]" /> {status.previewChip.text}
          </span>
        </div>

        <div className="sm:col-span-8 grid grid-cols-2 gap-3">
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <span className={labelSm}>Cantidad</span>
            <span className={`${valueLg} text-[#1c1917]`}>{specs.quantity}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <span className={labelSm}>Material Requerido</span>
            <span className={`${valueLg} text-[#e06d53]`}>{specs.material}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <span className={labelSm}>Color y Acabado</span>
            <span className={`${valueLg} text-[#1c1917]`}>{specs.color}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <span className={labelSm}>Fecha Límite Despacho</span>
            <span className={`${valueLg} flex items-center gap-1 ${deadline.urgent ? 'text-[#dc2626]' : 'text-[#1c1917]'}`}>
              <Icon name={deadline.urgent ? 'schedule' : 'calendar_today'} className="text-[16px]" />
              {deadline.text}
            </span>
          </div>
        </div>
      </div>

      {/* Contrato de la cotización adjudicada */}
      <div className="mt-4 p-4 rounded-xl bg-linear-to-r from-[#fbf7f0] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <span className={labelSm}>Monto de Cotización Adjudicada</span>
            <div className="mt-0.5">
              <span className="text-[24px] leading-8 font-extrabold text-[#1c1917]">{amount}</span>
            </div>
          </div>
          <div className="sm:text-right">
            <span className={labelSm}>Plazo Comprometido</span>
            <p className={`${valueLg} text-[#1c1917]`}>{commitment}</p>
          </div>
        </div>
        <div className="pt-3">
          <span className={`${labelSm} mb-1`}>Tu propuesta aceptada:</span>
          <p className="text-[13px] leading-5 text-[#78716c] italic bg-white p-3 rounded-lg shadow-sm">“{message}”</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
        <a
          href={file.url}
          download
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#fbf7f0] text-[#1c1917]  text-[12px] font-semibold hover:bg-[#f4ebe1] transition-colors shadow-sm"
        >
          <Icon name="download" className="text-[18px]" />
          <span>Descargar STL ({file.size})</span>
        </a>
        <button
          type="button"
          onClick={onAction}
          disabled={!onAction || busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e06d53] text-white text-[14px] font-bold hover:bg-[#cc593f] transition-all shadow-md shadow-[#e06d53]/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name={status.action.icon} className="text-[20px]" />
          <span>{busy ? 'Guardando…' : status.action.label}</span>
        </button>
      </div>
    </article>
  )
}
