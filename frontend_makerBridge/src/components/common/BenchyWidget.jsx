export default function BenchyWidget() {
  return (
    <aside aria-label="Asistente virtual" className="fixed bottom-5 right-5 z-40">
      <button
        type="button"
        className="group flex items-center gap-3 bg-white border border-stone-200/90 shadow-lg hover:shadow-xl rounded-full pl-4 pr-1.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
      >
        <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900">
          ¿Necesitás ayuda? <strong className="text-[#e06d53] font-bold">Hablale a Benchy</strong>
        </span>
        <div className="w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-white">
          🚢
        </div>
      </button>
    </aside>
  )
}
