import { useEffect, useRef, useState } from 'react';

/**
 * Configuración de cada estado: ícono, colores y etiqueta.
 *También podríamos poner como configuración el color asi usamos el azul para la vista de cliente
 * Usa los tokens de tu @theme (brand-*, surface-*).
 * que esta en el global.css
 */
export const ESTADOS = {
  asignado: {
    label: 'Asignado / Por Iniciar',
    icon: 'hourglass_top',
    badge: 'bg-brand-accentYellowLight text-amber-700 border-amber-200',
    text: 'text-amber-700',
  },
  en_proceso: {
    label: 'En Proceso • Imprimiendo',
    icon: 'precision_manufacturing',
    badge: 'bg-brand-accentBlueLight text-brand-accentBlue border-sky-200',
    text: 'text-brand-accentBlue',
  },
  listo_despacho: {
    label: 'Listo para Despacho',
    icon: 'inventory_2',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
  },
  en_transito: {
    label: 'En Tránsito',
    icon: 'local_shipping',
    badge: 'bg-brand-lightBg text-brand-primary border-brand-borderTone',
    text: 'text-brand-primary',
  },
};

// Texto e ícono del botón de confirmación según el estado destino
const ACCIONES = {
  en_proceso: { cta: 'Confirmar e Iniciar Impresión', ctaIcon: 'play_arrow' },
  listo_despacho: { cta: 'Confirmar Pieza Terminada', ctaIcon: 'check_circle' },
  en_transito: { cta: 'Confirmar Despacho', ctaIcon: 'local_shipping' },
};

function EstadoChip({ estado, destacado = false }) {
  const e = ESTADOS[estado];
  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${e.badge}`}
      >
        <span className="material-symbols-outlined text-[20px]">{e.icon}</span>
      </div>
      <div className="flex flex-col">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${
            destacado ? e.text : 'text-brand-graySub'
          }`}
        >
          {destacado ? 'Siguiente Estado' : 'Estado Actual'}
        </span>
        <span className={`text-[13px] font-bold ${e.text}`}>{e.label}</span>
      </div>
    </div>
  );
}

/**
 * Props:
 *  - open:       boolean
 *  - pedido:     { codigo: 'MK-9510', titulo: 'Engranaje cónico...' }
 *  - estadoActual / estadoNuevo: claves de ESTADOS
 *  - onClose:    () => void
 *  - onConfirm:  () => Promise|void   (si lanza error, el modal queda abierto)
 */
export default function ConfirmarEstadoModal({
  open,
  pedido,
  estadoActual,
  estadoNuevo,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setError('');
      setLoading(false);
    }
  }, [open]);

  // Escape para cerrar + bloqueo de scroll + foco inicial
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && !loading && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onClose]);

  if (!open || !pedido) return null;

  const accion = ACCIONES[estadoNuevo] ?? ACCIONES.en_proceso;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : err?.message || 'No pudimos actualizar el estado. Probá de nuevo.',
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-estado-titulo"
        className="relative w-full max-w-lg bg-surface-card rounded-2xl shadow-warm-lg border border-surface-border overflow-hidden my-8 outline-none"
      >
        {/* Barra superior */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-primary" />

        <div className="p-6 sm:p-7 flex flex-col gap-6">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold bg-surface-cardMuted text-brand-dark px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Pedido #{pedido.codigo}
                </span>
                <span className="text-[12px] text-brand-graySub font-medium">
                  • {pedido.titulo}
                </span>
              </div>
              <h2
                id="modal-estado-titulo"
                className="text-[22px] font-extrabold text-brand-dark tracking-tight"
              >
                Actualizar Estado del Pedido
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Cerrar"
              className="w-8 h-8 shrink-0 rounded-full bg-surface-base hover:bg-surface-cardMuted text-brand-graySub hover:text-brand-dark transition-colors flex items-center justify-center border border-surface-border disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Transición de estado */}
          <div className="bg-surface-base border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <EstadoChip estado={estadoActual} />
            <span className="material-symbols-outlined text-[22px] text-slate-400 rotate-90 sm:rotate-0">
              arrow_forward
            </span>
            <EstadoChip estado={estadoNuevo} destacado />
          </div>

          {/* Aviso */}
          <div className="p-3.5 rounded-xl bg-brand-accentBlueLight border border-sky-200 flex items-start gap-2.5 text-sky-800">
            <span className="material-symbols-outlined text-[20px] text-brand-accentBlue mt-0.5">
              info
            </span>
            <p className="text-[12px] leading-relaxed">
              Al cambiar el estado a{' '}
              <strong className="font-bold">"{ESTADOS[estadoNuevo].label}"</strong>, el
              cliente recibirá una notificación automática por correo.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-surface-cardMuted">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-surface-border bg-surface-card text-brand-graySub hover:text-brand-dark hover:bg-surface-cardMuted text-[13px] font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-white text-[14px] font-bold hover:bg-brand-primaryHover transition-all shadow-glow-primary disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">{accion.ctaIcon}</span>
              )}
              <span>{loading ? 'Actualizando…' : accion.cta}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   EJEMPLO DE USO en la vista de "Mis Trabajos"

   const [modal, setModal] = useState(null); // { pedido, de, a }

   <button
     onClick={() =>
       setModal({
         pedido: { codigo: 'MK-9402', titulo: 'Soporte Dinámico Articulado' },
         de: 'asignado',
         a: 'en_proceso',
       })
     }
   >
     Iniciar Fabricación
   </button>

   <ConfirmarEstadoModal
     open={!!modal}
     pedido={modal?.pedido}
     estadoActual={modal?.de}
     estadoNuevo={modal?.a}
     onClose={() => setModal(null)}
     onConfirm={async () => {
       await api.actualizarEstado(modal.pedido.codigo, modal.a);
       setPedidos((prev) =>
         prev.map((p) =>
           p.codigo === modal.pedido.codigo ? { ...p, estado: modal.a } : p
         )
       );
     }}
   />
------------------------------------------------------------------- */