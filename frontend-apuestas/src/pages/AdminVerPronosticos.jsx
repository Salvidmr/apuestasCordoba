import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ArrowLeft } from "lucide-react";

function AdminVerPronosticos() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const calcularPuntos = (a) => {
    const partido = a.partido;
    if (
      !partido ||
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <span className="text-sm text-gray-700 font-semibold">
          Admin: <span className="text-green-700">{localStorage.getItem("nombreUsuario")}</span>
        </span>
      </header>

      <main className="p-6 max-w-3xl mx-auto w-full flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Pronósticos de la competición
        </h2>

        <div className="mb-4">
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

        <div className="mb-6 text-center">
          <button
            onClick={() => navigate(`/admin/competicion/${competicionId}`)}
            className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver a la gestión
          </button>
        </div>

        {partidoSeleccionado && apuestas.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            Aún no hay pronósticos para este partido.
          </p>
        ) : (
          <ul className="space-y-2">
            {apuestas.map((a) => (
              <li
                key={a.id}
                className="bg-white p-3 rounded shadow border flex justify-between items-center text-gray-800"
              >
                <span className="font-medium">{a.usuario.nombreYapellidos}</span>
                <span>
                  {a.golesLocal} - {a.golesVisitante}{" "}
                  <span className="text-sm text-gray-500 ml-1">{calcularPuntos(a)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default AdminVerPronosticos;
