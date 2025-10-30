import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function UsuarioVerPronosticos() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("id");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const API_URL = import.meta.env.VITE_API_URL;
  const [competicion, setCompeticion] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [apuestas, setApuestas] = useState([]);

  const fetchCompeticion = async () => {
    const res = await fetch(`${API_URL}/api/competiciones/${competicionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCompeticion(data);
    }
  };

  const fetchPartidos = async () => {
    const res = await fetch(`${API_URL}/api/partidos/competicion/${competicionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      // 🔽 Ordenamos los partidos del más nuevo al más antiguo
      const partidosOrdenados = data.sort(
        (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)
      );
      setPartidos(partidosOrdenados);
    }
  };

  const fetchApuestas = async (partidoId) => {
    const res = await fetch(`${API_URL}/api/apuestas/partido/${partidoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setApuestas(data);
    }
  };

  const togglePronosticos = (partido) => {
    if (partidoSeleccionado?.id === partido.id) {
      // Si ya está abierto, lo cerramos
      setPartidoSeleccionado(null);
      setApuestas([]);
    } else {
      // Abrimos y cargamos apuestas
      setPartidoSeleccionado(partido);
      fetchApuestas(partido.id);
    }
  };

  const calcularPuntos = (a) => {
    const partido = a.partido;
    if (
      partido.golesLocal == null ||
      partido.golesVisitante == null ||
      a.golesLocal == null ||
      a.golesVisitante == null
    ) {
      return null;
    }

    const exacto =
      a.golesLocal === partido.golesLocal &&
      a.golesVisitante === partido.golesVisitante;

    const resultado = (l, v) => {
      if (l > v) return "L";
      if (l < v) return "V";
      return "E";
    };

    const aciertoSimple =
      !exacto &&
      resultado(a.golesLocal, a.golesVisitante) ===
        resultado(partido.golesLocal, partido.golesVisitante);

    if (exacto) return `+${competicion.puntosPorResultadoExacto}`;
    if (aciertoSimple) return `+${competicion.puntosPorAciertoSimple}`;
    return "+0";
  };

  useEffect(() => {
    fetchCompeticion();
    fetchPartidos();
  }, [competicionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-center">
          {competicion?.nombre || "..."}
        </h1>
        <span
          className="text-sm font-semibold cursor-pointer"
          onClick={() => navigate("/usuario/perfil")}
        >
          {nombreUsuario}
        </span>
      </header>

      <nav className="bg-green-200 shadow flex divide-x divide-green-300">
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
            className="flex-1 py-3 text-center text-green-900 font-semibold hover:bg-green-300 transition"
          >
            {opcion.label}
          </button>
        ))}
      </nav>

      <div className="bg-white px-6 py-3 text-center shadow">
        <button
          onClick={() => navigate("/usuario")}
          className="text-green-700 underline font-medium hover:text-green-800"
        >
          ← Volver a la página principal
        </button>
      </div>

      <main className="flex-grow px-4 sm:px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
          Ver Pronósticos
        </h2>

        {partidos.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            No hay partidos disponibles.
          </p>
        ) : (
          <div className="space-y-6">
            {partidos.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 sm:p-6 rounded-xl border border-green-500 shadow"
              >
                {/* Cabecera del partido */}
                <div className="grid grid-cols-3 items-center text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src={p.equipoLocal.escudoUrl}
                      alt="local"
                      className="h-14 w-14 sm:h-20 sm:w-20"
                    />
                    <span className="text-sm sm:text-base font-medium mt-1">
                      {p.equipoLocal.nombre}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => togglePronosticos(p)}
                      className={`px-4 py-2 rounded text-sm font-semibold ${
                        partidoSeleccionado?.id === p.id
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {partidoSeleccionado?.id === p.id
                        ? "Ocultar pronósticos"
                        : "Ver pronósticos"}
                    </button>
                    <span className="text-xs text-gray-600 mt-1">
                      {new Date(p.fechaHora).toLocaleString("es-ES")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <img
                      src={p.equipoVisitante.escudoUrl}
                      alt="visitante"
                      className="h-14 w-14 sm:h-20 sm:w-20"
                    />
                    <span className="text-sm sm:text-base font-medium mt-1">
                      {p.equipoVisitante.nombre}
                    </span>
                  </div>
                </div>

                {/* Pronósticos desplegados */}
                {partidoSeleccionado?.id === p.id && (
                  <div className="mt-4 border-t pt-3">
                    {apuestas.length === 0 ? (
                      <p className="text-center text-gray-600 italic">
                        Nadie ha realizado pronósticos para este partido aún.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {apuestas.map((a) => (
                          <li
                            key={a.id}
                            className={`bg-gray-50 p-3 rounded border flex justify-between items-center ${
                              a.usuario.id === parseInt(usuarioId)
                                ? "font-bold text-green-700"
                                : "text-gray-800"
                            }`}
                          >
                            <span>{a.usuario.nombreYapellidos}</span>
                            <span>
                              {a.golesLocal} - {a.golesVisitante}{" "}
                              <span className="text-sm text-gray-500 ml-1">
                                {calcularPuntos(a)}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-green-700 text-white py-3 text-center mt-auto">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioVerPronosticos;
