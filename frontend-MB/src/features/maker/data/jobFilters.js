// Opciones de los filtros. Los contadores son los del diseño: reemplazalos
// por los que devuelva tu API cuando la conectes.
export const STATUS_FILTERS = [
  { id: 'en_proceso', label: 'En Proceso / Imprimiendo', count: 1, activeBadge: 'bg-[#e06d53]/10 text-[#e06d53]' },
  { id: 'asignado', label: 'Asignado / Por Iniciar', count: 1, activeBadge: 'bg-[#ffddaf] text-[#281800]' },
  { id: 'listo_despacho', label: 'Listo para Despacho', count: 0, activeBadge: 'bg-[#e06d53]/10 text-[#e06d53]' },
  { id: 'en_transito', label: 'En Tránsito / Entregado', count: 8, activeBadge: 'bg-[#e06d53]/10 text-[#e06d53]' },
  { id: 'finalizado', label: 'Finalizados / Cobrados', count: 34, activeBadge: 'bg-[#e06d53]/10 text-[#e06d53]' },
]

export const MATERIAL_FILTERS = [
  { id: 'nylon', label: 'Nylon PA12 / Resina Tough', count: 1 },
  { id: 'petg', label: 'PETG Técnico', count: 1 },
  { id: 'pla', label: 'PLA / PLA+ de Precisión', count: 0 },
  { id: 'tpu', label: 'TPU 95A Flexible', count: 0 },
  { id: 'carbono', label: 'Filamento Fibra de Carbono', count: 0 },
]

export const DEFAULT_STATUSES = ['en_proceso', 'asignado']
export const DEFAULT_MATERIALS = ['nylon', 'petg']
