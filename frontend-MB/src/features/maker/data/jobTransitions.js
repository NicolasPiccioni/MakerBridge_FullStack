// Estado al que pasa un trabajo cuando el maker toca el botón de la tarjeta.
// Tiene que coincidir con SIGUIENTE_ESTADO del backend (maker/consultas.py).
export const SIGUIENTE_ESTADO = {
  asignado: 'en_proceso',
  en_proceso: 'listo_despacho',
  listo_despacho: 'en_transito',
}