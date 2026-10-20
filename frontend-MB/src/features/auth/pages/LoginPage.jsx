/* import Login from '../components/Login'

export default function LoginPage() {
  return (
    <>
      <Login/>
    </>
  )
}
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

const API_URL = "http://127.0.0.1:8000/api";

const RUTA_POR_ROL = {
  cliente: "/cliente",
  maker: "/maker",
  admin: "/admin",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate(RUTA_POR_ROL[data.usuario.rol] ?? "/", { replace: true });
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return <Login onSubmit={handleLogin} error={error} loading={loading} />;
}