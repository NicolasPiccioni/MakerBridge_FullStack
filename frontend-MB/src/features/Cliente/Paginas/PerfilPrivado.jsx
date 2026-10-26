import { useEffect, useState } from 'react';
import DatosPersonales from '../Componentes/DatosPersonales.jsx';
import DatosUsuario from '../Componentes/DatosUsuarios.jsx';
import FotoDePerfil from '../Componentes/FotoDePerfil.jsx';
import './PerfilPrivado.css';
import Header from '../layout/Header.jsx';
import { getPerfil, guardarPerfil } from '../../../api/perfilApi';

const ROL = { cliente: 'Cliente', maker: 'Maker', admin: 'Administrador' };

// '2026-10-25' -> '25/10/2026'
const formatFecha = (iso) => iso.split('-').reverse().join('/');

function PerfilPrivado() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    getPerfil()
      .then((datos) => {
        if (!ignore) setPerfil(datos);
      })
      .catch(() => {
        if (!ignore) setError('No pudimos cargar tu perfil. Revisá tu conexión y recargá la página.');
      });
    return () => {
      ignore = true;
    };
  }, []);

  const guardar = async (cambios) => {
    const nuevo = await guardarPerfil(cambios);
    setPerfil(nuevo);

    // Las barras de navegación leen el nombre de la sesión guardada: la actualizamos
    try {
      const sesion = JSON.parse(localStorage.getItem('usuario')) ?? {};
      localStorage.setItem('usuario', JSON.stringify({ ...sesion, nombre: nuevo.nombre }));
      window.dispatchEvent(new Event('usuario-actualizado'));
    } catch {
      /* si la sesión guardada está dañada, no pasa nada */
    }
  };

  // Lo que muestran la foto y los datos del sistema.
  // "verificado" y "penalizaciones" son de adorno: todavía no hay nada que los calcule.
  const user = perfil && {
    id: perfil.codigo,
    nombre: perfil.nombre,
    tipo: ROL[perfil.rol] ?? perfil.rol,
    verificado: true,
    estado: perfil.estado,
    penalizaciones: 'Sin penalizaciones',
    rol: ROL[perfil.rol] ?? perfil.rol,
    fechaRegistro: formatFecha(perfil.fecha_registro),
  };

  return (
    <div className="perfil-privado-page">
      <Header
        title="Mi"
        accent="perfil"
        description="En esta seccion vas a poder modificar tus datos personales, no dudes en consultar tu duda con Benchy3D."
      />

      {error && (
        <p role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {!error && !perfil && <p className="py-10 text-center text-brand-dark-muted">Cargando tu perfil…</p>}

      {perfil && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.8fr)] lg:gap-8">
          <aside className="space-y-6" aria-label="Resumen de la cuenta">
            <FotoDePerfil user={user} />
            <DatosUsuario user={user} />
          </aside>

          <section aria-label="Información personal">
            <DatosPersonales perfil={perfil} onSave={guardar} />
          </section>
        </div>
      )}
    </div>
  );
}

export default PerfilPrivado;