import { useState } from 'react';

const inputClass =
  'w-full bg-white text-brand-dark text-base rounded-full border border-gray-400/80 px-5 py-3 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition shadow-sm outline-none';

const Label = ({ children }) => (
  <label className="block text-base font-bold text-brand-dark mb-2">{children}</label>
);

const DatosPersonales = ({ user, onSave }) => {
  const [form, setForm] = useState({
    full_name: user.nombre,
    email: user.email,
    phone: user.telefono,
    city: user.localidad,
    address: user.direccion,
    zip: user.codigoPostal,
    notifWhatsapp: user.notifWhatsapp,
    notifEmail: user.notifEmail,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form); // listo para enviar al backend con fetch/axios
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
          <Label>Nombre y apellido</Label>
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Ingresá tu nombre y apellido completo"
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Email:</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Email verificado
            </span>
          </div>
          <div className="relative">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={`${inputClass} pr-10`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Teléfono + Localidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Teléfono / WhatsApp:</Label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <Label>Localidad:</Label>
            <input name="city" type="text" value={form.city} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Dirección + CP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Label>Dirección de entrega:</Label>
            <input name="address" type="text" value={form.address} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <Label>Código Postal:</Label>
            <input name="zip" type="text" value={form.zip} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Preferencias */}
        <div className="pt-4 border-t border-brand-border-subtle/80 space-y-3">
          <span className="block text-sm font-bold uppercase tracking-wider text-brand-dark-muted mb-2">
            Preferencias de aviso
          </span>
          {[
            { name: 'notifWhatsapp', label: 'Recibir notificaciones por WhatsApp cuando la pieza esté en producción o lista' },
            { name: 'notifEmail', label: 'Recibir resumen de presupuestos y cotizaciones de nuevos makers por correo' },
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

        {/* Botones */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3.5">
          <button
            type="button"
            onClick={() => setForm({ ...form })}
            className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold text-brand-dark-muted bg-brand-crema hover:bg-brand-crema-dark hover:text-brand-dark transition"
          >
            Descartar cambios
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-9 py-3 rounded-full text-sm font-bold text-white bg-brand-terracota hover:bg-brand-terracota-hover shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Guardar modificaciones
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatosPersonales;