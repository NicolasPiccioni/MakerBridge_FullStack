// Todo lo que NO viene de la base de datos.

export const ORDER_DEFAULTS = {
  accentClass: 'bg-[#e06d53]',
  statusStyle: {
    className: 'text-[#006878] bg-[#e6f4f2] font-semibold',
    dotClass: 'bg-[#006878]',
  },
  // Etiqueta visible según el valor de `estado`. Si llega uno que no está acá, se muestra tal cual.
  //aun no se los estados
  statusLabels: {
    abierto: 'Abierto a Cotizaciones',
  },
  client: { name: 'Nombre de usuario', verified: false },
  file: { icon: 'check_circle', iconClass: 'text-[#006878]', label: 'STL Manifold OK (32.4 MB)' },
  deadlineIcon: 'event',
  image: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIFg04PXFB1-M8XyGedCe2EJJQIz0oMzSImW63WqMiyHs3J40JwLo-g5v8F1Bspvnjl7JdGMcU3IvM1oI94X-fZIPq-REGggZrmRS527X05SibSPOOCyoul-m5zh-Rka7jZr48OjU058GN26CRFHepaY1e-7rL_BpTahFT7w3Cf3y-o9tyBhzjOXoQrLK92X5efZ9KssvyO9Qp8DiRne5GksunedkY7kfEBIYNNsOiL1Y2N-SCWqY1',
    alt: 'CAD 3D helical gear render',
    tag: '3D Ortho',
  },
  footerInfo: { variant: 'service', text: 'Impresión' },
  primaryAction: 'Postularse / Cotizar',
}
