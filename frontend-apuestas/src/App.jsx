import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import UsuarioHome from './pages/UsuarioHome';
import CrearCompeticion from './pages/CrearCompeticion';
import GestionCompeticion from "./pages/GestionCompeticion";
import CrearPartido from "./pages/CrearPartido";
import CrearEquipo from "./pages/CrearEquipo";
import AñadirUsuarios from "./pages/AñadirUsuarios";
import AdminVerPronosticos from './pages/AdminVerPronosticos';
import Clasificacion from './pages/Clasificacion';
import TablonAnuncios from './pages/TablonAnuncios';
import ConfiguracionCompeticion from "./pages/ConfiguracionCompeticion";
import UsuarioCompeticion from "./pages/UsuarioCompeticion";
import UsuarioClasificacion from './pages/UsuarioClasificacion';
import UsuarioPronosticos from './pages/UsuarioPronosticos';
import UsuarioVerPronosticos from './pages/UsuarioVerPronosticos';
import PerfilAdministrador from './pages/PerfilAdministrador';
import PerfilUsuario from './pages/PerfilUsuario';
import UsuarioReglas from './pages/UsuarioReglas';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));

  // Actualiza el token y el rol cada vez que se modifiquen en localStorage
  useEffect(() => {
    const actualizarEstadoDesdeLocalStorage = () => {
      setToken(localStorage.getItem('token'));
      setRol(localStorage.getItem('rol'));
    };

    // Escucha cambios directos en el storage (desde otras pestañas)
    window.addEventListener('storage', actualizarEstadoDesdeLocalStorage);

    // Escucha cambios locales también (por ejemplo, tras login)
    const intervalo = setInterval(actualizarEstadoDesdeLocalStorage, 500);

    return () => {
      window.removeEventListener('storage', actualizarEstadoDesdeLocalStorage);
      clearInterval(intervalo);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={token && rol === 'admin' ? <AdminHome /> : <Navigate to="/login" />}
      />

      <Route
        path="/usuario"
        element={token && rol === 'user' ? <UsuarioHome /> : <Navigate to="/login" />}
      />

      <Route
        path="/crear-competicion"
        element={token && rol === 'admin' ? <CrearCompeticion /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/competicion/:id"
        element={token && rol === "admin" ? <GestionCompeticion /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/perfil"
        element={token && rol === 'admin' ? <PerfilAdministrador /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/competicion/:id/crear-partido"
        element={token && rol === "admin" ? <CrearPartido /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/crear-equipo"
        element={token && rol === "admin" ? <CrearEquipo /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/competicion/:id/añadir-usuarios"
        element={token && rol === "admin" ? <AñadirUsuarios /> : <Navigate to="/login" />}
      />

      <Route
        path="/admin/competicion/:id/pronosticos"
        element={<AdminVerPronosticos />}
      />


      <Route
        path="/admin/competicion/:id/clasificacion"
        element={<Clasificacion />}
      />

      <Route
        path="/admin/competicion/:id/anuncios"
        element={<TablonAnuncios />}
      />

      <Route
        path="/admin/competicion/:id/configuracion"
        element={token && rol === 'admin' ? <ConfiguracionCompeticion /> : <Navigate to="/login" />}
      />

      <Route path="/usuario/competicion/:id" element={<UsuarioCompeticion />} />

      <Route path="/usuario/competicion/:id/clasificacion" element={<UsuarioClasificacion />} />

      <Route
        path="/usuario/competicion/:id/pronosticar"
        element={<UsuarioPronosticos />}
      />

      <Route
        path="/usuario/perfil"
        element={token && rol === 'user' ? <PerfilUsuario /> : <Navigate to="/login" />}
      />

      <Route
        path="/usuario/competicion/:id/ver-pronosticos"
        element={<UsuarioVerPronosticos />}
      />

      <Route
        path="/usuario/competicion/:id/reglas"
        element={token && rol === "user" ? <UsuarioReglas /> : <Navigate to="/login" />}
      />


      <Route
        path="/"
        element={
          token
            ? rol === 'admin'
              ? <Navigate to="/admin" />
              : <Navigate to="/usuario" />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;



