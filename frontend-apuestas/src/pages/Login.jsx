import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const datos = { nombreUsuario, password };

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if (response.ok) {
        const { token, rol, id, nombreYapellidos } = resultado;

        if (token && rol && id) {
          localStorage.setItem("token", token);
          localStorage.setItem("rol", rol);
          localStorage.setItem("id", id);
          localStorage.setItem("nombreUsuario", nombreUsuario);
          localStorage.setItem("nombreYapellidos", nombreYapellidos); 

          await new Promise((res) => setTimeout(res, 100));
          navigate(rol === "admin" ? "/admin" : "/usuario");
        } else {
          setError("Faltan datos en la respuesta del servidor.");
        }
      } else {
        setError(resultado.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error("Error al conectar con el backend", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col sm:flex-row items-center mb-10 text-center sm:text-left gap-3">
        <img src={logo} alt="Logo Peña" className="w-24 h-auto sm:mr-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">Arcanfield Road</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-semibold transition-colors ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-green-600 border-opacity-50"></div>
          </div>
        )}

        <p className="mt-4 text-sm text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-green-700 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
