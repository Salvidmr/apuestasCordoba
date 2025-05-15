import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Copy } from "lucide-react";

function PerfilUsuario() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [copiado, setCopiado] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [usuario, setUsuario] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const fetchPerfil = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      }
    } catch (error) {
      console.error("Error al cargar el perfil", error);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, [id]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleActualizar = async () => {
    const usuarioActualizado = {
      ...usuario,
      password: nuevaPassword !== "" ? nuevaPassword : usuario.password,
    };

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioActualizado),
      });
      const resultado = await res.text();
      if (res.ok) {
        setMensaje("Perfil actualizado con éxito.");
        setTimeout(() => navigate("/usuario"), 1500);
      } else {
        setMensaje(resultado);
      }
    } catch (err) {
      setMensaje("Error al actualizar perfil.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <span
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/usuario/perfil")}
        >
          {usuario?.nombreUsuario}
        </span>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold hidden sm:block">Arcanfield Road</h1>
        </div>
        <button
          onClick={() => navigate("/usuario")}
          className="text-sm font-medium bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200"
        >
          Volver
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-grow px-6 py-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Mi Perfil</h2>

        {mensaje && (
          <p className="text-center text-sm text-green-700 mb-4 transition">{mensaje}</p>
        )}

        {usuario && (
          <div className="space-y-4">
            <input
              name="nombreUsuario"
              value={usuario.nombreUsuario}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nombre de usuario"
              required
            />
            <input
              name="nombreYapellidos"
              value={usuario.nombreYapellidos || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nombre y Apellidos"
            />
            <input
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Email"
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
              onClick={() => {
                navigator.clipboard.writeText(usuario.pin);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
              title="Copiar PIN"
            >
              <Copy size={18} />
            </button>

            {copiado && (
              <span className="absolute right-2 top-full mt-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded shadow">
                ¡Copiado!
              </span>
            )}
          </div>
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nueva contraseña (opcional)"
            />
            <button
              onClick={handleActualizar}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-3 text-center">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default PerfilUsuario;
