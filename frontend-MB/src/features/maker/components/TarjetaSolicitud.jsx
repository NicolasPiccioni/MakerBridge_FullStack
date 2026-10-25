import Icon from './Icon'

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')

export default function OrderSummaryCard({ order }) {
  const { code, publishedLabel, title, client, file, specs, description } = order

  return (
    <div className="bg-white rounded-xl border border-[#ECDDC7] p-6 shadow-sm">
      {/* Código, publicado y título */}
      <div className="flex items-start justify-between gap-4 border-b border-[#F4EFE6] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-primary bg-[#FEF4F0] border border-[#FCD5CC] px-2.5 py-0.5 rounded">
              {code}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Icon name="schedule" className="text-[14px]" /> {publishedLabel}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{title}</h1>
        </div>
      </div>

      {/* Perfil del cliente */}
      <div className="flex items-center justify-between p-3.5 mt-4 rounded-lg bg-[#FAF6F0] border border-[#ECDDC7]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 ring-2 ring-[#E06D53]/20 shrink-0 shadow-xs flex items-center justify-center text-sm font-bold text-gray-600">
            {getInitials(client.name)}
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">{client.name}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Icon name="location_on" className="text-[13px] text-brand-primary" /> {client.location}
            </span>
          </div>
        </div>
      </div>

      {/* Archivo */}
      {file ? (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#FAF6F0] border border-[#ECDDC7]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#FEF4F0] border border-[#FCD5CC] flex items-center justify-center text-brand-primary shrink-0">
              <Icon name="deployed_code" className="text-[20px]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-900 block truncate">{file.name}</span>
              <span className="font-mono text-[10px] text-gray-500">Archivo CAD 3D</span>
            </div>
          </div>
          <a
            href={file.url}
            download
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#FAF6F0] text-gray-900 text-xs font-bold border border-[#ECDDC7] shadow-sm transition-all hover:text-brand-primary shrink-0"
          >
            <Icon name="download" className="text-[16px] text-brand-primary" />
            <span>Descargar archivo</span>
          </a>
        </div>
      ) : (
        <div className="mt-4 p-3.5 rounded-lg bg-[#FAF6F0] border border-[#ECDDC7] text-xs text-gray-500">
          Este pedido no tiene archivo adjunto.
        </div>
      )}
      
      {/* Parámetros técnicos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
        <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-2.5 rounded-lg flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Cantidad</span>
          <span className="text-sm font-bold text-gray-900 mt-0.5">{specs.quantity}</span>
        </div>
        <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-2.5 rounded-lg flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Material Requerido</span>
          <span className="text-xs font-bold text-brand-primary mt-0.5 truncate" title={specs.material}>
            {specs.material}
          </span>
        </div>
        <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-2.5 rounded-lg flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Color / Acabado</span>
          <span className="text-xs font-semibold text-gray-900 mt-0.5">{specs.color}</span>
        </div>
        <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-2.5 rounded-lg flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Fecha Límite</span>
          <span className="text-xs font-bold text-red-600 mt-0.5">{specs.deadline}</span>
        </div>
      </div>

      {/* Descripción */}
      <div className="mt-4 pt-4 border-t border-[#F4EFE6] flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Descripción técnica del trabajo</span>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
