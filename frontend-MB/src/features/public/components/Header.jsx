import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  /* { label: 'Explorar Productos', to: '/explorarProductos' }, */
  { label: 'Servicios', to: '/servicios' },
  /* { label: 'Cómo Funciona', to: '/como-funciona' }, */
]

const navLinkClasses = ({ isActive }) =>
  `px-3.5 py-2 text-sm rounded-lg transition-colors relative ${
    isActive
      ? "font-semibold text-brand-primary after:content-[''] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-brand-primary"
      : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5'
  }`

const mobileNavLinkClasses = ({ isActive }) =>
  `px-3.5 py-2.5 text-sm rounded-lg transition-colors ${
    isActive ? 'font-semibold text-brand-primary' : 'font-medium text-slate-600 hover:bg-black/5'
  }`

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          aria-label="MakerBridge Inicio"
          className="flex items-center gap-3 group focus:outline-hidden"
          onClick={() => setMenuAbierto(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-primary to-[#f48f76] flex items-center justify-center text-white shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-6 h-6 stroke-current fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" x2="12" y1="22.08" y2="12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">MakerBridge</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary">3D Printing Network</span>
          </div>
        </Link>

        {/* Menu de navegación principal - desktop */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          {navLinks.map(({ label, to }) => (
            <NavLink key={label} to={to} className={navLinkClasses}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Header CTAs + botón hamburguesa */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-5 py-2.5 font-semibold bg-brand-primary hover:bg-brand-primaryHover text-white shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 rounded-xl transition duration-150"
          >
            Ingresar
          </Link>

          {/* Solo visible en mobile */}
          <button
            type="button"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 text-slate-700"
          >
            <svg className="w-6 h-6 stroke-current fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú desplegable mobile */}
      {menuAbierto && (
        <nav
          aria-label="Navegación mobile"
          className="md:hidden border-t border-surface-border bg-[#faf8f5] px-4 py-3 flex flex-col gap-1"
        >
          <NavLink to="/" end className={mobileNavLinkClasses} onClick={() => setMenuAbierto(false)}>
            Home
          </NavLink>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={mobileNavLinkClasses}
              onClick={() => setMenuAbierto(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setMenuAbierto(false)}
            className="mt-2 w-full text-center px-5 py-2.5 font-semibold bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl transition duration-150"
          >
            Ingresar
          </Link>
        </nav>
      )}
    </header>
  )
}