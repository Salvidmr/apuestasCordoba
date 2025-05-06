import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { toast } from "react-toastify"; // ✅ importar el toast

function CrearCompeticion() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const navigate = useNavigate();

  const [adminId, setAdminId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    setAdminId(localStorage.getItem("id"));
    setToken(localStorage.getItem("token"));
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();

    const datos = { nombre, descripcion, fechaFin };

    if (!adminId || !token) {
      toast.error("Falta información de sesión.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/competiciones/crear/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const resultado = await response.text();

      if (response.ok) {
        toast.success("🏆 Competición creada correctamente.");
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        toast.error(resultado || "Error al crear la competición.");
      }
    } catch (error) {
      console.error("Error al crear competición", error);
      toast.error("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <div className="text-sm text-gray-700 font-semibold">
          Admin: <span className="text-green-700" onClick={() => navigate("/admin/perfil")}>
            {localStorage.getItem("nombreUsuario")}</span>
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto bg-white mt-10 shadow-md rounded-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Crear nueva competición</h2>

        <form onSubmit={handleCrear}>
          <input
            type="text"
            placeholder="Nombre de la competición"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción (opcional)"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
          />

          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Crear competición
          </button>
        </form>

      </main>
      <button
        onClick={() => navigate("/admin")}
        className="mt-8 text-green-700 underline hover:text-green-800 block mx-auto"
      >
        ← Volver a la página principal del administrador
      </button>
    </div>
  );
}

export default CrearCompeticion;
