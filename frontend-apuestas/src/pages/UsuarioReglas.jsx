import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";

function UsuarioReglas() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [competicion, setCompeticion] = useState(null);

  useEffect(() => {
    const fetchCompeticion = async () => {
      const res = await fetch(`${API_URL}/api/competiciones/${competicionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompeticion(data);
      }
    };
    fetchCompeticion();
  }, [competicionId, token]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <span className="font-semibold" onClick={() => navigate("/usuario/perfil")}>{localStorage.getItem("nombreUsuario")}</span>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-center">{competicion?.nombre || "..."}</h1>
        </div>
        <button
          onClick={() => navigate(`/usuario/competicion/${competicionId}`)}
          className="bg-white text-green-700 font-medium px-3 py-1 rounded hover:bg-gray-200"
        >
          Volver
        </button>
      </header>

      <main className="flex-grow px-6 py-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reglas del Juego</h2>

        {competicion ? (
          <div className="bg-white p-6 rounded shadow text-gray-700 space-y-4">
            <p>
              En esta competición, los usuarios deben predecir el resultado de cada partido antes de que comience.
              Una vez jugado el partido, se otorgarán puntos en función del acierto.
            </p>

            <ul className="list-disc list-inside">
              <li>
                <strong>{competicion.puntosPorResultadoExacto}</strong> puntos por acertar el resultado exacto.
              </li>
              <li>
                <strong>{competicion.puntosPorAciertoSimple}</strong> puntos por acertar solo el ganador (o empate).
              </li>
            </ul>

            <p>
              ¡Recuerda hacer tus pronósticos antes de que empiece el partido! Una vez iniciado, ya no podrás cambiarlos.
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Cargando reglas...</p>
        )}
      </main>

      <footer className="bg-green-700 text-white py-3 text-center">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioReglas;
