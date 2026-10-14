import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/home/pages/Home";
import BenchyWidget from "./components/common/BenchyWidget";
import Registro from "./features/home/components/Registro";
import LoginPage from "./features/home/pages/LoginPage";
import RutaProtegida from "./features/auth/RutaProtegida";
import {
  ClienteDashboard,
  MakerDashboard,
  AdminDashboard,
} from "./features/dashboard/Dashboards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <BenchyWidget />
            </>
          }
        />

        <Route path="/Login" element={<LoginPage />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/cliente"
          element={
            <RutaProtegida rol="cliente">
              <ClienteDashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/maker"
          element={
            <RutaProtegida rol="maker">
              <MakerDashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="admin">
              <AdminDashboard />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}