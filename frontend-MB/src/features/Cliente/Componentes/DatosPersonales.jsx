import { useEffect, useState } from 'react';

const inputBase =
  'w-full bg-white text-brand-dark text-base rounded-full border px-5 py-3 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition shadow-sm outline-none';

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-base font-bold text-brand-dark mb-2">{children}</label>
);

// Del perfil que manda el servidor, solo lo que se puede editar
const formDesde = (p) => ({
  nombre: p.nombre,
  telefono: p.telefono,
  localidad: p.localidad,
  direccion: p.direccion,
  codigo_postal: p.codigo_postal,
  notif_whatsapp: p.notif_whatsapp,
  notif_email: p.notif_email,
});

const DatosPersonales = ({ perfil, onSave }) => {
  const [form, setForm] = useState(() => formDesde(perfil));
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto, campo }

  // Si el perfil cambia (por ejemplo, después de guardar), el formulario se sincroniza
  useEffect(() => {
    setForm(formDesde(perfil));
  }, [perfil]);

  const hayCambios = JSON.stringify(form) !== JSON.stringify(formDesde(perfil));

  // Borde normal, o rojo si el servidor marcó este campo
  const clase = (campo) =>
    `${inputBase} ${aviso?.campo === campo ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-400/80'}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const descartar = () => {
    setForm(formDesde(perfil));
    setAviso(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (guardando || !hayCambios) return;

    setGuardando(true);
    setAviso(null);
    try {
      await onSave(form);
      setAviso({ tipo: 'ok', texto: 'Guardamos tus cambios.' });
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
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-brand-border-subtle">
      <div className="border-b border-brand-border-subtle/80 pb-5 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark tracking-tight">
          Información Personal &amp; Facturación
        </h2>
        <p className="text-sm text-brand-dark-muted mt-1">
          Estos datos se utilizarán para la emisión de comprobantes y la entrega física de tus piezas 3D.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <Label htmlFor="nombre">Nombre y apellido</Label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            maxLength={150}
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ingresá tu nombre y apellido completo"
            className={clase('nombre')}
          />
        </div>

        {/* Email (solo lectura: es el usuario con el que se inicia sesión) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="email">Email:</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Email verificado
            </span>
          </div>
          <input
            id="email"
            type="email"
            readOnly
            value={perfil.email}
            className={`${inputBase} border-gray-300 bg-gray-50 text-brand-dark-muted cursor-not-allowed`}
          />
          <p className="mt-1.5 text-xs text-brand-dark-muted">
            Es el usuario con el que ingresás a MakerBridge, por eso no se puede cambiar.
          </p>
        </div>

        {/* Teléfono + Localidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="telefono">Teléfono / WhatsApp:</Label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              maxLength={30}
              value={form.telefono}
              onChange={handleChange}
              placeholder="+54 9 351 555-1234"
              className={clase('telefono')}
            />
          </div>
          <div>
            <Label htmlFor="localidad">Localidad:</Label>
            <input
              id="localidad"
              name="localidad"
              type="text"
              maxLength={100}
              value={form.localidad}
              onChange={handleChange}
              className={clase('localidad')}
            />
          </div>
        </div>

        {/* Dirección + CP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="direccion">Dirección de entrega:</Label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              maxLength={200}
              value={form.direccion}
              onChange={handleChange}
              className={clase('direccion')}
            />
          </div>
          <div>
            <Label htmlFor="codigo_postal">Código Postal:</Label>
            <input
              id="codigo_postal"
              name="codigo_postal"
              type="text"
              maxLength={10}
              value={form.codigo_postal}
              onChange={handleChange}
              className={clase('codigo_postal')}
            />
          </div>
        </div>

        {/* Preferencias */}
        <div className="pt-4 border-t border-brand-border-subtle/80 space-y-3">
          <span className="block text-sm font-bold uppercase tracking-wider text-brand-dark-muted mb-2">
            Preferencias de aviso
          </span>
          {[
            { name: 'notif_whatsapp', label: 'Recibir notificaciones por WhatsApp cuando la pieza esté en producción o lista' },
            { name: 'notif_email', label: 'Recibir resumen de presupuestos y cotizaciones de nuevos makers por correo' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
                className="w-5 h-5 rounded text-brand-terracota border-gray-300 focus:ring-brand-terracota"
              />
              <span className="text-sm font-medium text-brand-dark">{label}</span>
            </label>
          ))}
        </div>

        {aviso && (
          <p
            role={aviso.tipo === 'error' ? 'alert' : 'status'}
            className={`rounded-xl border p-3 text-sm ${
              aviso.tipo === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {aviso.texto}
          </p>
        )}

        {/* Botones */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3.5">
          <button
            type="button"
            onClick={descartar}
            disabled={!hayCambios || guardando}
            className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold text-brand-dark-muted bg-brand-crema hover:bg-brand-crema-dark hover:text-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descartar cambios
          </button>
          <button
            type="submit"
            disabled={!hayCambios || guardando}
            className="w-full sm:w-auto px-9 py-3 rounded-full text-sm font-bold text-white bg-brand-terracota hover:bg-brand-terracota-hover shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            {guardando ? 'Guardando…' : 'Guardar modificaciones'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatosPersonales;