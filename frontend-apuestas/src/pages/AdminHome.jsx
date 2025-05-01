import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Trash2, LogOut } from "lucide-react";

function AdminHome() {
  const [competiciones, setCompeticiones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [competicionAEliminar, setCompeticionAEliminar] = useState(null);

  const nombreAdmin = localStorage.getItem("nombreUsuario") || "Administrador";
  const adminId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const obtenerCompeticiones = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/competiciones/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener las competiciones");
      }

      const data = await response.json();
      setCompeticiones(data);
    } catch (error) {
      console.error("Error al cargar competiciones", error);
    }
  };

  useEffect(() => {
    obtenerCompeticiones();
  }, [adminId, token]);

  const handleEliminarConfirmado = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/competiciones/eliminar/${competicionAEliminar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCompeticiones(competiciones.filter((c) => c.id !== competicionAEliminar.id));
        setMostrarModal(false);
        setCompeticionAEliminar(null);
      } else {
        console.error("No se pudo eliminar la competición.");
      }
    } catch (error) {
      console.error("Error al eliminar competición:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const estaFinalizada = (fechaFin) => {
    return new Date(fechaFin) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-green-700 whitespace-nowrap">Arcanfield Road</h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
        <span
          className="text-sm text-green-700 font-semibold cursor-pointer underline hover:text-green-800 whitespace-nowrap"
          onClick={() => navigate("/admin/perfil")}
        >
          Admin: {nombreAdmin}
        </span>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <button
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-4 py-2 rounded-lg mb-6 font-semibold transition-colors"
          onClick={() => navigate("/crear-competicion")}
        >
          + Crear competición
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Competiciones creadas</h2>

        {competiciones.length === 0 ? (
          <p className="text-gray-500 text-center">No hay competiciones creadas.</p>
        ) : (
          <ul className="space-y-3">
            {competiciones.map((comp) => (
              <li
                key={comp.id}
                className="bg-white p-4 shadow rounded-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="w-full">
                  <h3
                    onClick={() => navigate(`/admin/competicion/${comp.id}`)}
                    className="font-semibold text-green-700 flex items-center gap-2 text-base sm:text-lg cursor-pointer hover:underline"
                  >
                    {comp.nombre}
                    {estaFinalizada(comp.fechaFin) && (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                        FINALIZADO
                      </span>
                    )}
                  </h3>
                  {comp.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{comp.descripcion}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCompeticionAEliminar(comp);
                    setMostrarModal(true);
                  }}
                  className="text-red-600 hover:text-red-800 self-end sm:self-auto"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar competición?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Estás a punto de eliminar{" "}
              <span className="font-bold text-red-600">
                {competicionAEliminar?.nombre}
              </span>
              . Esta acción no se puede deshacer.
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
                onClick={handleEliminarConfirmado}
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

export default AdminHome;
