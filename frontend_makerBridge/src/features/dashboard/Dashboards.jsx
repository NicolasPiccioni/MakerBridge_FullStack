import { useNavigate } from "react-router-dom";

function Dashboard({ titulo }) {
  const navigate = useNavigate();

  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch {
    usuario = null;
  }

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/Login", { replace: true });
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>{titulo}</h1>
      <p>Hola, {usuario?.nombre}</p>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </main>
  );
}

export const ClienteDashboard = () => <Dashboard titulo="Dashboard de Cliente" />;
export const MakerDashboard = () => <Dashboard titulo="Dashboard de Maker" />;
export const AdminDashboard = () => <Dashboard titulo="Dashboard de Admin" />;