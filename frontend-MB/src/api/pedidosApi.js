// Punto único por el que el front le pide pedidos al "back".
// Las vistas importan SIEMPRE de este archivo, nunca del mock ni del http.
//
// Punto único por el que el front le pide pedidos al "back".
export { getPedidos, getPedido, crearCotizacion, getTrabajos, avanzarTrabajo } from './pedidosHttp'