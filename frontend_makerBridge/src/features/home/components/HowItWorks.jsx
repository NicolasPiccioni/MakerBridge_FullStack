const gearPath =
  'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'

const steps = [
  {
    n: '01',
    title: 'Subí o solicitá tu modelo',
    text: 'Cargá tu archivo .STL, .OBJ o .STEP, o contratá a un diseñador si solo tenés un plano o boceto inicial.',
    hover: 'hover:border-teal-400',
    iconBox: 'bg-teal-50 text-teal-600',
    label: 'text-teal-700',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" x2="12" y1="18" y2="12" />
        <line x1="9" x2="15" y1="15" y2="15" />
      </>
    ),
  },
  {
    n: '02',
    title: 'Configurá los detalles',
    text: 'Definí cantidades requeridas, material (PLA, PETG, Resina, Nylon), relleno interno, color y urgencia de entrega.',
    hover: 'hover:border-cyan-400',
    iconBox: 'bg-cyan-50 text-cyan-600',
    label: 'text-cyan-700',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d={gearPath} />
      </>
    ),
  },
  {
    n: '03',
    title: 'Elegí a tu Maker',
    text: 'Seleccioná al fabricante o taller que mejor se ajuste a tu zona geográfica, presupuesto y calificaciones de comunidad.',
    hover: 'hover:border-blue-400',
    iconBox: 'bg-blue-50 text-blue-600',
    label: 'text-blue-700',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    n: '04',
    title: 'Sigue tu pedido',
    text: 'Monitoreá el estado de la impresión en tiempo real con fotos del proceso hasta recibir tu producto terminado en tu puerta.',
    hover: 'hover:border-emerald-400',
    iconBox: 'bg-emerald-50 text-emerald-600',
    label: 'text-emerald-700',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 id="how-it-works-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿Cómo funciona MakerBridge con tu archivo 3D?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Transformá modelos digitales en piezas físicas tangibles en solo cuatro simples pasos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((s) => (
          <div
            key={s.n}
            className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between relative group transition-colors ${s.hover}`}
          >
            <div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.iconBox}`}>
                <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{s.title}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{s.text}</p>
            </div>
            <span className={`mt-4 text-[10px] uppercase font-extrabold tracking-wider ${s.label}`}>Paso {s.n}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
