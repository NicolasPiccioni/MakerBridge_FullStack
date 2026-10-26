import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Registro from "../components/Registro";
import { API_URL } from "../../../api/config";

const RUTA_POR_ROL = {
  cliente: "/cliente",
  maker: "/maker",
  admin: "/admin",
};

export default function RegistroPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorCampo, setErrorCampo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegistro = async ({ nombre, email, password, rol }) => {
    setError("");
    setErrorCampo(null);

    // Chequeo rápido antes de molestar al servidor
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("La contraseña debe tener letras y números");
      setErrorCampo("password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo crear la cuenta");
        setErrorCampo(data.campo ?? null);
        return;
      }

      // El registro devuelve el token: el usuario queda logueado
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate(RUTA_POR_ROL[data.usuario.rol] ?? "/", { replace: true });
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Registro
      onSubmit={handleRegistro}
      error={error}
      errorCampo={errorCampo}
      loading={loading}
    />
  );
}