import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m3 3 18 18" />}
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="14" height="14" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

export default function Login({ onSubmit, onGoogle , error, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <main className="login-page">
      <div className="login-deco login-deco--left" aria-hidden="true">
        <span className="deco-line deco-line--arrow" />
        <span className="deco-line deco-line--short" />
      </div>
      <div className="login-deco login-deco--right" aria-hidden="true">
        <span className="deco-line deco-line--arrow" />
        <span className="deco-line deco-line--short" />
      </div>

      <section className="login-card">
        <h1 className="login-title">
          ¡Gracias por formar parte de
          <br />
          <span className="login-brand">MakerBridge</span>!
        </h1>

        <div className="divider">
          <span>iniciar sesión</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="email">Email:</label>
          <div className="input-wrap">
            <span className="input-icon"><MailIcon /></span>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@makerbridge.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <label className="field-label" htmlFor="password">Contraseña:</label>
          <div className="input-wrap">
            <span className="input-icon"><LockIcon /></span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="links">
          <Link to ="/recuperar">¿Olvidaste tu contraseña?</Link>
          <Link to="/registro">¿Eres nuevo? Crea tu cuenta</Link>
        </div>
{/* 
        <div className="divider divider--small">
          <span>O DESDE</span>
        </div>

        <button type="button" className="btn btn-google" onClick={onGoogle}>
          <span className="google-badge"><GoogleIcon /></span>
          Desde Google
        </button> */}
      </section>
    </main>
  );
}
