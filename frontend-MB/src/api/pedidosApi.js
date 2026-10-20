// Punto único por el que el front le pide pedidos al "back".
// Las vistas importan SIEMPRE de este archivo, nunca del mock ni del http.
//
// Hoy usa los datos de prueba:
export { getPedidos } from './pedidosMock'

// Cuando la API de Django esté lista:
//   1. Comentá la línea de arriba.
//   2. Descomentá la de abajo.
//   3. Hacé `npm install axios` y configurá VITE_API_URL (ver pedidosHttp.js).
//
// export { getPedidos } from './pedidosHttp'
