import { useState } from 'react';

const Field = ({ label, value, action }) => (
  <div>
    {action ? (
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-semibold text-white/95">{label}</label>
        {action}
      </div>
    ) : (
      <label className="block text-sm font-semibold text-white/95 mb-1.5">{label}</label>
    )}
    <input
      readOnly
      type="text"
      value={value}
      className="w-full bg-white text-brand-dark text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm focus:ring-0 cursor-default"
    />
  </div>
);

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

        {/* Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-white/95">Contraseña actual:</label>
            <button type="button" className="text-xs font-semibold text-white underline hover:text-yellow-200 transition">
              Modificar
            </button>
          </div>
          <div className="relative">
            <input
              readOnly
              type="password"
              defaultValue="supersecurepassword123"
              className="w-full bg-white text-brand-dark text-sm font-semibold py-2.5 px-4 rounded-full border-0 shadow-sm tracking-widest focus:ring-0"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-dark-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosUsuario;