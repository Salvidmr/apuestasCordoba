import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Pencil } from "lucide-react";

function CrearEquipo() {
  const [nombre, setNombre] = useState("");
  const [escudoUrl, setEscudoUrl] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [edicion, setEdicion] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchEquipos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/equipos/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEquipos(data);
    } catch (err) {
      console.error("Error al cargar equipos", err);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, [token]);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/equipos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, escudoUrl }),
      });

      if (res.ok) {
        setNombre("");
        setEscudoUrl("");
        fetchEquipos();
      }
    } catch (err) {
      console.error("Error al crear equipo", err);
    }
  };

  const iniciarEdicion = (equipo) => {
    setEditandoId(equipo.id);
    setEdicion({ nombre: equipo.nombre, escudoUrl: equipo.escudoUrl });
  };

  const handleGuardarEdicion = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/equipos/editar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(edicion),
      });

      if (res.ok) {
        setEditandoId(null);
        setEdicion({});
        fetchEquipos();
      }
    } catch (err) {
      console.error("Error al editar equipo", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <div className="text-sm text-gray-700 font-semibold">
          Admin: <span className="text-green-700">{localStorage.getItem("nombreUsuario")}</span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Agregar equipo</h2>

        <form onSubmit={handleCrear} className="bg-white p-6 rounded-xl shadow space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del equipo</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL del escudo</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={escudoUrl}
              onChange={(e) => setEscudoUrl(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
          >
            Crear equipo
          </button>
        </form>

        <h3 className="text-lg font-bold text-gray-800 mb-4">Equipos existentes</h3>

        <ul className="space-y-4">
          {equipos.map((eq) => (
            <li
              key={eq.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              {editandoId === eq.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center">
                  <input
                    type="text"
                    className="border p-2 rounded w-full sm:w-48"
                    value={edicion.nombre}
                    onChange={(e) =>
                      setEdicion((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                  />
                  <input
                    type="text"
                    className="border p-2 rounded w-full sm:w-60"
                    value={edicion.escudoUrl}
                    onChange={(e) =>
                      setEdicion((prev) => ({ ...prev, escudoUrl: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => handleGuardarEdicion(eq.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <img src={eq.escudoUrl} alt={eq.nombre} className="w-10 h-10" />
                    <span className="font-semibold">{eq.nombre}</span>
                  </div>
                  <button
                    onClick={() => iniciarEdicion(eq)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate("/admin")}
          className="mt-8 text-green-700 underline hover:text-green-800 block mx-auto"
        >
          ← Volver a la página principal del administrador
        </button>
      </main>
    </div>
  );
}

export default CrearEquipo;
