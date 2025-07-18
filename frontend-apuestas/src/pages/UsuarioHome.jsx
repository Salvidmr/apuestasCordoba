import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import patrocinadores from "../assets/patrocinadores.jpeg";

function UsuarioHome() {
  const [competiciones, setCompeticiones] = useState([]);
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("id");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMisCompeticiones = async () => {
    const res = await fetch(`${API_URL}/api/competiciones/mis-competiciones/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setCompeticiones(data);
    } else {
      const errorText = await res.text();
      console.error("Error del servidor al obtener competiciones:", errorText);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const estaFinalizada = (fechaFin) => new Date(fechaFin) < new Date();

  useEffect(() => {
    fetchMisCompeticiones();
  }, [usuarioId, token]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/usuario/perfil")}>
          <div className="bg-white text-green-700 font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg shadow">
            {nombreUsuario?.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-semibold underline hover:text-gray-100">
            {nombreUsuario}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold hidden sm:block">Arcanfield Road</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-4">Mis Competiciones</h2>

        {competiciones.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {competiciones.map((comp) => (
              <li
                key={comp.id}
                className="bg-white shadow rounded p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/usuario/competicion/${comp.id}`)}
              >
                <span className="font-semibold text-green-700 flex items-center gap-2">
                  {comp.nombre}
                  {estaFinalizada(comp.fechaFin) && (
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                      FINALIZADA
                    </span>
                  )}
                </span>
                {comp.descripcion && <p className="text-sm text-gray-600 mt-1">{comp.descripcion}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No estás participando en ninguna competición.</p>
        )}
      </main>

      <section className="container mx-auto px-6 py-8 text-center">
        <h3 className="text-lg font-semibold mb-4 text-green-700">Patrocinadores Arcanfield Road</h3>
        <img
          src={patrocinadores}
          alt="Patrocinadores Arcanfield Road"
          className="mx-auto rounded shadow-lg w-full max-w-md h-auto"
        />
      </section>


      {/* Footer */}
      <footer className="bg-green-700 text-white py-3 text-center">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioHome;
