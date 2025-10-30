import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Trash2 } from "lucide-react";



function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [mensaje, setMensaje] = useState("");
  const nombreAdmin = localStorage.getItem("nombreUsuario") || "Administrador";
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
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
        {mensaje && (
          <p className="text-green-700 text-sm text-center mb-4">{mensaje}</p>
        )}


        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full table-auto text-sm border-collapse">
            <thead className="bg-green-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">Nombre de usuario</th>
                <th className="px-4 py-3">Nombre y apellidos</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">PIN</th>
                <th className="px-4 py-3">Fecha registro</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
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
                    <td className="px-4 py-2">
                      {usuario.fechaRegistro
                        ? new Date(usuario.fechaRegistro).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).replace(",", " a las")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {usuario.rol !== "admin" ? (
                        <button
                          onClick={() => {
                            setUsuarioAEliminar(usuario);
                            setMostrarModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title={`Eliminar a ${usuario.nombreUsuario}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Admin</span>
                      )}
                    </td>
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

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar usuario?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Estás a punto de eliminar a <span className="font-bold text-red-600">{usuarioAEliminar?.nombreUsuario}</span>. Esta acción no se puede deshacer.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_URL}/api/usuarios/${usuarioAEliminar.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.ok) {
                      setUsuarios(usuarios.filter(u => u.id !== usuarioAEliminar.id));
                      setMensaje("Usuario eliminado correctamente.");
                    } else {
                      const errorText = await res.text();
                      setError(`Error del servidor: ${errorText}`);
                      console.error("Error al eliminar usuario:", errorText);
                    }
                  } catch (err) {
                    console.error("Error de red al eliminar el usuario:", err);
                    setError("Error de red al eliminar el usuario.");
                  } finally {
                    setMostrarModal(false);
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListadoUsuarios;
