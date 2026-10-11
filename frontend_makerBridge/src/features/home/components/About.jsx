const metrics = [
  { value: '+1.200', label: 'Makers verificados', color: 'text-[#e06d53]' },
  { value: '+15.000', label: 'Piezas fabricadas', color: 'text-slate-900' },
  { value: '99.4%', label: 'Entregas a tiempo', color: 'text-emerald-600' },
]

export default function About() {
  return (
    <section aria-labelledby="about-us-title" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <span>Nuestra misión</span>
            </div>
            <h2 id="about-us-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sobre nosotros
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              En <strong className="text-slate-900">MakerBridge</strong> conectamos la capacidad productiva ociosa de talleres de manufactura digital con inventores, ingenieros, pymes y creadores que buscan producir localmente sin costos de importación ni cantidades mínimas prohibitivas.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Creemos en una red descentralizada, transparente y con garantía total: tus pagos quedan resguardados hasta que recibís tu pieza y confirmás que cumple con los estándares dimensionales requeridos.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className={`text-2xl sm:text-3xl font-extrabold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benchy quiz callout */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 sm:p-7 border border-amber-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-white shadow-sm font-black text-xl">
                🚢
              </div>
              <div>
                <span className="inline-block text-[11px] font-extrabold text-amber-800 tracking-wide uppercase">
                  ¡HOLA! SOY BENCHY, TU GUÍA 3D
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">¿No sabés qué tecnología usar?</h4>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Respondé 2 preguntas rápidas de 30 segundos sobre tus piezas o tu idea y te derivamos directo con el maker o diseñador ideal para vos.
            </p>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              Iniciar Quiz Rápido
              <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
