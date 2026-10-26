import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../../../api/config";

const RUTA_POR_ROL = {
  cliente: "/cliente",
  maker: "/maker",
  admin: "/admin",
};

export default function RutaProtegida({ rol, children }) {
  // "cargando" | "ok" | "sin_sesion"
  const [estado, setEstado] = useState("cargando");
  const [rolReal, setRolReal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEstado("sin_sesion");
      return;
    }

    let cancelado = false;

    fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (cancelado) return;

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
          }
          setEstado("sin_sesion");
          return;
        }

        const data = await res.json();
        setRolReal(data.usuario.rol);
        setEstado("ok");
      })
      .catch(() => {
        if (!cancelado) setEstado("sin_sesion");
      });

    return () => {
      cancelado = true;
    };
  }, []);

  if (estado === "cargando") return <p style={{ padding: 32 }}>Cargando...</p>;
  if (estado === "sin_sesion") return <Navigate to="/login" replace />;

  // Si el rol real (el que dice el servidor) no coincide, lo mandamos a SU dashboard
const permitidos = Array.isArray(rol) ? rol : [rol]
if (!permitidos.includes(rolReal)) {
  return <Navigate to={RUTA_POR_ROL[rolReal] ?? "/"} replace />
  }

  return children;
}