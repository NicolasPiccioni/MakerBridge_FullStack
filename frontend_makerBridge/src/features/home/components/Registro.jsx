import { useState } from "react";
import { Link } from "react-router-dom";
import "./Registro.css";

/* ---------- Íconos ---------- */
const Svg = ({ children, size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const UserIcon = () => (
  <Svg>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
);

const MailIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

const LockIcon = () => (
  <Svg>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

const EyeIcon = ({ off }) => (
  <Svg>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m3 3 18 18" />}
  </Svg>
);

const ArrowIcon = () => (
  <Svg size={16}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

const ClienteIcon = () => (
  <Svg size={18}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </Svg>
);

const MakerIcon = () => (
  <Svg size={18}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M7 14h10v7H7z" />
  </Svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="14" height="14" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

/* ---------- Datos ---------- */
// Los "value" coinciden con los roles de la base de datos
const ROLES = [
  {
    value: "cliente",
    titulo: "Cliente",
    descripcion: "Necesito imprimir piezas, prototipos o contratar modelado de diseño.",
    Icon: ClienteIcon,
  },
  {
    value: "maker",
    titulo: "Maker / Taller",
    descripcion: "Tengo impresoras 3D y busco pedidos para monetizar con mi impresora.",
    Icon: MakerIcon,
  },
];

// Devuelve 0 a 4 según qué tan fuerte es la contraseña
function fuerzaPassword(password) {
  if (!password) return 0;
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (/[a-zA-Z]/.test(password) && /\d/.test(password)) puntos++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) puntos++;
  if (password.length >= 12 || /[^a-zA-Z0-9]/.test(password)) puntos++;
  return puntos;
}

/* ---------- Componente ---------- */
export default function Registro({ onSubmit, onGoogle, error, errorCampo, loading }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState("cliente");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const fuerza = fuerzaPassword(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ nombre, email, password, rol });
  };

  return (
    <main className="reg-page">
      <section className="reg-card">
        <h1 className="reg-title">
          ¡Sumate a la red de
          <br />
          <span className="reg-brand">MakerBridge</span>!
        </h1>
        <p className="reg-subtitle">
          Conectá con talleres de impresión 3D o monetizá con tu propia impresora hoy mismo.
        </p>

        <div className="reg-divider">
          <span>REGISTRO DE NUEVO USUARIO</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <label className="reg-label" htmlFor="reg-nombre">
            NOMBRE Y APELLIDO <span className="reg-required">*</span>
          </label>
          <div className={`reg-input-wrap ${errorCampo === "nombre" ? "has-error" : ""}`}> {/* ← cambió */}
            <span className="reg-input-icon"><UserIcon /></span>
            <input
              id="reg-nombre"
              type="text"
              placeholder="Ej: Carlos Duarte o Martín Palermo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <label className="reg-label" htmlFor="reg-email">
            CORREO ELECTRÓNICO <span className="reg-required">*</span>
          </label>
          <div className={`reg-input-wrap ${errorCampo === "email" ? "has-error" : ""}`}> {/* ← cambió */}
            <span className="reg-input-icon"><MailIcon /></span>
            <input
              id="reg-email"
              type="email"
              placeholder="ejemplo@makerbridge.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="reg-label-row">
            <label className="reg-label" htmlFor="reg-password">
              CONTRASEÑA <span className="reg-required">*</span>
            </label>
            <span className="reg-hint">Mín. 8 caracteres alfanuméricos</span>
          </div>
          <div className={`reg-input-wrap ${errorCampo === "password" ? "has-error" : ""}`}> {/* ← cambió */}
            <span className="reg-input-icon"><LockIcon /></span>
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresá una clave segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              className="reg-toggle-pass"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          {/* Medidor de seguridad de la contraseña */}
          <div className="reg-strength" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`reg-strength-seg ${fuerza >= n ? `is-on level-${fuerza}` : ""}`}
              />
            ))}
          </div>

          {/* Rol */}
          <p className="reg-label reg-label--roles" id="reg-roles-label">
            SELECCIONÁ TU ROL EN LA PLATAFORMA
          </p>
          <div className="reg-roles" role="radiogroup" aria-labelledby="reg-roles-label">
            {ROLES.map(({ value, titulo, descripcion, Icon }) => {
              const activo = rol === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  className={`reg-role reg-role--${value} ${activo ? "is-active" : ""}`}
                  onClick={() => setRol(value)}
                >
                  <span className="reg-role-icon"><Icon /></span>
                  {activo && <span className="reg-role-badge">ACTIVO</span>}
                  <strong className="reg-role-title">{titulo}</strong>
                  <span className="reg-role-desc">{descripcion}</span>
                </button>
              );
            })}
          </div>

          {/* Términos */}
          <label className="reg-terms">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              required
            />
            <span>
              Acepto los <a href="#">Términos de Servicio</a> y las{" "}
              <a href="#">Políticas de Privacidad</a> de MakerBridge.
            </span>
          </label>

          {error && <p className="reg-error" role="alert">{error}</p>}

          <button type="submit" className="reg-btn reg-btn--primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
            {!loading && <ArrowIcon />}
          </button>
        </form>

        <div className="reg-divider reg-divider--small">
          <span>O REGÍSTRATE CON</span>
        </div>

        <button type="button" className="reg-btn reg-btn--google" onClick={onGoogle}>
          <span className="reg-google-badge"><GoogleIcon /></span>
          Continuar con Google
        </button>

        <p className="reg-login-link">
          ¿Ya tenés una cuenta? <Link to="/Login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
