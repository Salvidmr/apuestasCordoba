import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function UsuarioVerPronosticos() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("id");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const nombreYApellidos = localStorage.getItem("nombreYapellidos");

  const [competicion, setCompeticion] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [apuestas, setApuestas] = useState([]);

  const fetchCompeticion = async () => {
    const res = await fetch(`http://localhost:8080/api/competiciones/${competicionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCompeticion(data);
    }
  };

  const fetchPartidos = async () => {
    const res = await fetch(`http://localhost:8080/api/partidos/competicion/${competicionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setPartidos(data);
    }
  };

  const fetchApuestas = async (partidoId) => {
    const res = await fetch(`http://localhost:8080/api/apuestas/partido/${partidoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setApuestas(data);
    }
  };

  const handleSeleccionarPartido = (partido) => {
    setPartidoSeleccionado(partido);
    fetchApuestas(partido.id);
  };

  useEffect(() => {
    fetchCompeticion();
    fetchPartidos();
  }, [competicionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-center">{competicion?.nombre || "..."}</h1>
        <span className="text-sm font-semibold">{nombreUsuario}</span>
      </header>

      {/* Subheader */}
      <nav className="bg-yellow-400 shadow flex divide-x divide-yellow-600">
        {[
          { label: "Realizar Pronósticos", ruta: "pronosticar" },
          { label: "Clasificación", ruta: "clasificacion" },
          { label: "Ver Pronósticos", ruta: "ver-pronosticos" },
        ].map((opcion) => (
          <button
            key={opcion.ruta}
            onClick={() => navigate(`/usuario/competicion/${competicionId}/${opcion.ruta}`)}
            className="flex-1 py-3 text-center text-green-900 font-semibold hover:bg-yellow-300 transition"
          >
            {opcion.label}
          </button>
        ))}
      </nav>

      {/* Botón volver */}
      <div className="bg-white px-6 py-3 text-center shadow">
        <button
          onClick={() => navigate("/usuario")}
          className="text-green-700 underline font-medium hover:text-green-800"
        >
          ← Volver a la página principal
        </button>
      </div>

      {/* Contenido principal */}
      <main className="flex-grow px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Ver Pronósticos</h2>

        {/* Selector de partido */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona un partido:
          </label>
          <select
            value={partidoSeleccionado?.id || ""}
            onChange={(e) => {
              const partido = partidos.find((p) => p.id === parseInt(e.target.value));
              handleSeleccionarPartido(partido);
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Selecciona un partido --</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.equipoLocal.nombre} vs {p.equipoVisitante.nombre} ({new Date(p.fechaHora).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar apuestas */}
        {partidoSeleccionado && apuestas.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            Nadie ha realizado pronósticos para este partido aún.
          </p>
        ) : (
          <ul className="space-y-2">
            {apuestas.map((a) => (
              <li
                key={a.id}
                className={`bg-white p-3 rounded shadow border flex justify-between items-center ${
                  a.usuario.id === parseInt(usuarioId)
                    ? "font-bold text-green-700"
                    : "text-gray-800"
                }`}
              >
                <span>{a.usuario.nombreYapellidos}</span>
                <span>
                  {a.golesLocal} - {a.golesVisitante}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-3 text-center mt-auto">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioVerPronosticos;
