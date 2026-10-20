import OrderCard from '../../maker/components/OrderCard'
import './TarjetaSolicitud.css'


const aFecha = (v) => {
  if (!v) return ''
  // Las fechas de la API llegan como timestamp en segundos
  const d = new Date(typeof v === 'number' ? v * 1000 : v)
  return isNaN(d) ? '' : d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ESTADOS = {
  pendiente: { label: 'Pendiente', acento: 'bg-amber-400', badge: 'bg-amber-50 text-amber-800', punto: 'bg-amber-500 animate-pulse' },
  finalizado: { label: 'Finalizado', acento: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800', punto: 'bg-emerald-500' },
}

/* Registro de MockAPI -> objeto `order` que ya espera OrderCard.
   Es el único lugar que conoce los campos de la API: si cambian, se ajusta acá. */
const aOrder = (p) => {
  const estado = p.estado ? ESTADOS.finalizado : ESTADOS.pendiente

  return {
    accentClass: estado.acento,
    code: `#${p.idPedido}`,
    publishedAgo: `Solicitado el ${aFecha(p.fechaCreacion)}`,
    status: { className: estado.badge, dotClass: estado.punto, label: estado.label },
    // La API no trae nombre de producto: si agregan `nombre`, se usa solo
    title: p.nombre ?? `Pedido de ${p.cantidad} ${Number(p.cantidad) === 1 ? 'unidad' : 'unidades'}`,
    client: { verified: false, name: `Cliente #${p.idUsuario}` },
    location: p.localidad ?? 'Ubicación no informada', // la API todavía no tiene este dato
    file: { icon: 'attach_file', iconClass: 'text-brand-primary', label: 'Archivo adjunto' },
    specs: [
      { label: 'CANTIDAD', value: p.cantidad },
      { label: 'MATERIAL', value: p.material },
      { label: 'COLOR/ACABADO', value: p.color },
      
    ].filter((s) => s.value !== '' && s.value != null),
    deadline: { icon: 'event', date: aFecha(p.fechaLimite) },
    image: { src: p.archivoUrl, alt: `Pedido ${p.idPedido}`, tag: 'Archivo' },
    description: p.descripcion ?? '',
    footerInfo: { variant: 'info', text: p.archivoUrl ? 'Archivo adjunto disponible' : 'Sin archivo adjunto' },
    primaryAction: 'Ver detalle',
  }
}


/* Usa OrderCard TAL CUAL. OrderCard tiene un único botón y no expone onClick,
   así que el click se captura en el contenedor (delegación de eventos). */
export default function TarjetaSolicitud({ producto, onVerDetalle }) {
  return (
    
      <div onClick={(e) => e.target.closest('button') && onVerDetalle?.(producto)}>
        <OrderCard order={aOrder(producto)} />
      </div>
  )
}
/* export const Tarjeta = props => {
  return(
  )
} */

/* function TarjetaSolicitud() {

  return(

          <div className='Solicitudes' >
            <div className='pedidos'> */
            {/* Comienzo tarjeta */}
{/*               <div className="overflow-hidden rounded-xl bg-white shadow-md w-full ">
                <div className="md:flex flex flex-col ">
                  <div className="md:shrink-0">
                    <img
                      className="h-48 w-full object-cover md:h-full md:w-48"
                      src="https://images.cults3d.com/lyn9McKVza9MhZRu6QL3uOCqBJs=/246x246/filters:no_upscale():format(webp)/https://fbi.cults3d.com/uploaders/27702084/illustration-file/d3e29006-0263-4627-837d-85bcbe03b313/Travel-Mug-Holding-1x1.jpg"
                      alt="Modern building architecture"
                    />
                  </div>
                  <div className="p-8">
                    <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">Portavasos para latas de viaje</div>
                    <a href="#" className="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptates distinctio deleniti rem eaque, in qui tempora, nostrum numquam cupiditate voluptatem maiores enim tempore incidunt ullam quo, animi aliquam nam.
                    </a>
                    <p className="mt-2 text-gray-500" />
                  </div>
                </div>
              </div>
               */}
              
              
              {/* <OrderCard /> */}

              {/* <button className="btn-primary">Consultas</button> */}
        {/*     </div>
          </div>
          
      )

      }

      export default TarjetaSolicitud */}
