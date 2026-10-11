import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Explorar Productos" },
  { label: "Servicios", dot: true },
  { label: "Cómo Funciona" },
  { label: "Comunidad" },
];

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          aria-label="MakerBridge Inicio"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e06d53] to-[#f48f76] flex items-center justify-center text-white shadow-md shadow-[#e06d53]/20 group-hover:scale-105 transition-transform duration-200">
            <svg
              className="w-6 h-6 stroke-current fill-none stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" x2="12" y1="22.08" y2="12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              MakerBridge
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e06d53]">
              3D Printing Network
            </span>
          </div>
        </a>

        {/* Main Navigation Menu */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          <a
            href="#"
            aria-current="page"
            className="px-3.5 py-2 text-sm font-semibold text-[#e06d53] relative after:content-[''] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-[#e06d53] rounded-md transition-colors"
          >
            Home
          </a>
          {navLinks.map(({ label, dot }) => (
            <a
              key={label}
              href="#"
              className={`px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 rounded-lg transition-colors ${
                dot ? "flex items-center gap-1.5" : ""
              }`}
            >
              {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e06d53]" />
              )}
              {label}
            </a>
          ))}
        </nav>

        {/* Header CTAs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/Login")}
            className="px-5 py-2.5 text-sm font-semibold text-[#e06d53] hover:text-[#cc593f] border border-[#e06d53]/40 hover:border-[#e06d53] rounded-xl hover:bg-[#e06d53]/5 transition duration-150"
          >
            Ingresar
          </button>
        </div>
      </div>
    </header>
  );
}
