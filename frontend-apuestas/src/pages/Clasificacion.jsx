import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Clasificacion() {
  const { id: competicionId } = useParams();
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchClasificacion = async () => {
    try {
      const resClasif = await fetch(
        `http://localhost:8080/api/apuestas/clasificacion/${competicionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const clasifData = await resClasif.json();

      const resParticipantes = await fetch(
        `http://localhost:8080/api/competiciones/${competicionId}/participantes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const participantesData = await resParticipantes.json();

      const puntosMap = new Map(clasifData.map((u) => [u.id, u.puntos]));

      const combinada = participantesData.map((usuario) => ({
        id: usuario.id,
        nombreUsuario: usuario.nombreYapellidos,
        puntos: puntosMap.get(usuario.id) || 0,
      }));

      combinada.sort((a, b) => b.puntos - a.puntos);
      setClasificacion(combinada);
    } catch (err) {
      console.error("Error al cargar la clasificación", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchClasificacion();
  }, [competicionId]);

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
          <span className="text-green-700">
            {localStorage.getItem("nombreUsuario")}
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Clasificación
        </h2>

        {cargando ? (
          <p className="text-center text-gray-600">Cargando clasificación...</p>
        ) : clasificacion.length === 0 ? (
          <p className="text-center text-gray-600">
            Aún no hay participantes en esta competición.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Puntos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {clasificacion.map((usuario, index) => {
                  const posicion = index + 1;
                  const medalla =
                    posicion === 1
                      ? "🥇"
                      : posicion === 2
                      ? "🥈"
                      : posicion === 3
                      ? "🥉"
                      : null;

                  const filaColor =
                    posicion === 1
                      ? "bg-yellow-50"
                      : posicion === 2
                      ? "bg-gray-100"
                      : posicion === 3
                      ? "bg-orange-50"
                      : "";

                  return (
                    <tr
                      key={usuario.id}
                      className={`hover:bg-gray-50 transition ${filaColor}`}
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {medalla || posicion}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {usuario.nombreUsuario}
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-green-700">
                        {usuario.puntos}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => navigate(`/admin/competicion/${competicionId}`)}
          className="mt-10 text-green-700 underline hover:text-green-800 block mx-auto"
        >
          ← Volver al menú de gestión de competición
        </button>
      </main>
    </div>
  );
}

export default Clasificacion;
