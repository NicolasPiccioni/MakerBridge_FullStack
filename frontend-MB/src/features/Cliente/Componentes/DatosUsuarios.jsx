import { useState } from 'react';
import { cambiarPassword } from '../../../api/perfilApi';

const Field = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-white/95 mb-1.5">{label}</label>
    <input
      readOnly
      type="text"
      value={value}
      className="w-full bg-white text-brand-dark text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm focus:ring-0 cursor-default"
    />
  </div>
);

const claseInput = (conError) =>
  `w-full bg-white text-brand-dark text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm focus:ring-2 focus:ring-brand-dark ${
    conError ? 'ring-2 ring-red-500' : ''
  }`;

const FORM_VACIO = { actual: '', nueva: '', repetir: '' };

function CambiarPassword() {
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto, campo }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cerrar = () => {
    setAbierto(false);
    setForm(FORM_VACIO);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (guardando) return;

    if (form.nueva !== form.repetir) {
      setAviso({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.', campo: 'repetir' });
      return;
    }

    setGuardando(true);
    setAviso(null);
    try {
      await cambiarPassword(form.actual, form.nueva);
      cerrar();
      setAviso({ tipo: 'ok', texto: 'Cambiaste tu contraseña.' });
    } catch (err) {
      setAviso({
        tipo: 'error',
        texto: err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message,
        campo: err.campo,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="block text-sm font-semibold text-white/95">Contraseña:</span>
        <button
          type="button"
          onClick={() => (abierto ? cerrar() : setAbierto(true))}
          className="text-xs font-semibold text-white underline hover:text-yellow-200 transition"
        >
          {abierto ? 'Cancelar' : 'Modificar'}
        </button>
      </div>

      {!abierto && (
        <input
          readOnly
          type="text"
          value="••••••••••••"
          aria-label="Contraseña (oculta)"
          className="w-full bg-white text-brand-dark text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm tracking-widest cursor-default focus:ring-0"
        />
      )}

      {abierto && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="actual"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Contraseña actual"
            value={form.actual}
            onChange={handleChange}
            className={claseInput(aviso?.campo === 'actual')}
          />
          <input
            name="nueva"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Contraseña nueva (mín. 8, con letras y números)"
            value={form.nueva}
            onChange={handleChange}
            className={claseInput(aviso?.campo === 'nueva')}
          />
          <input
            name="repetir"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repetí la contraseña nueva"
            value={form.repetir}
            onChange={handleChange}
            className={claseInput(aviso?.campo === 'repetir')}
          />
          <button
            type="submit"
            disabled={guardando}
            className="w-full py-2.5 rounded-full bg-brand-dark text-white text-sm font-bold hover:bg-black transition disabled:opacity-60 disabled:cursor-wait"
          >
            {guardando ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>
      )}

      {aviso && (
        <p
          role={aviso.tipo === 'error' ? 'alert' : 'status'}
          className={`mt-3 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold ${
            aviso.tipo === 'error' ? 'text-red-700' : 'text-emerald-700'
          }`}
        >
          {aviso.texto}
        </p>
      )}
    </div>
  );
}

const DatosUsuario = ({ user }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(user.id);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="bg-brand-blue-card rounded-3xl p-6 sm:p-7 text-white shadow-soft">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Datos del sistema
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
          Cuenta
        </span>
      </div>

      <div className="space-y-4">
        {/* ID usuario */}
        <div>
          <label className="block text-sm font-semibold text-white/95 mb-1.5">ID usuario:</label>
          <div className="relative">
            <input
              readOnly
              type="text"
              value={user.id}
              className="w-full bg-white text-brand-dark font-mono text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm focus:ring-2 focus:ring-brand-dark"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-blue hover:text-brand-dark px-2 py-1 rounded bg-brand-crema transition"
            >
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold text-white/95 mb-1.5">Condición actual:</label>
          <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {user.estado}
            </span>
            <span className="text-xs text-brand-dark-muted font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
              {user.penalizaciones}
            </span>
          </div>
        </div>

        <Field label="Rol:" value={user.rol} />
        <Field label="Fecha de registro:" value={user.fechaRegistro} />

        <CambiarPassword />
      </div>
    </div>
  );
};

export default DatosUsuario;