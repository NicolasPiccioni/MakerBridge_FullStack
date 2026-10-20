import Icon from './Icon'

export default function PlatformGuarantee() {
  return (
    <div className="bg-white rounded-xl border border-[#ECDDC7] p-4 shadow-sm flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#FEF4F0] border border-[#FCD5CC] flex items-center justify-center text-brand-primary shrink-0">
        <Icon name="verified_user" className="text-[22px]" />
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-bold text-gray-900 block text-xs">Pautas de Calidad &amp; Protección MakerBridge</span>
        <p className="mt-0.5 leading-relaxed">
          El pago queda reservado desde el momento en que el cliente acepta tu cotización. El monto neto se transfiere automáticamente a tu cuenta una vez entregado el pedido.
        </p>
      </div>
    </div>
  )
}
