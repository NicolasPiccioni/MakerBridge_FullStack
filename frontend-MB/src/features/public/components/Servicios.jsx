
const Check = ({ className }) => (
  <svg className={`w-4 h-4 mt-0.5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Cross = () => (
  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Arrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const services = [
  {
    id: 1,
    featured: true,
    badge: 'Tengo mi archivo listo',
    badgeClass: 'bg-brand-accentBlueLight text-brand-accentBlue border-brand-accentBlue/20',
    option: 'Opción 01',
    optionClass: 'text-brand-graySub',
    cardClass: 'border-2 border-brand-primary shadow-glow-primary lg:-translate-y-3',
    iconBox: 'bg-brand-accentBlueLight/70 text-brand-accentBlue',
    iconPaths: [
      'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    ],
    title: '1. Solo Impresión 3D',
    description: (
      <>
        Si ya contás con tu archivo 3D listo (<strong className="text-brand-dark font-semibold">.STL, .OBJ, .STEP</strong>), un maker certificado se encarga de materializarlo. Subís tu diseño, elegís el material, color y cantidad.
      </>
    ),
    listBorder: 'border-surface-border',
    listTitle: '¿Qué incluye el servicio?',
    listTitleClass: 'text-brand-dark',
    listClass: 'text-brand-dark/80',
    checkClass: 'text-emerald-600',
    features: [
      ' Revisamos tu archivo antes de imprimir',
      'Nos aseguramos de que no tenga errores y que la impresion sea optima.',
      'Ajustamos la impresora para tu pieza ',
      'La preparamos para que salga resistente y con buena terminación.',
      'Post-procesado y retiro cuidadoso de soportes',
    ],
    excluded: 'No incluye cambios en el diseño.Si necesitás modificar la pieza, elegí Diseño + Impresión.',
    cta: 'Subir Archivo 3D',
    ctaClass: 'py-3 border border-brand-dark/20 text-brand-dark font-bold hover:bg-brand-dark hover:text-white',
  },
  {
    id: 2,
    featured: true,
    badge: 'Diseño + Fabricación',
    badgeClass: 'bg-brand-lightBg text-brand-primary border-brand-primary/20',
    option: 'Opción 02',
    optionClass: 'text-brand-primary',
    cardClass: 'border-2 border-brand-primary shadow-glow-primary lg:-translate-y-3',
    iconBox: 'bg-brand-lightBg text-brand-primary',
    iconPaths: [
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    ],
    title: '2. Diseño + Impresión',
    description:
      ' De una foto de referencia, muestra dañada o idea en servilleta al objeto final en tus manos',
    listBorder: 'border-brand-primary/30',
    listTitle: 'Todo incluido llave en mano:',
    listTitleClass: 'text-brand-primary',
    listClass: 'text-brand-dark',
    checkClass: 'text-brand-primary',
    features: [
      'Diseñamos la pieza a tu medida ',
      'Te mostramos imágenes realistas del modelo 3D para que apruebes el diseño (incluye hasta 2 cambios)',
      'Asesoríamiento tecnicos, nos encargamos que las piezas encajen  perfecto y sean resistenes',
      'Entrega garantizada: Recibís la pieza física terminada, probada y lista para usar.',
    ],
    cta: 'Cotizar Proyecto Completo',
    ctaClass:
      'py-3.5 bg-brand-primary text-white font-extrabold shadow-md shadow-brand-primary/30 hover:bg-brand-primaryHover transform group-hover:scale-[1.02]',
  },
  {
    id: 3,
    featured: true,
    badge: 'Diseño Digital',
    badgeClass: 'bg-brand-accentYellowLight text-brand-accentYellow border-brand-accentYellow/20',
    option: 'Opción 03',
    optionClass: 'text-brand-graySub',
    cardClass: 'border-2 border-brand-primary shadow-glow-primary lg:-translate-y-3',
    iconBox: 'bg-brand-accentYellowLight/70 text-brand-accentYellow',
    iconPaths: [
      'M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z',
      'M9 12l2 2 4-4',
    ],
    title: '3. Solo Diseño 3D',
    description:
      'Pensado para ingenieros, inventores y empresas que requieren piezas técnicas, repuestos descontinuados o modelos de producto, y solo necesitan los planos y archivos digitales editables listos para fabricar.',
    listBorder: 'border-brand-primary/30',
    listTitle: '¿Qué incluye el servicio?',
    listTitleClass: 'text-brand-dark',
    listClass: 'text-brand-dark/80',
    checkClass: 'text-emerald-600',
    features: [
      'Archivos nativos y universales (.STEP, .STL, .IGES, .OBJ)',
      'Planos dimensionales técnicos acotados en PDF',
      'Optimización para manufactura (DFM FDM / SLA / CNC)',
    ],
    excluded: 'No incluye impresión física de la pieza',
    cta: 'Solicitar Modelado',
    ctaClass: 'py-3.5 bg-brand-primary text-white font-extrabold shadow-md shadow-brand-primary/30 hover:bg-brand-primaryHover transform group-hover:scale-[1.02]',

  },
]

// cell: { v: contenido, c: clases extra }
const compareHeaders = [
  { label: '1. Solo Impresión', className: 'text-center font-bold text-brand-accentBlue' },
  { label: '2. Imprimir + Diseñar', className: 'text-center font-bold text-brand-primary bg-brand-lightBg/30' },
  { label: '3. Solo Diseño', className: 'text-center font-bold text-brand-accentYellow' },
]

const OK = 'text-emerald-600 font-bold'
const OK_CORAL = 'text-brand-primary font-bold bg-brand-lightBg/20'
const NONE = 'text-brand-graySub'
const TXT = 'text-brand-dark'
const TXT_CORAL = 'text-brand-dark font-semibold bg-brand-lightBg/20'

const compareRows = [
  { label: 'Entrega de pieza física terminada', cells: [{ v: '✓', c: OK }, { v: '✓', c: OK_CORAL }, { v: '—', c: NONE }] },
  { label: 'Modelado CAD desde cero o plano', cells: [{ v: '—', c: NONE }, { v: '✓', c: OK_CORAL }, { v: '✓', c: OK }] },
  { label: 'Rondas de corrección / revisión', cells: [{ v: '—', c: NONE }, { v: 'Hasta 2 rondas', c: TXT_CORAL }, { v: 'Hasta 3 rondas', c: 'text-brand-dark font-semibold' }] },
  { label: 'Archivos fuente editables (.STEP, .CAD)', cells: [{ v: '—', c: NONE }, { v: 'Opcional (+15%)', c: OK_CORAL }, { v: '✓ Incluido', c: OK }] },
  { label: 'Asesoramiento en selección de polímeros / resinas', cells: [{ v: '✓', c: OK }, { v: '✓ Avanzado', c: OK_CORAL }, { v: 'Solo especificación', c: NONE }] },
  { label: 'Tiempo promedio de producción', cells: [{ v: '24 a 48 hs', c: TXT }, { v: '4 a 7 días hábiles', c: TXT_CORAL }, { v: '2 a 4 días hábiles', c: TXT }] },
]

const faqs = [
  {
    q: "¿En qué formatos debo enviar mi archivo si elijo 'Solo Impresión'?",
    a: 'Aceptamos formatos estándar como .STL, .OBJ y .STEP (o .STP). Te recomendamos exportar tus archivos en escala 1:1 en milímetros y con una malla poligonal optimizada para evitar faceteado visible en la pieza final.',
  },
  {
    q: '¿Qué materiales tienen disponibles para imprimir?',
    a: 'Contamos con un catálogo diverso que incluye PLA de alta precisión, PETG (resistente a la intemperie y apto mecánico), ABS, ASA con protección UV, TPU flexible y Resinas fotosensibles de alta definición (tecnología SLA/MSLA).',
  },
  {
    q: '¿Qué pasa si mi diseño no se ajusta bien tras recibirlo?',
    a: 'En el servicio de "Imprimir + Diseñar", contamos con garantía de ajuste funcional: si respetaste las medidas que brindaste y la pieza no cumple con la tolerancia estipulada, rehacemos la iteración sin costo de diseño adicional.',
  },
]

function ServiceCard({ s }) {
  return (
    <article className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative group ${s.cardClass}`}>
      
      <div>
        <div className={`flex items-center justify-between gap-2 mb-6 ${s.featured ? 'pt-1' : ''}`}>
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${s.badgeClass}`}>{s.badge}</span>
          <span className={`text-xs font-bold ${s.optionClass}`}>{s.option}</span>
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 ${s.iconBox}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            {s.iconPaths.map((d) => (
              <path key={d} d={d} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        </div>

        <h3 className="text-2xl font-extrabold text-brand-dark mb-3">{s.title}</h3>
        <p className="text-sm text-brand-graySub leading-relaxed mb-6">{s.description}</p>

        <div className={`border-t border-dashed pt-5 mb-8 ${s.listBorder}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3.5 ${s.listTitleClass}`}>{s.listTitle}</h4>
          <ul className={`space-y-3 text-xs sm:text-sm font-medium ${s.listClass}`}>
            {s.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className={s.checkClass} />
                <span>{f}</span>
              </li>
            ))}
            {s.excluded && (
              <li className="flex items-start gap-2.5 text-brand-graySub text-xs">
                <Cross />
                <span className="italic">{s.excluded}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default function Servicios() {
  return (
    <>
      {/* Hero: el HTML que pasaste empezaba a mitad de esta sección, así que el contenedor es una reconstrucción */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight leading-[1.15] mb-5">
          Nuestros Servicios de <br className="hidden sm:inline" />
          <span className="text-brand-primary decoration-brand-primary/30 decoration-wavy decoration-2 underline-offset-8">
            Impresión y Diseño 3D
          </span>
        </h1>
        <p className="text-base sm:text-lg text-brand-graySub font-normal max-w-2xl mx-auto leading-relaxed mb-8">
          En MakerBridge nos encargamos de brindar el servicio más personalizado. Ya sea que tengas tu archivo listo para fabricar o necesites crearlo desde un boceto, elegí la modalidad pensada para tu meta.
        </p>
        <div className="inline-flex p-1 rounded-xl bg-white border border-surface-border/80 shadow-xs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-brand-dark text-white shadow-xs transition-all"
          >
            Explorar las 3 Modalidades
          </button>
          <a
            href="#tabla-comparativa"
            role="tab"
            aria-selected="false"
            className="px-5 py-2 rounded-lg text-xs sm:text-sm font-medium text-brand-graySub hover:text-brand-dark transition-colors"
          >
            Tabla Comparativa Rápida
          </a>
        </div>
      </section>

      {/* Tarjetas de servicios */}
      <section id="servicios-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
      </section>

      {/* Tabla comparativa */}
      <section id="tabla-comparativa" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Comparativa de Servicios</h2>
          <p className="text-sm sm:text-base text-brand-graySub mt-2">
            Visualizá exactamente qué alcance tiene cada uno de nuestros procesos para elegir el adecuado.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-surface-border/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-sm border-collapse min-w-160">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/60">
                  <th scope="col" className="py-4 px-6 font-bold text-brand-dark">Característica / Entregable</th>
                  {compareHeaders.map((h) => (
                    <th key={h.label} scope="col" className={`py-4 px-4 ${h.className}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60 font-medium">
                {compareRows.map((row) => (
                  <tr key={row.label} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-brand-dark">{row.label}</td>
                    {row.cells.map((cell, i) => (
                      <td key={i} className={`py-4 px-4 text-center ${cell.c}`}>{cell.v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Preguntas Frecuentes</h2>
          <p className="text-sm text-brand-graySub mt-2">Todo lo que necesitás saber antes de enviar tu proyecto a MakerBridge.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group bg-white rounded-2xl border border-surface-border/80 p-5 shadow-xs transition-all duration-200 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer font-bold text-brand-dark text-base">
                <span>{f.q}</span>
                <span className="ml-4 shrink-0 transition group-open:rotate-180 text-brand-graySub">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
              </summary>
              <p className="text-sm text-brand-graySub mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}