import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import logo from "../assets/logo.png";

function UsuarioPronosticos() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("id");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const API_URL = import.meta.env.VITE_API_URL;

  const [competicion, setCompeticion] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [pronosticos, setPronosticos] = useState({});
  const [loadingId, setLoadingId] = useState(null);

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
      setPartidos(data);
    }
  };

  const fetchPronosticos = async () => {
    const res = await fetch(
      `${API_URL}/api/apuestas/usuario/${usuarioId}/competicion/${competicionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const formato = {};
      data.forEach((p) => {
        formato[p.partido.id] = {
          golesLocal: p.golesLocal,
          golesVisitante: p.golesVisitante,
          editando: false,
        };
      });
      setPronosticos(formato);
    }
  };

  const guardarPronostico = async (partidoId) => {
    const apuesta = pronosticos[partidoId];
    if (!apuesta) return;

    setLoadingId(partidoId);

    try {
      const res = await fetch(
        `${API_URL}/api/apuestas/realizar/${usuarioId}/${partidoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            golesLocal: parseInt(apuesta.golesLocal),
            golesVisitante: parseInt(apuesta.golesVisitante),
          }),
        }
      );

      if (res.ok) {
        setPronosticos((prev) => ({
          ...prev,
          [partidoId]: {
            ...prev[partidoId],
            editando: false,
          },
        }));
        await fetchPronosticos();
      } else {
        alert("❌ Error al guardar el pronóstico.");
      }
    } catch (err) {
      console.error("Error al guardar pronóstico:", err);
      alert("❌ Error inesperado.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleInputChange = (partidoId, campo, valor) => {
    setPronosticos((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: valor,
      },
    }));
  };

  const activarEdicion = (partidoId) => {
    setPronosticos((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        editando: true,
      },
    }));
  };

  useEffect(() => {
    fetchCompeticion();
    fetchPartidos();
    fetchPronosticos();
  }, [competicionId]);

  const partidoYaEmpezo = (fecha) => new Date(fecha) <= new Date();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-center">{competicion?.nombre || "..."}</h1>
        <span className="text-sm font-semibold cursor-pointer" onClick={() => navigate("/usuario/perfil")}>{nombreUsuario}</span>
      </header>

      <nav className="bg-green-200 shadow flex divide-x divide-green-300">
        {[{ label: "Realizar Pronósticos", ruta: "pronosticar" }, { label: "Clasificación", ruta: "clasificacion" }, { label: "Ver Pronósticos", ruta: "ver-pronosticos" }].map((opcion) => (
          <button
            key={opcion.ruta}
            onClick={() => navigate(`/usuario/competicion/${competicionId}/${opcion.ruta}`)}
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
        <h2 className="text-xl font-bold mb-4 text-center">Partidos Disponibles</h2>

        {partidos.length === 0 ? (
          <p className="text-center text-gray-600">No hay partidos disponibles.</p>
        ) : (
          <div className="space-y-6">
            {partidos.map((p) => {
              const yaEmpezo = partidoYaEmpezo(p.fechaHora);
              const pron = pronosticos[p.id] || {};

              return (
                <div key={p.id} className={`bg-white p-4 sm:p-6 rounded-xl border-2 border-green-500 transition duration-200 ${yaEmpezo ? "opacity-60" : "hover:shadow-lg"}`}>
                  <div className="grid grid-cols-3 items-center text-center gap-4">
                    <div className="flex flex-col items-center">
                      <img src={p.equipoLocal.escudoUrl} alt="local" className="h-14 w-14 sm:h-20 sm:w-20" />
                      <span className="text-sm sm:text-base font-medium text-center mt-1">{p.equipoLocal.nombre}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {yaEmpezo ? (
                        <div className="text-sm sm:text-base text-gray-700">
                          <div className="font-semibold mb-1">Pronóstico:</div>
                          {pron.golesLocal !== undefined && pron.golesVisitante !== undefined ? (
                            <span>{pron.golesLocal} - {pron.golesVisitante}</span>
                          ) : (
                            <span className="text-red-500">No realizaste pronóstico</span>
                          )}
                        </div>
                      ) : pron.editando ? (
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number"
                            className="w-16 text-xl text-center border rounded p-1"
                            value={pron.golesLocal ?? ""}
                            onChange={(e) => handleInputChange(p.id, "golesLocal", e.target.value)}
                          />
                          <span className="text-xl">-</span>
                          <input
                            type="number"
                            className="w-16 text-xl text-center border rounded p-1"
                            value={pron.golesVisitante ?? ""}
                            onChange={(e) => handleInputChange(p.id, "golesVisitante", e.target.value)}
                          />
                          <button
                            onClick={() => guardarPronostico(p.id)}
                            disabled={loadingId === p.id}
                            className={`mt-2 px-3 py-1 rounded text-sm font-semibold ${loadingId === p.id ? "bg-green-400 cursor-wait" : "bg-green-600 hover:bg-green-700"} text-white`}
                          >
                            {loadingId === p.id ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
                          <span>{pron.golesLocal ?? "-"} - {pron.golesVisitante ?? "-"}</span>
                          <button onClick={() => activarEdicion(p.id)} title="Editar">
                            <Pencil size={20} className="text-green-700 hover:text-green-900" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      <img src={p.equipoVisitante.escudoUrl} alt="visitante" className="h-14 w-14 sm:h-20 sm:w-20" />
                      <span className="text-sm sm:text-base font-medium text-center mt-1">{p.equipoVisitante.nombre}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-green-700 text-white py-3 text-center mt-auto">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioPronosticos;
