import { useEffect, useState } from 'react'
import './Productos.css'
import * as servicioProductos from '../API/servicioProductos'
import TarjetaSolicitud from '../Componentes/TarjetaSolicitud'

export function Productos({ titulo, idUsuario }) {
  const [productos, setProductos] = useState([])
  // const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true // evita actualizar el estado si el componente ya se desmontó

    async function pedir() {
      try {
        const datos = await servicioProductos.obtener(idUsuario)
        console.log(datos)
        if (activo) setProductos(datos)
      } catch (e) {
        console.error('Error al cargar productos', e)
        if (activo) setError('No pudimos cargar tus solicitudes. Intentá de nuevo en unos minutos.')
      } /* finally {
        // if (activo) setCargando(false)
      } */
    }

    pedir()
    return () => { activo = false }
  }, [idUsuario])

  // Más recientes primero
  const ordenados = [...productos].sort((a, b) => b.fechaCreacion - a.fechaCreacion)

  return (
    <section className="flex w-full min-w-0 flex-1 flex-col gap-6">
      {titulo && <h2 className="text-xl font-bold text-brand-charcoal">{titulo}</h2>}

      {/* {cargando && <p className="text-sm text-brand-muted">Cargando solicitudes…</p>} */}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {/* !cargando &&  */!error && ordenados.length === 0 && (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-brand-muted">
          Todavía no tenés solicitudes.
        </p>
      )}

      {ordenados.map((p) => (
        <TarjetaSolicitud key={p.id} producto={p} /* onVerDetalle={(producto) => ...} */ />
      ))}
    </section>
  )
}


/* 
const productos = servicioProductos.obtener()
console.log(productos)

export function Productos(props) {
    const { titulo } = props
    const [ productos, setProductos ] = useState([])


    useEffect(() => {
        console.log('Api productos montado')

        async function pedir() {
            try {
                const productos = await servicioProductos.obtener()
                console.log(productos)
                setProductos(productos)
            } catch (error) {
                console.error('Error al cargar productos', error)
            }
        }

        pedir()

        return () => console.log('Api Productos desmontado')
    }, [])


    return(
        <div className='body'>



        </div>
            
    )
} */