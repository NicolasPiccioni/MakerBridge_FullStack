import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

const navLinks = [
  { label: 'Mis trabajos', to: '/maker/mis-trabajos' },
]

const navLinkClasses = ({ isActive }) =>
  `px-3.5 py-2 text-sm rounded-lg transition-colors relative ${isActive
    ? "font-semibold text-brand-primary after:content-[''] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-brand-primary"
    : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5'
  }`

// Lee el usuario que se guardó al iniciar sesión
function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuario'))
  } catch {
    return null
  }
}

// 'Carlos Duarte' -> 'CD'
function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// `user` solo se usa de respaldo cuando no hay sesión
export default function MakerHeader({ user: userDemo = { initials: 'CD', name: 'Carlos Duarte' } }) {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  const guardado = leerUsuario()
  const user = guardado
    ? { name: guardado.nombre, email: guardado.email, initials: iniciales(guardado.nombre) }
    : userDemo

  // Cerrar el menú al hacer click afuera o apretar Escape
  useEffect(() => {
    if (!menuAbierto) return

    const alClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
    }
    const alTeclear = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }

    document.addEventListener('mousedown', alClickAfuera)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('mousedown', alClickAfuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [menuAbierto])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setMenuAbierto(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#eee7dc]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/25 transition-transform group-hover:scale-105">
              <Icon name="view_in_ar" className="text-[24px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[20px] tracking-tight text-[#1c1917] leading-none">MakerBridge</span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#a8a29e] uppercase mt-0.5">
                3D PRINTING NETWORK
              </span>
            </div>
          </a>

          {/* Nav */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-7">
            <NavLink to="/maker" end className={navLinkClasses}>
              Explorar Pedidos
            </NavLink>
            {navLinks.map(({ label, to }) => (
              <NavLink key={label} to={to} className={navLinkClasses}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Usuario + menú desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
            className="flex items-center gap-2.5 pl-4 border-l border-[#ede3d8] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded-lg"
          >
            <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user.initials}
            </div>
            <span className="hidden md:inline font-semibold text-[14px] text-[#292524]">{user.name}</span>
            <Icon
              name="expand_more"
              className={`text-[#78716c] text-[18px] transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`}
            />
          </button>

          {menuAbierto && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl border border-[#ECDDC7] shadow-lg overflow-hidden z-50"
            >
              <div className="px-4 py-3 bg-[#FAF6F0] border-b border-[#ECDDC7]">
                <p className="text-sm font-bold text-[#1c1917] truncate">{user.name}</p>
                {user.email && <p className="text-xs text-[#78716c] truncate">{user.email}</p>}
                <span className="inline-block mt-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary bg-[#FEF4F0] border border-[#FCD5CC] px-2 py-0.5 rounded">
                  Maker
                </span>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={cerrarSesion}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon name="logout" className="text-[18px]" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}