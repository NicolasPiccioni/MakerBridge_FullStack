import Icon from './Icon'
import { Link } from 'react-router-dom'

export default function OrderCard({ order }) {
  const {
    accentClass, code, publishedAgo, status, title, client, location, file,
    specs, deadline, image, description, footerInfo, primaryAction,
  } = order

  return (
    <article className="w-full bg-white rounded-2xl border border-[#ebdccb] shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-4">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass}`} />

      {/* Fila superior: ID, publicado, estado */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-[#f4ebe1] text-[#292524]">{code}</span>
          <span className="text-[13px] text-[#78716c]">{publishedAgo}</span>
          <span className="text-[#d6c4b2]">•</span>
          <span className={`inline-flex items-center gap-1 text-[12px] px-2.5 py-0.5 rounded-full ${status.className}`}>
            {status.dotClass && <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />}
            {status.label}
          </span>
        </div>
      </div>

      {/* Título + cliente + archivo */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-[19px] font-bold text-[#1c1917] hover:text-brand-primary transition-colors leading-snug">{title}</h3>
          <div className="flex items-center gap-2 mt-1 text-[13px] text-[#78716c] flex-wrap">
            <span className="font-semibold text-[#1c1917] flex items-center gap-1">
              {client.verified && <Icon name="verified" className="text-[#f1b333] text-[16px]" />}
              <Icon name="person" className="text-[18px] text-[#e06d53]" />
              {client.name}
            </span>
            
            <span className="text-[#d6c4b2]">•</span>
            <span className="flex items-center gap-1">
              <Icon name="location_on" className="text-[15px] text-[#a8a29e]" />
              {location}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fbf7f0] border border-[#ebdccb] text-[12px] font-medium text-[#44403c]">
          <Icon name={file.icon} className={`text-[16px] ${file.iconClass}`} />
          <span>{file.label}</span>
        </div>
      </div>

      {/* Especificaciones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#fbf7f0] border border-[#f0e4d7]">
        {specs.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-[11px] font-bold text-[#a8a29e] uppercase tracking-wider">{s.label}</span>
            <span className="text-[14px] font-bold text-[#1c1917] truncate">{s.value}</span>
          </div>
        ))}
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#a8a29e] uppercase tracking-wider">Fecha Límite</span>
          <span className="text-[14px] font-bold text-[#dc2626] flex items-center gap-1">
            <Icon name={deadline.icon} className="text-[15px]" />
            {deadline.date}
          </span>
        </div>
      </div>

      {/* Preview + descripción */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#fcf9f2] p-3 rounded-xl border border-[#f4ebe1]">
        <div className="w-full md:w-36 h-24 rounded-lg bg-[#efe7db] flex items-center justify-center shrink-0 relative overflow-hidden">
          <img className="w-full h-full object-cover rounded-lg" src={image.src} alt={image.alt} />

        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[13px] text-[#57534e] line-clamp-2 italic">"{description}"</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-[#f4ebe1]">
        {footerInfo.variant === 'service' ? (
          <div className="flex items-center gap-1.5 text-[#78716c] text-[12px]">
            <Icon name="handyman" className="text-[12px] text-brand-primary" />
            <span>Servicio : <strong className="text-[#1c1917]">{footerInfo.text}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006878]" />
            <span className="text-[12px] text-[#006878] font-bold">{footerInfo.text}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            to={`cotizar/${order.id}`}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-brand-primary text-white hover:bg-[#be543c] text-[13px] font-bold shadow-sm shadow-brand-primary/25 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{primaryAction}</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </article>
  )
}
