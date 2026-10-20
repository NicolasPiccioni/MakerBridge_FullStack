import './NuevaSolicitud'
import SubirPedido from '../Componentes/SubirPedido'
import Header from '../layout/Header'



function NuevaSolicitud() {
    return(
        <>
            <Header 
            title='Nueva'
            accent='solicitud'
            description='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui quas voluptate velit inventore saepe! Enim maiores doloribus omnis natus commodi eius libero veniam. Eaque dolore minima dolorum quibusdam officiis nobis.'/>
            
            <SubirPedido />
        </>
    )
}

export default NuevaSolicitud