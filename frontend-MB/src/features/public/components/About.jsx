import aboutImg from "../assets/images.jpeg";

const metrics = [
  { value: '+1.200', label: 'Makers verificados', color: 'text-brand-primary' },
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
              En <strong className="text-slate-900">MakerBridge</strong> conectamos la capacidad productiva ociosa de talleres de impresión 3D con inventores, creadores, pymes y usuarios que buscan producir localmente sin costos de importación ni cantidades mínimas prohibitivas.
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
          <div className="lg:col-span-5 bg-linear-to-br from-amber-50 to-orange-50/50 rounded-2xl  border border-amber-200/80 shadow-sm">
            <img
              src={aboutImg}
              alt="Sobre nosotros"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
