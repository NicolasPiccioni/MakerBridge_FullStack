const chips = ['Bambu Lab X1-Carbon', 'Formlabs SLA']

export default function FeaturedMaker() {
  return (
    <section aria-label="Maker Destacado del Mes" className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-r from-stone-100 via-orange-50/70 to-stone-100 rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/80 shadow-sm overflow-hidden">
        {/* Decorative ambient circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#e06d53]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Carousel arrows */}
        <button
          aria-label="Maker anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          aria-label="Siguiente maker"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Carousel content: Bruce Banner */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-8 sm:px-12 py-2">
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e06d53]/10 text-[#e06d53] text-xs font-bold tracking-wide uppercase">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Maker Destacado de la Semana
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Taller Bruce Banner</h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Especialista en manufactura FDM de grado ingeniería, prototipos mecánicos en Nylon con fibra de carbono y resinas de ultra precisión. Más de 240 trabajos entregados con 5.0 estrellas.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
              {chips.map((chip) => (
                <span key={chip} className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                  {chip}
                </span>
              ))}
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Turno disponible hoy
              </span>
            </div>
          </div>

          {/* Maker profile visual */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-1.5 shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white border border-slate-700/60 p-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#e06d53] flex items-center justify-center font-black text-xl mb-1 shadow-md shadow-[#e06d53]/30">
                    BB
                  </div>
                  <span className="text-xs font-bold tracking-tight">Bruce Banner</span>
                  <span className="text-[10px] text-amber-300 font-medium flex items-center gap-0.5 mt-0.5">★★★★★ (240+)</span>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-2 bg-white text-slate-800 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Nivel Pro ★
              </div>
            </div>
            <a href="#" className="mt-4 text-xs font-bold text-[#e06d53] hover:underline flex items-center gap-1">
              Ver perfil completo y portfolio →
            </a>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="w-6 h-2 rounded-full bg-[#e06d53]" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>
    </section>
  )
}
