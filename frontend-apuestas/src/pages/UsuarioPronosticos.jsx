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

  const [competicion, setCompeticion] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [pronosticos, setPronosticos] = useState({});

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

  const fetchPronosticos = async () => {
    const res = await fetch(
      `http://localhost:8080/api/apuestas/usuario/${usuarioId}/competicion/${competicionId}`,
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

    const res = await fetch(
      `http://localhost:8080/api/apuestas/realizar/${usuarioId}/${partidoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
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
      fetchPronosticos(); // refrescar
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
        <span className="text-sm font-semibold">{nombreUsuario}</span>
      </header>

      <nav className="bg-green-200 shadow flex divide-x divide-green-300">
        {[
          { label: "Realizar Pronósticos", ruta: "pronosticar" },
          { label: "Clasificación", ruta: "clasificacion" },
          { label: "Ver Pronósticos", ruta: "ver-pronosticos" },
        ].map((opcion) => (
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
          <div className="space-y-4">
            {partidos.map((p) => {
              const yaEmpezo = partidoYaEmpezo(p.fechaHora);
              const pron = pronosticos[p.id] || {};

              return (
                <div
                  key={p.id}
                  className={`bg-white p-4 rounded shadow flex flex-wrap items-center justify-between gap-3 ${
                    yaEmpezo ? "opacity-70" : ""
                  }`}
                >
                  {/* Local */}
                  <div className="flex items-center gap-2 w-full sm:w-1/4">
                    <img src={p.equipoLocal.escudoUrl} alt="local" className="h-8 w-8" />
                    <span className="font-medium">{p.equipoLocal.nombre}</span>
                  </div>

                  {/* Pronóstico */}
                  <div className="flex-grow sm:w-1/3 text-center">
                    {yaEmpezo ? (
                      <div className="text-sm text-gray-700">
                        <div className="font-semibold mb-1">Pronóstico:</div>
                        {pron.golesLocal !== undefined && pron.golesVisitante !== undefined ? (
                          <span>{pron.golesLocal} - {pron.golesVisitante}</span>
                        ) : (
                          <span className="text-red-500">No realizaste pronóstico</span>
                        )}
                      </div>
                    ) : pron.editando ? (
                      <div className="flex gap-2 justify-center items-center">
                        <input
                          type="number"
                          className="w-12 border text-center rounded p-1"
                          value={pron.golesLocal ?? ""}
                          onChange={(e) =>
                            handleInputChange(p.id, "golesLocal", e.target.value)
                          }
                        />
                        <span>-</span>
                        <input
                          type="number"
                          className="w-12 border text-center rounded p-1"
                          value={pron.golesVisitante ?? ""}
                          onChange={(e) =>
                            handleInputChange(p.id, "golesVisitante", e.target.value)
                          }
                        />
                        <button
                          onClick={() => guardarPronostico(p.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm flex items-center justify-center gap-2">
                        <span className="font-semibold">{pron.golesLocal ?? "-"} - {pron.golesVisitante ?? "-"}</span>
                        <button onClick={() => activarEdicion(p.id)} title="Editar">
                          <Pencil size={18} className="text-green-700 hover:text-green-900" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="flex items-center gap-2 w-full sm:w-1/4 justify-end">
                    <span className="font-medium">{p.equipoVisitante.nombre}</span>
                    <img src={p.equipoVisitante.escudoUrl} alt="visitante" className="h-8 w-8" />
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
