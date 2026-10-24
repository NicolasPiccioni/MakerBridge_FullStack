import { useState } from 'react';
import ListaSolicitudes from '../Componentes/ListaSolicitudes'
import './MisSolicitudes.css'
import FiltersSidebar from '../Componentes/Filtros.jsx'
import Header from '../layout/Header'

function Solicitudes() {

  const [materials, setMaterials] = useState([]);
  const [location, setLocation] = useState("all");

  const onToggleMaterial = (id) =>
  setMaterials((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  const onClear = () => { setMaterials([]); setLocation("all"); };

  return (
        
        <>
        <Header 
        title='Mis'
        accent='solicitudes'
        description='En esta seccion vas a poder visualizar aquellos pedidos que estan en la espera de ser tomados por un maker. ¡Revisa las distintas cotizaciones que te ofrecen los miembros de nuestra comunidad!'/>
        <div className="flex [--color-brand-primary:#568ea6] items-start gap-6 lg:flex-row  flex-col ">
        
          <FiltersSidebar
                    materials={materials}
                    location={location}
                    onToggleMaterial={onToggleMaterial}
                    onChangeLocation={setLocation}
                    onClear={onClear}
                  />
          <div className='flex min-w-0 flex-1 flex-col gap-6' >
            <ListaSolicitudes
              key={`${materials.join(',')}|${location}`}
              materials={materials}
              location={location}
            />
          </div>
          
        </div>
        </>
  )
}

export default Solicitudes