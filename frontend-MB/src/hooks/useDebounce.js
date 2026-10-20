import { useEffect, useState } from 'react'

// Devuelve `value` pero con retraso: solo se actualiza cuando pasaron `delay` ms
// sin que el valor original cambie. Sirve para no pedirle datos al back
// en cada tecla que el usuario escribe en el buscador.
export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id) // si el valor cambia antes, cancelamos el timer anterior
  }, [value, delay])

  return debounced
}
