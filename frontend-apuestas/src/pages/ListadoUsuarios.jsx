import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const nombreAdmin = localStorage.getItem("nombreUsuario") || "Administrador";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/listar`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudieron obtener los usuarios.");
        }

        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message || "Error al cargar usuarios.");
      }
    };

    fetchUsuarios();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700 whitespace-nowrap">
            Arcanfield Road
          </h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span
            className="text-sm text-green-700 font-semibold cursor-pointer underline hover:text-green-800 whitespace-nowrap"
            onClick={() => navigate("/admin/perfil")}
          >
            Admin: {nombreAdmin}
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-4 sm:p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-green-800 text-center">Usuarios registrados</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full table-auto text-sm border-collapse">
            <thead className="bg-green-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">Nombre de usuario</th>
                <th className="px-4 py-3">Nombre y apellidos</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">PIN</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-6">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{usuario.nombreUsuario}</td>
                    <td className="px-4 py-2">{usuario.nombreYapellidos}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{usuario.pin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/admin")}
            className="text-green-700 underline font-semibold hover:text-green-900 text-sm"
          >
            ← Volver al panel de administración
          </button>
        </div>
      </main>
    </div>
  );
}

export default ListadoUsuarios;
