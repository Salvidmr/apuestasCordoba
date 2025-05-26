import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function RecuperarTemporal() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [pinTemporal, setPinTemporal] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const enviarPinTemporal = async () => {
    setMensaje("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/enviar-pin-temporal/${nombreUsuario.trim()}`, {
        method: "POST",
      });

      const texto = await res.text();

      if (res.ok) {
        setEmailEnviado(true);
        setMensaje(`📧 ${texto}`);
      } else {
        setMensaje(texto);
      }
    } catch {
      setMensaje("Error al enviar el PIN temporal.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async () => {
    if (!pinTemporal || !nuevaPassword || !confirmarPassword) {
      setMensaje("Completa todos los campos para continuar.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/usuarios/recuperar-password-temporal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreUsuario: nombreUsuario.trim(),
          pin: pinTemporal.trim(),
          nuevaPassword,
        }),
      });

      const texto = await res.text();

      if (res.ok) {
        setMensaje("✅ Contraseña actualizada correctamente. Redirigiendo...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje(texto);
      }
    } catch {
      setMensaje("Error al cambiar la contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo" className="w-24 h-auto mb-2" />
        <h1 className="text-3xl font-bold text-green-700">Arcanfield Road</h1>
        <p className="text-sm text-gray-600 mt-1">Recuperación con PIN temporal</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border">
        {mensaje && (
          <div className={`text-sm text-center ${mensaje.startsWith("✅") || mensaje.startsWith("📧") ? "text-green-700" : "text-red-600"}`}>
            {mensaje}
          </div>
        )}

        {!emailEnviado ? (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nombre de usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={enviarPinTemporal}
              disabled={loading || !nombreUsuario.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
            >
              {loading ? "Enviando..." : "Enviar PIN temporal"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="PIN temporal recibido"
              value={pinTemporal}
              onChange={(e) => setPinTemporal(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Confirmar nueva contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
            <button
              onClick={cambiarPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
            >
              Cambiar contraseña
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/login")}
        className="mt-6 text-green-700 underline text-sm hover:text-green-900"
      >
        ← Volver al inicio de sesión
      </button>

      <footer className="text-xs text-gray-500 mt-6 text-center">
        &copy; 2024 Arcanfield Road. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default RecuperarTemporal;
