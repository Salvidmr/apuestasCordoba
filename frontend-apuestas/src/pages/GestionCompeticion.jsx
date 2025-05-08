import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import {
  CalendarPlus,
  Users,
  Eye,
  Trophy,
  Megaphone,
  Settings,
  ArrowLeft,
} from "lucide-react";

function GestionCompeticion() {
  const { id } = useParams();
  const [competicion, setCompeticion] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCompeticion = async () => {
      try {
        const res = await fetch(`${API_URL}/api/competiciones/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCompeticion(data);
      } catch (err) {
        console.error("Error al cargar la competición", err);
      }
    };

    fetchCompeticion();
  }, [id, token]);

  const opciones = [
    { label: "Crear Partidos", ruta: "crear-partido", icon: CalendarPlus },
    { label: "Añadir Usuarios", ruta: "añadir-usuarios", icon: Users },
    { label: "Ver Pronósticos", ruta: "pronosticos", icon: Eye },
    { label: "Clasificación", ruta: "clasificacion", icon: Trophy },
    { label: "Tablón de Anuncios", ruta: "anuncios", icon: Megaphone },
    { label: "Configuración", ruta: "configuracion", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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

      {/* Contenido */}
      <main className="p-6 max-w-4xl mx-auto">
        {competicion ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Gestionando: <span className="text-green-700">{competicion.nombre}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {opciones.map(({ label, ruta, icon: Icon }) => (
                <button
                  key={label}
                  className="bg-white border border-gray-300 p-4 rounded-lg shadow hover:bg-green-50 transition flex items-center gap-3"
                  onClick={() => navigate(`/admin/competicion/${id}/${ruta}`)}
                >
                  <Icon size={20} className="text-green-700" />
                  <span className="text-green-700 font-semibold">{label}</span>
                </button>
              ))}
            </div>

            {/* Botón para volver */}
            <div className="text-center">
              <button
                onClick={() => navigate("/admin")}
                className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Volver a la página principal
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Cargando competición...</p>
        )}
      </main>
    </div>
  );
}

export default GestionCompeticion;
