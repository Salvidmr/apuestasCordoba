import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Trash2 } from "lucide-react";

function TablonAnuncios() {
  const { id: competicionId } = useParams();
  const [titulo, setTitulo] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [anuncios, setAnuncios] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAnuncios = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/anuncios/competicion/${competicionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setAnuncios(data);
    } catch (err) {
      console.error("Error al cargar anuncios", err);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, [competicionId, token]);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8080/api/anuncios/crear/${competicionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ titulo, fechaExpiracion }),
        }
      );

      if (res.ok) {
        setTitulo("");
        setFechaExpiracion("");
        fetchAnuncios();
      }
    } catch (err) {
      console.error("Error al crear anuncio", err);
    }
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Eliminar este anuncio?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8080/api/anuncios/eliminar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchAnuncios();
      }
    } catch (err) {
      console.error("Error al eliminar anuncio", err);
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
          Admin:{" "}
          <span className="text-green-700" onClick={() => navigate("/admin/perfil")}>
            {localStorage.getItem("nombreUsuario")}</span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tablón de Anuncios</h2>

        {/* Formulario */}
        <form
          onSubmit={handleCrear}
          className="bg-white p-6 rounded-xl shadow space-y-4 mb-8"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del anuncio
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de expiración
            </label>
            <input
              type="datetime-local"
              className="w-full border p-2 rounded"
              value={fechaExpiracion}
              onChange={(e) => setFechaExpiracion(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
          >
            Crear Anuncio
          </button>
        </form>

        {/* Lista de anuncios */}
        <ul className="space-y-4">
          {anuncios.map((anuncio) => (
            <li
              key={anuncio.id}
              className="bg-white p-4 rounded-lg shadow border flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{anuncio.titulo}</h4>
                <p className="text-sm text-gray-600">
                  Expira: {new Date(anuncio.fechaExpiracion).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleEliminar(anuncio.id)}
                className="text-red-600 hover:text-red-800 mt-3 sm:mt-0"
                title="Eliminar anuncio"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>

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

export default TablonAnuncios;
