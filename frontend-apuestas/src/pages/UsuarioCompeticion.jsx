import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

function UsuarioCompeticion() {
  const { id: competicionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const API_URL = import.meta.env.VITE_API_URL;
  const [competicion, setCompeticion] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [indexActivo, setIndexActivo] = useState(0);

  const fetchCompeticion = async () => {
    try {
      const res = await fetch(`${API_URL}/api/competiciones/${competicionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompeticion(data);
      }
    } catch (err) {
      console.error("Error al cargar la competición", err);
    }
  };

  const fetchAnuncios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/anuncios/competicion/${competicionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnuncios(data);
      } else {
        console.error("Error al obtener anuncios activos.");
      }
    } catch (err) {
      console.error("Error al cargar anuncios", err);
    }
  };

  useEffect(() => {
    fetchCompeticion();
    fetchAnuncios();
  }, [competicionId, token]);

  const handlePrev = () => {
    setIndexActivo((prev) => (prev === 0 ? anuncios.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndexActivo((prev) => (prev === anuncios.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-center">{competicion?.nombre || "..."}</h1>
        <span className="text-sm font-semibold" onClick={() => navigate("/usuario/perfil")}>{nombreUsuario}</span>
      </header>

      {/* Subheader */}
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

      {/* Botón de volver */}
      <div className="bg-white px-6 py-3 text-center shadow">
        <button
          onClick={() => navigate("/usuario")}
          className="text-green-700 underline font-medium hover:text-green-800"
        >
          ← Volver a la página principal
        </button>
      </div>

      {/* Contenido principal */}
      <main className="flex-grow px-6 py-8 max-w-3xl mx-auto relative">
        {anuncios.length === 0 ? (
          <p className="text-center text-gray-600">No hay anuncios disponibles.</p>
        ) : (
          <div className="relative text-center">
            {/* Botones fuera del recuadro */}
            <button
              onClick={handlePrev}
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-900 z-10"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={handleNext}
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-900 z-10"
            >
              <ChevronRight size={28} />
            </button>

            {/* Card con animación */}
            <div
              key={anuncios[indexActivo]?.id}
              className="bg-white p-6 rounded shadow animate-fade"
            >
              <h3 className="text-lg font-bold text-green-700 mb-2">
                {anuncios[indexActivo]?.titulo}
              </h3>
              <p className="text-sm text-gray-700">
                Expira el{" "}
                {new Date(anuncios[indexActivo]?.fechaExpiracion).toLocaleDateString()}
              </p>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
              {anuncios.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition ${i === indexActivo
                    ? "bg-green-700"
                    : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    }`}
                  onClick={() => setIndexActivo(i)}
                ></span>
              ))}
            </div>
          </div>
        )}


        {/* Botón Reglas del Juego */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/usuario/competicion/${competicionId}/reglas`)}
            className="inline-block px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition"
          >
            Reglas del juego
          </button>
        </div></main>


      {/* Footer */}
      <footer className="bg-green-700 text-white py-3 text-center mt-auto">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default UsuarioCompeticion;
