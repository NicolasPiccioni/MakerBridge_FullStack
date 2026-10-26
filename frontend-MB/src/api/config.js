// Dirección del backend. En producción viene de la variable VITE_API_URL (incluye el /api final).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'