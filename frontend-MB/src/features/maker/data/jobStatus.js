// Configuración visual por valor de `estado` del pedido.
// `en_proceso` y `asignado` salen del diseño. Los otros tres (listo_despacho,
// en_transito, finalizado) NO estaban diseñados: son una propuesta, ajustalos a gusto.
export const JOB_STATUS = {
  en_proceso: {
    label: 'En Proceso • Imprimiendo',
    badge: { className: 'bg-[#9cecff] text-[#006d7d]', pulse: true },
    quotationBadge: 'bg-[#a5eeff] text-[#001f25]',
    accent: 'from-[#006878] to-[#e06d53]',
    previewChip: { icon: 'view_in_ar', text: 'STL Listo' },
    action: { icon: 'photo_camera', label: 'Actualizar Estado / Subir Avance' },
    trackDeadline: true,
  },
  asignado: {
    label: 'Asignado • Por Iniciar',
    badge: { className: 'bg-[#ffddaf] text-[#281800]', icon: 'hourglass_top' },
    quotationBadge: 'bg-[#ffddaf] text-[#281800]',
    accent: 'from-[#ffddaf] to-[#be543c]',
    previewChip: { icon: 'extension', text: 'Slicing Pendiente' },
    action: { icon: 'play_arrow', label: 'Iniciar Fabricación' },
    trackDeadline: true,
  },
  listo_despacho: {
    label: 'Listo para Despacho',
    badge: { className: 'bg-[#e6f4f2] text-[#006878]', icon: 'inventory_2' },
    quotationBadge: 'bg-[#e6f4f2] text-[#006878]',
    accent: 'from-[#006878] to-[#9cecff]',
    previewChip: { icon: 'check_circle', text: 'Pieza Terminada' },
    action: { icon: 'local_shipping', label: 'Marcar como Despachado' },
    trackDeadline: true,
  },
  en_transito: {
    label: 'En Tránsito',
    badge: { className: 'bg-[#dbeafe] text-[#1e40af]', icon: 'local_shipping' },
    quotationBadge: 'bg-[#dbeafe] text-[#1e40af]',
    accent: 'from-[#4a8ec9] to-[#9cecff]',
    previewChip: { icon: 'local_shipping', text: 'En camino' },
    action: { icon: 'visibility', label: 'Ver Seguimiento' },
    trackDeadline: false,
  },
  finalizado: {
    label: 'Finalizado • Cobrado',
    badge: { className: 'bg-[#dcfce7] text-[#15803d]', icon: 'task_alt' },
    quotationBadge: 'bg-[#dcfce7] text-[#15803d]',
    accent: 'from-[#16a34a] to-[#bbf7d0]',
    previewChip: { icon: 'verified', text: 'Completado' },
    action: { icon: 'visibility', label: 'Ver Detalle' },
    trackDeadline: false,
  },
}

// Para valores de `estado` desconocidos
export const JOB_STATUS_FALLBACK = {
  label: '',
  badge: { className: 'bg-[#f4ebe1] text-[#78716c]' },
  quotationBadge: 'bg-[#f4ebe1] text-[#78716c]',
  accent: 'from-[#d6c4b2] to-[#ebdccb]',
  previewChip: { icon: 'view_in_ar', text: 'STL' },
  action: { icon: 'visibility', label: 'Ver Detalle' },
  trackDeadline: false,
}
