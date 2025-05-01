import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function PerfilUsuario() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const [usuario, setUsuario] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const fetchPerfil = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
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
      const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
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
          <h1 className="text-2xl font-bold">Arcanfield Road</h1>
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
