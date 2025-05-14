import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

function RecuperarPassword() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        if (nuevaPassword !== confirmarPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/usuarios/recuperar-password/${nombreUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: nuevaPassword })
            });

            const texto = await res.text();

            if (res.ok) {
                setMensaje("Contraseña actualizada correctamente. Redirigiendo al login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(texto || "No se pudo actualizar la contraseña.");
            }

        } catch (err) {
            console.error("Error al recuperar contraseña", err);
            setError(err.message || "Error de conexión con el servidor.");
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
                {mensaje && <p className="text-green-700 text-sm text-center mb-4">{mensaje}</p>}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
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
                        placeholder="Nueva contraseña"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        value={nuevaPassword}
                        onChange={(e) => setNuevaPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
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
                        {loading ? "Actualizando..." : "Actualizar contraseña"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    ¿Ya recuerdas tu contraseña?{" "}
                    <Link to="/login" className="text-green-700 font-semibold hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RecuperarPassword;
