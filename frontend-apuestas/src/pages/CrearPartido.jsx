import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { Trash2, Pencil } from "lucide-react";

function CrearPartido() {
  const { id: competicionId } = useParams();
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState("");
  const [equipoVisitante, setEquipoVisitante] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [resultados, setResultados] = useState({});
  const [editandoResultado, setEditandoResultado] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEquipos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/equipos/listar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEquipos(data);
    } catch (err) {
      console.error("Error al cargar equipos", err);
    }
  };

  const fetchPartidos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/partidos/competicion/${competicionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPartidos(data);
    } catch (err) {
      console.error("Error al cargar partidos", err);
    }
  };

  useEffect(() => {
    fetchEquipos();
    fetchPartidos();
  }, [competicionId, token]);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/api/partidos/crear/${competicionId}/${equipoLocal}/${equipoVisitante}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fechaHora }),
        }
      );
      if (res.ok) {
        setEquipoLocal("");
        setEquipoVisitante("");
        setFechaHora("");
        fetchPartidos();
      }
    } catch (err) {
      console.error("Error al crear partido", err);
    }
  };

  const handleEliminar = async (partidoId) => {
    if (!window.confirm("¿Eliminar este partido?")) return;
    try {
      await fetch(`${API_URL}/api/partidos/eliminar/${partidoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartidos(partidos.filter((p) => p.id !== partidoId));
    } catch (err) {
      console.error("Error al eliminar partido", err);
    }
  };

  const partidoYaPaso = (fecha) => new Date(fecha) < new Date();

  const handleInputChange = (partidoId, campo, valor) => {
    setResultados((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: valor,
      },
    }));
  };

  const guardarResultado = async (partidoId) => {
    const { golesLocal, golesVisitante } = resultados[partidoId] || {};
    try {
      const res = await fetch(`${API_URL}/api/partidos/resultado/${partidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          golesLocal: parseInt(golesLocal),
          golesVisitante: parseInt(golesVisitante),
        }),
      });
      if (res.ok) {
        setEditandoResultado((prev) => ({ ...prev, [partidoId]: false }));
        fetchPartidos();
      }
    } catch (err) {
      console.error("Error al guardar resultado", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <div className="text-sm text-gray-700 font-semibold">
          Admin: <span className="text-green-700" onClick={() => navigate("/admin/perfil")}>
            {localStorage.getItem("nombreUsuario")}</span>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Crear Partido</h2>
          <button
            onClick={() => navigate(`/admin/competicion/${competicionId}`)}
            className="text-sm text-green-700 underline"
          >
            ← Volver al menú
          </button>
        </div>

        <form onSubmit={handleCrear} className="bg-white p-6 rounded-xl shadow space-y-4 mb-6">
          {/* Equipo Local */}
          <select className="w-full border p-2 rounded" value={equipoLocal} onChange={(e) => setEquipoLocal(e.target.value)} required>
            <option value="">Selecciona equipo local</option>
            {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>

          {/* Fecha y hora */}
          <input type="datetime-local" className="w-full border p-2 rounded" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required />

          {/* Equipo Visitante */}
          <select className="w-full border p-2 rounded" value={equipoVisitante} onChange={(e) => setEquipoVisitante(e.target.value)} required>
            <option value="">Selecciona equipo visitante</option>
            {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">
            Crear Partido
          </button>

          <p className="text-sm text-center mt-2 text-green-700 underline cursor-pointer" onClick={() => navigate("/admin/crear-equipo")}>
            ¿Falta algún equipo? Agrégalo aquí
          </p>
        </form>

        <h3 className="text-lg font-bold text-gray-800 mb-4">Partidos creados</h3>

        <ul className="space-y-3">
          {partidos.map((p) => (
            <li key={p.id} className="bg-white p-4 rounded-lg shadow flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border">
              {/* Local */}
              <div className="flex items-center gap-3">
                <img src={p.equipoLocal.escudoUrl} alt="local" className="w-8 h-8" />
                <span className="font-semibold">{p.equipoLocal.nombre}</span>
              </div>

              {/* Resultado o fecha */}
              {partidoYaPaso(p.fechaHora) ? (
                editandoResultado[p.id] ? (
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-12 text-center border rounded p-1" value={resultados[p.id]?.golesLocal ?? p.golesLocal ?? ""} onChange={(e) => handleInputChange(p.id, "golesLocal", e.target.value)} />
                    <span>-</span>
                    <input type="number" className="w-12 text-center border rounded p-1" value={resultados[p.id]?.golesVisitante ?? p.golesVisitante ?? ""} onChange={(e) => handleInputChange(p.id, "golesVisitante", e.target.value)} />
                    <button onClick={() => guardarResultado(p.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm">Guardar</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{p.golesLocal} - {p.golesVisitante}</span>
                    <button onClick={() => setEditandoResultado({ ...editandoResultado, [p.id]: true })} className="text-gray-500 hover:text-gray-800" title="Editar resultado">
                      <Pencil size={16} />
                    </button>
                  </div>
                )
              ) : (
                <div className="text-sm text-gray-500">
                  {new Date(p.fechaHora).toLocaleString()}
                </div>
              )}

              {/* Visitante */}
              <div className="flex items-center gap-3">
                <span className="font-semibold">{p.equipoVisitante.nombre}</span>
                <img src={p.equipoVisitante.escudoUrl} alt="visitante" className="w-8 h-8" />
              </div>

              {/* Eliminar */}
              <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default CrearPartido;
