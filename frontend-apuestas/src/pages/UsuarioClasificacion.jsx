import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function UsuarioClasificacion() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const nombreYapellidos = localStorage.getItem("nombreYapellidos");

  const [competicion, setCompeticion] = useState(null);
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchDatos = async () => {
    try {
      const [resComp, resClasif, resParticipantes] = await Promise.all([
        fetch(`http://localhost:8080/api/competiciones/${competicionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8080/api/apuestas/clasificacion/${competicionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8080/api/competiciones/${competicionId}/participantes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const compData = await resComp.json();
      const clasifData = await resClasif.json();
      const participantesData = await resParticipantes.json();

      setCompeticion(compData);

      const puntosMap = new Map(clasifData.map((u) => [u.id, u.puntos]));

      const completada = participantesData.map((usuario) => ({
        id: usuario.id,
        nombreUsuario: usuario.nombreYapellidos,
        puntos: puntosMap.get(usuario.id) || 0,
      }));

      completada.sort((a, b) => b.puntos - a.puntos);
      setClasificacion(completada);
    } catch (err) {
      console.error("Error al cargar la clasificación", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [competicionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-center">
          {competicion?.nombre || "..."}
        </h1>
        <span className="text-sm font-semibold">{nombreYapellidos}</span>
      </header>

      {/* Subheader dorado */}
      <nav className="bg-yellow-400 shadow flex divide-x divide-yellow-600">
        {[
          { label: "Realizar Pronósticos", ruta: "pronosticar" },
          { label: "Clasificación", ruta: "clasificacion" },
          { label: "Ver Pronósticos", ruta: "ver-pronosticos" },
        ].map((opcion) => (
          <button
            key={opcion.ruta}
            onClick={() =>
              navigate(`/usuario/competicion/${competicionId}/${opcion.ruta}`)
            }
            className="flex-1 py-3 text-center text-green-900 font-semibold hover:bg-yellow-300 transition"
          >
            {opcion.label}
          </button>
        ))}
      </nav>

      {/* Botón de volver */}
      <div className="bg-white px-6 py-3 text-center shadow">
        <button
          onClick={() => navigate("/usuario")}
          className="text-green-700 underline font-medium hover:text-green-800"
        >
          ← Volver a la página principal
        </button>
      </div>

      {/* Contenido principal */}
      <main className="flex-grow px-6 py-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Clasificación
        </h2>

        {cargando ? (
          <p className="text-center text-gray-600">Cargando clasificación...</p>
        ) : clasificacion.length === 0 ? (
          <p className="text-center text-gray-600">
            Aún no hay puntuaciones disponibles.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600 text-white text-sm">
                <tr>
                  <th className="px-6 py-3 text-left uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-right uppercase tracking-wider">
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

                  const esYo = usuario.nombreUsuario === nombreYapellidos;

                  return (
                    <tr
                      key={usuario.id}
                      className={`hover:bg-gray-50 transition ${filaColor} ${
                        esYo ? "bg-green-50 font-bold" : ""
                      }`}
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {medalla || posicion}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800">
                        {usuario.nombreUsuario}
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-green-700">
                        {usuario.puntos}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-3 text-center mt-auto">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioClasificacion;
