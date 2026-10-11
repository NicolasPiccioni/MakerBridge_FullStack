const gearPath =
  'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'

const works = [
  {
    id: 1,
    tag: 'Mecánica FDM',
    gradient: 'from-[#de5d41] to-[#e6755c]',
    spec: 'Tolerancia: ±0.15 mm',
    title: 'Soporte Articulado V2',
    price: '$ 20.000',
    maker: 'Taller de Lucas (Córdoba)',
    material: 'PETG Técnico reforzado',
    delivery: '48 horas hábiles',
    buttonHover: 'hover:border-[#e06d53] hover:text-[#e06d53]',
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  },
  {
    id: 2,
    tag: 'Engranajes SLA',
    gradient: 'from-[#eab308] to-[#f59e0b]',
    spec: 'Acabado suave 25µm',
    title: 'Corona Helicoidal Pro',
    price: '$ 20.000',
    maker: '3D Craft Lab (Bs. As.)',
    material: 'Resina Tough Grado Industrial',
    delivery: '24 horas express',
    buttonHover: 'hover:border-amber-500 hover:text-amber-600',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d={gearPath} />
      </>
    ),
  },
  {
    id: 3,
    tag: 'Aeroespacial / Drone',
    gradient: 'from-[#4f83b6] to-[#6ba5db]',
    spec: 'Peso ultraliviano 42g',
    title: 'Carcasa Drone FPV',
    price: '$ 20.000',
    maker: 'Vertex 3D (Rosario)',
    material: 'Fibra de Carbono (PLA-CF)',
    delivery: '72 horas con testeo',
    buttonHover: 'hover:border-sky-500 hover:text-sky-600',
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
  },
]

const filters = ['Todos', 'Ingeniería', 'Diseño']

export default function FeaturedWorks() {
  return (
    <section aria-labelledby="featured-works-title" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
        <div>
          <h2 id="featured-works-title" className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Trabajos destacados
          </h2>
          <p className="text-sm text-slate-600 mt-1">Explorá proyectos reales fabricados por nuestra comunidad de creadores.</p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f, i) => (
            <a
              key={f}
              href="#"
              className={`text-xs hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-600 ${
                i === 0 ? 'font-bold' : 'font-medium'
              }`}
            >
              {f}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {works.map((w) => (
          <article
            key={w.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-tr ${w.gradient} p-6 flex flex-col justify-between text-white shadow-inner relative overflow-hidden`}>
                <span className="bg-white/20 backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-md self-start uppercase tracking-wider">
                  {w.tag}
                </span>
                <div className="flex items-center justify-center my-auto">
                  <svg className="w-16 h-16 opacity-90 stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
                    {w.icon}
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white/90">{w.spec}</span>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">{w.title}</h3>
                  <span className="text-lg font-black text-slate-900 whitespace-nowrap">{w.price}</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 pt-1 font-medium">
                  <p><span className="text-slate-400">Maker:</span> {w.maker}</p>
                  <p><span className="text-slate-400">Material:</span> {w.material}</p>
                  <p><span className="text-slate-400">Entrega:</span> {w.delivery}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className={`mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs transition duration-150 text-center ${w.buttonHover}`}
            >
              Ver detalles de fabricación
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
