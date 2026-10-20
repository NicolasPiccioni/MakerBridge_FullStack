import { RouterProvider } from 'react-router-dom'
import router from './router'

export default function App() {
  return <RouterProvider router={router} />
}

/* export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MakerbridgeLanding />} />
        <Route path="/perfil" element={<PerfilPrivado />} />
        <Route path="*" element={<MakerbridgeLanding />} />
      </Routes>
    </BrowserRouter>
  );
} */
