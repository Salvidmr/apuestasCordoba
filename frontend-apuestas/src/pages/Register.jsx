import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Register() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreYapellidos, setNombreYapellidos] = useState(""); // Nuevo campo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (/\s/.test(nombreUsuario)) {
    setMensaje("El nombre de usuario no puede contener espacios.");
    return;
  }

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    const datos = { nombreUsuario, nombreYapellidos, email, password };

    try {
      const response = await fetch(`${API_URL}/api/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.text();

      if (response.ok) {
        setMensaje("Usuario registrado correctamente. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje(resultado);
      }
    } catch (err) {
      console.error("ERROR en fetch:", err);
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col sm:flex-row items-center mb-10 text-center sm:text-left gap-3">
        <img src={logo} alt="Logo Peña" className="w-24 h-auto sm:mr-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">Arcanfield Road</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm">
        {mensaje && (
          <p className="text-sm text-center mb-4 text-red-600 transition-all">{mensaje}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nombre y apellidos"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={nombreYapellidos}
            onChange={(e) => setNombreYapellidos(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full p-2 border border-gray-300 rounded mb-6"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-green-700 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
