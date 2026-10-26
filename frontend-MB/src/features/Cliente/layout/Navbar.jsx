import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  // { to: '/', label: 'Inicio' },
  { to: '', label: 'Mis solicitudes' },
  { to: 'nueva-solicitud', label: 'Nueva solicitud' },
  // { to: '/cotizaciones', label: 'Cotizaciones' },
  // { to: '/mensajes', label: 'Mensajes' },
  // { to: '/perfil', label: 'Mi Perfil' },
]

const DEFAULT_USER = { iniciales: 'CL', nombre: 'Cliente' }

// Lee el usuario que se guardó al iniciar sesión
function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuario'))
  } catch {
    return null
  }
}

// 'María López' -> 'ML'
function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// `user` solo se usa de respaldo cuando no hay sesión
export default function Navbar({ user: userDemo = DEFAULT_USER }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false) // menú de navegación (celular)
  const [userMenuOpen, setUserMenuOpen] = useState(false) // menú del usuario
  const userMenuRef = useRef(null)
  const [, refrescar] = useState(0) // se vuelve a dibujar si el perfil cambió el nombre
  useEffect(() => {
    const alCambiar = () => refrescar((n) => n + 1)
    window.addEventListener('usuario-actualizado', alCambiar)
    return () => window.removeEventListener('usuario-actualizado', alCambiar)
  }, [])

  const guardado = leerUsuario()
  const user = guardado
    ? { nombre: guardado.nombre, email: guardado.email, iniciales: iniciales(guardado.nombre) }
    : userDemo

  // Cerrar el menú del usuario al hacer click afuera o apretar Escape
  useEffect(() => {
    if (!userMenuOpen) return

    const alClickAfuera = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    const alTeclear = (e) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', alClickAfuera)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('mousedown', alClickAfuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [userMenuOpen])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUserMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className='sticky top-0 z-50 bg-[#F8F6F1]/90 backdrop-blur-sm border-b-2 border-brand-blue shadow-md '>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 flex items-center justify-between">
        <div className="">
          {/* // ---------------------- Primer Nav Link a Home desde el Logo -------------------- */}
          <NavLink to="/cliente" title="MakerBridge 3D HUB">
            <div className="w-11 h-11 bg-brand-blue rounded-xl flex items-center justify-center shadow-sm transition group-hover:scale-105">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScevamARhrClGcdHPxTxxEyl06NqftNyo5HEWvfl7tJg&s=10" alt="Logo del sitio" />
            </div>
          </NavLink>
        </div>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute top-full inset-x-0 flex-col gap-1 px-4 py-3 sm:px-6 bg-[#F8F6F1] border-b-2 border-brand-blue text-sm text-brand-dark-muted xl:static xl:flex xl:flex-row xl:items-center xl:gap-2 xl:p-0 xl:bg-transparent xl:border-b-0 xl:ml-10 xl:mr-auto `}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className='px-3.5 py-2 rounded-lg transition hover:text-brand-terracota font-bold'
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={menuOpen}
            className="xl:hidden p-2 text-brand-dark-muted hover:text-brand-dark rounded-lg hover:bg-black/5 transition"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              )}
            </svg>
          </button>

          {/* -------------------------- Boton notificaciones ----------------------- */}
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative p-2 text-brand-dark-muted hover:text-brand-dark rounded-full hover:bg-black/5 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-terracota rounded-full border-2 border-brand-crema" />
          </button>

          {/* ------------------------- Perfil + menú desplegable ------------------------- */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              title="Mi cuenta"
              className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-black/5 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              <div className="w-10 h-10 rounded-full bg-brand-salvia text-brand-dark font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm ring-1 ring-black/5">
                {user.iniciales}
              </div>
              <span className="hidden sm:block text-xs font-bold text-brand-dark leading-tight">
                {user.nombre}
              </span>
              <svg
                className={`hidden sm:block w-4 h-4 text-brand-dark-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl border border-brand-border-subtle shadow-float overflow-hidden"
              >
                <div className="px-4 py-3 bg-brand-crema border-b border-brand-border-subtle">
                  <p className="text-sm font-bold text-brand-dark truncate">{user.nombre}</p>
                  {user.email && <p className="text-xs text-brand-dark-muted truncate">{user.email}</p>}
                  <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                    Cliente
                  </span>
                </div>

                <div className="p-1.5 flex flex-col">
                  <Link
                    to="mi-perfil"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-dark hover:bg-brand-crema transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    Mi perfil
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={cerrarSesion}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}