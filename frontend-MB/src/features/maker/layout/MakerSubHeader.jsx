import Icon from '../components/Icon'

export default function MakerSubHeader({ activeOrders = 42 }) {
  return (
    <div className="w-full bg-[#f5ecdf] border-b border-[#ebdccb] px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <div className="flex items-center gap-2 text-[#78716c]">
          <Icon name="storefront" className="text-[16px] text-brand-primary" />
          <a href="#" className="hover:text-brand-primary transition-colors">Maker / Explorar Pedidos</a>
          <span>/</span>
        </div>
        <div className="flex items-center gap-4 text-[#78716c]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-semibold text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            <span>{activeOrders} órdenes activas en espera de Maker</span>
          </div>
    
        </div>
      </div>
    </div>
  )
}
