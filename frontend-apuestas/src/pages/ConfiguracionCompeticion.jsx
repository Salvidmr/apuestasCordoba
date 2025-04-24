import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Info } from "lucide-react";

function ConfiguracionCompeticion() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [puntosExacto, setPuntosExacto] = useState(3);
  const [puntosSimple, setPuntosSimple] = useState(1);

  const fetchConfiguracion = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/competiciones/${competicionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPuntosExacto(data.puntosPorResultadoExacto);
        setPuntosSimple(data.puntosPorAciertoSimple);
      }
    } catch (err) {
      console.error("Error al cargar configuración", err);
    }
  };

  const guardarConfiguracion = async () => {
    if (puntosExacto < 0 || puntosSimple < 0) {
      alert("Los puntos no pueden ser negativos.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/competiciones/actualizar/${competicionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            puntosPorResultadoExacto: parseInt(puntosExacto),
            puntosPorAciertoSimple: parseInt(puntosSimple),
          }),
        }
      );
      if (res.ok) alert("Configuración actualizada correctamente.");
    } catch (err) {
      console.error("Error al guardar configuración", err);
    }
  };

  useEffect(() => {
    fetchConfiguracion();
  }, [competicionId, token]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <div className="text-sm text-gray-700 font-semibold">
          Admin:{" "}
          <span className="text-green-700">{localStorage.getItem("nombreUsuario")}</span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Configuración de Puntuación</h2>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acierto exacto puntúa
              <span className="ml-1 group relative inline-block">
                <Info size={16} className="text-gray-500" />
                <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 w-48 z-10 mt-1 left-1/2 -translate-x-1/2">
                  Se considera acierto exacto cuando se predice el resultado exacto del partido.
                </div>
              </span>
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={puntosExacto}
              onChange={(e) => setPuntosExacto(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acierto simple puntúa
              <span className="ml-1 group relative inline-block">
                <Info size={16} className="text-gray-500" />
                <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 w-48 z-10 mt-1 left-1/2 -translate-x-1/2">
                  Acierto simple es acertar el equipo ganador sin acertar los goles.
                </div>
              </span>
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={puntosSimple}
              onChange={(e) => setPuntosSimple(e.target.value)}
            />
          </div>

          <button
            onClick={guardarConfiguracion}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
          >
            Guardar configuración
          </button>

          <button
            onClick={() => navigate(`/admin/competicion/${competicionId}`)}
            className="mt-4 text-green-700 underline hover:text-green-800 text-sm"
          >
            ← Volver al menú de gestión
          </button>
        </div>
      </main>
    </div>
  );
}

export default ConfiguracionCompeticion;
