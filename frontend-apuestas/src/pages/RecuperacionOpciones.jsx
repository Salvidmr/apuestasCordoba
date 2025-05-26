import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function RecuperacionOpciones() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      {/* Encabezado */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo Peña" className="w-24 h-auto mb-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">Arcanfield Road</h1>
        <p className="text-sm text-gray-600 mt-1">Sistema de recuperación de cuenta</p>
      </div>

      {/* Contenido principal */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
          ¿Cómo deseas recuperar tu contraseña?
        </h2>

        {/* Opción: PIN personal */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <button
            onClick={() => navigate("/recuperar")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Recuperar con PIN Personal
          </button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Usa tu nombre de usuario y tu PIN personal (asignado al registrarte) para restaurar tu contraseña.
          </p>
        </div>

        {/* Opción: PIN temporal */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <button
            onClick={() => navigate("/recuperar-temporal")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Recuperar con PIN Temporal (correo)
          </button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Introduce tu nombre de usuario y te enviaremos un PIN temporal al correo registrado.
          </p>
        </div>
      </div>

      {/* Botón para volver al login */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/login")}
          className="text-green-700 underline font-medium hover:text-green-900 text-sm"
        >
          ← Volver al inicio de sesión
        </button>
      </div>

      {/* Footer */}
      <footer className="text-xs text-gray-500 mt-8 text-center">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default RecuperacionOpciones;
