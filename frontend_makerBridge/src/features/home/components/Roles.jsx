const ArrowIcon = () => (
  <svg className="w-4 h-4 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// Las clases se escriben completas para que Tailwind las detecte
const roles = [
  {
    id: 'maker',
    title: 'Soy Maker',
    description: 'Tengo una impresora 3D y quiero ofrecer mis servicios de manufactura y diseño.',
    cardHover: 'hover:border-[#e06d53]/40',
    iconBox: 'bg-[#e06d53]/10 text-[#e06d53]',
    icon: (
      <>
        <rect height="14" rx="2" ry="2" width="20" x="2" y="7" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
    checkClass: 'bg-emerald-100 text-emerald-600',
    items: [
      'Registrate como proveedor certificado',
      'Publicá tus trabajos y máquinas disponibles',
      'Recibí pedidos reales con pago garantizado',
    ],
    button: 'Registrarme como Maker',
    buttonClass:
      'bg-[#e06d53] hover:bg-[#cc593f] text-white shadow-lg shadow-[#e06d53]/25 hover:shadow-xl hover:shadow-[#e06d53]/35',
  },
  {
    id: 'client',
    title: 'Necesito un Maker',
    description: '¿Tenés una idea o un archivo 3D y necesitás materializarla? Encontrá el proveedor ideal para tu proyecto.',
    cardHover: 'hover:border-slate-300',
    iconBox: 'bg-sky-50 text-sky-600',
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </>
    ),
    checkClass: 'bg-sky-100 text-sky-600',
    items: [
      'Subí tu archivo 3D (.STL, .STEP, .OBJ)',
      'Cotizá al instante entre talleres locales',
      'Recibí tu pieza con control de calidad',
    ],
    button: 'Buscar un Maker',
    buttonClass: 'bg-[#e6f4f1] hover:bg-[#d8ece8] text-teal-900 border border-teal-200',
  },
]

export default function Roles() {
  return (
    <section aria-labelledby="roles-title" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 id="roles-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ¿Qué rol tomás?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600">
          MakerBridge <strong className="text-[#e06d53] font-semibold">conecta</strong> a quienes imprimen con quienes lo necesitan. Elegí tu lado y comenzá en minutos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {roles.map((role) => (
          <div
            key={role.id}
            data-purpose={`role-card-${role.id}`}
            className={`relative bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-warm-md flex flex-col justify-between transition duration-300 ${role.cardHover}`}
          >
            <div className="space-y-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${role.iconBox}`}>
                <svg className="w-6 h-6 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  {role.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{role.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">{role.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <ul className="space-y-3 text-sm text-slate-700">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-semibold">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${role.checkClass}`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-4">
              <button
                type="button"
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-base transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 ${role.buttonClass}`}
              >
                {role.button}
                <ArrowIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
