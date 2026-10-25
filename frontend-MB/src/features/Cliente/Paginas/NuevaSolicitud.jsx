import './NuevaSolicitud.css'
import SubirPedido from '../Componentes/SubirPedido'
import Header from '../layout/Header'

function NuevaSolicitud() {
    return(
        <>
            <Header 
            title='Nueva'
            accent='solicitud'
            description='Contanos qué necesitás fabricar. Tu pedido les llega a los makers, que te envían sus cotizaciones para que elijas la que más te convenga.'/>
            
            <SubirPedido />
        </>
    )
}

export default NuevaSolicitud