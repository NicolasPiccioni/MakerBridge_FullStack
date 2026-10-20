
export default function Header({
  title,
  accent,
  description}) {
  return (
    <div className="mb-8 md:mb-10 text-left">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark">
        {title} {accent && <span className="text-brand-terracota">{accent}</span>}
      </h1>
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-brand-dark-muted font-medium text-sm sm:text-base">
        <p>{description}</p>
        <a
          href="#contacto-soporte"
          className="inline-flex items-center text-xs font-bold text-brand-blue hover:text-brand-dark underline underline-offset-4 decoration-brand-blue/40 transition self-start sm:self-auto"
        >
          ¿Necesitás asistencia técnica?
        </a>
      </div>
    </div>
  )
}