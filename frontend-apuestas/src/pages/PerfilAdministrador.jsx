import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Send } from "lucide-react";

function PerfilAdministrador() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const API_URL = import.meta.env.VITE_API_URL;

  const [usuario, setUsuario] = useState({
    nombreUsuario: "",
    nombreYapellidos: "",
    email: "",
    password: "",
    pin: ""
  });

  const [mensaje, setMensaje] = useState("");

  const obtenerDatos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuario({ ...data, password: "" }); // vaciamos password por seguridad
    } catch (err) {
      console.error("Error al obtener datos del perfil", err);
    }
  };

  const actualizarPerfil = async (e) => {
    e.preventDefault();

    // No incluir contraseña si no se quiere cambiar
    const usuarioAEnviar = { ...usuario };
    if (!usuario.password.trim()) {
      delete usuarioAEnviar.password;
    }

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioAEnviar),
      });

      const texto = await res.text();

      if (res.ok) {
        setMensaje("Perfil actualizado correctamente. Volviendo al inicio de sesión...");

        // Limpiar localStorage para forzar nuevo login
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 1500);
      } else {
        setMensaje(texto);
      }
    } catch (err) {
      console.error("Error al actualizar perfil", err);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
        </div>
        <span
          className="text-sm text-green-700 underline cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          ← Volver al panel
        </span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 bg-white mt-10 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>

        {mensaje && (
          <p className="text-sm text-center mb-4 text-green-700 font-semibold">{mensaje}</p>
        )}

        <form onSubmit={actualizarPerfil} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-2 border border-gray-300 rounded"
            value={usuario.nombreUsuario}
            onChange={(e) => setUsuario({ ...usuario, nombreUsuario: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nombre y apellidos"
            className="w-full p-2 border border-gray-300 rounded"
            value={usuario.nombreYapellidos}
            onChange={(e) => setUsuario({ ...usuario, nombreYapellidos: e.target.value })}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border border-gray-300 rounded"
            value={usuario.email}
            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
            required
          />
          <div className="relative">
            <input
              value={`PIN: ${usuario.pin}`}
              className="w-full p-2 border rounded bg-gray-100 text-gray-600 pr-10"
              readOnly
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(`${API_URL}/api/usuarios/enviar-pin/${id}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (res.ok) {
                    setMensaje("PIN enviado al correo correctamente.");
                  } else {
                    setMensaje("No se pudo enviar el PIN.");
                  }
                } catch (err) {
                  console.error("Error al enviar PIN:", err);
                  setMensaje("Error de red al intentar enviar el PIN.");
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
              title="Enviar PIN al correo"
            >
              <Send size={18} />
            </button>
          </div>
          <input
            type="password"
            placeholder="Nueva contraseña (dejar en blanco si no se cambia)"
            className="w-full p-2 border border-gray-300 rounded"
            value={usuario.password}
            onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Guardar cambios
          </button>
        </form>
      </main>
    </div>
  );
}

export default PerfilAdministrador;
