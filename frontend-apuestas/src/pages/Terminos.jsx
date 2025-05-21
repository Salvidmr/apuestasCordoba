import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Terminos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* Logo y título */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo" className="h-20 mb-2" />
        <h1 className="text-3xl font-extrabold text-green-700 text-center">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Última actualización: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Contenido */}
      <div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-xl shadow-md text-gray-800 space-y-6">
        <p>
          Esta plataforma ha sido desarrollada para la gestión de pronósticos y competiciones internas
          de la peña <strong>Arcanfield Road</strong>.
        </p>

        <section>
          <h3 className="font-semibold text-green-700 mb-1">1. Privacidad</h3>
          <p>
            Los datos personales se utilizan únicamente para el funcionamiento de la aplicación y no serán
            compartidos con terceros bajo ningún concepto.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-green-700 mb-1">2. Derechos de uso</h3>
          <p>
            Esta herramienta fue desarrollada por <strong>Salvador Del Mármol Rodríguez</strong> exclusivamente para
            uso privado. Todos los derechos quedan reservados a la peña.
          </p>
        </section>

        <p className="text-xs text-center text-gray-400 pt-4 border-t">
          &copy; {new Date().getFullYear()} Peña Arcanfield Road. Todos los derechos reservados.
        </p>
      </div>

      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-sm text-green-700 underline hover:text-green-900"
      >
        ← Volver atrás
      </button>
    </div>
  );
}

export default Terminos;
