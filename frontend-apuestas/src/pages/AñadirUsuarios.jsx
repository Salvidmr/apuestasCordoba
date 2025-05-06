import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Plus, X } from "lucide-react";

function AñadirUsuarios() {
    const { id: competicionId } = useParams();
    const [usuarios, setUsuarios] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/usuarios/listar", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsuarios(data);
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    };

    const fetchParticipantes = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/competiciones/${competicionId}/participantes`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            setParticipantes(data);
        } catch (err) {
            console.error("Error al cargar participantes", err);
        }
    };

    const esParticipante = (usuarioId) =>
        participantes.some((u) => u.id === usuarioId);

    const añadirUsuario = async (usuarioId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/competiciones/${competicionId}/añadir-usuario/${usuarioId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) fetchParticipantes();
        } catch (err) {
            console.error("Error al añadir usuario", err);
        }
    };

    const quitarUsuario = async (usuarioId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/competiciones/${competicionId}/quitar-usuario/${usuarioId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) fetchParticipantes();
        } catch (err) {
            console.error("Error al quitar usuario", err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchParticipantes();
    }, [competicionId, token]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <h1 className="text-2xl font-bold text-green-700">Arcanfield Road</h1>
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                    Admin: <span className="text-green-700" onClick={() => navigate("/admin/perfil")}>
                        {localStorage.getItem("nombreUsuario")}</span>
                </div>
            </header>

            {/* Contenido */}
            <main className="p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Gestionar usuarios</h2>

                <ul className="space-y-3">
                    {usuarios
                        .filter((u) => u.rol === "user")
                        .map((u) => {
                            const yaEsta = esParticipante(u.id);
                            return (
                                <li
                                    key={u.id}
                                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center border"
                                >
                                    <span className="font-medium text-gray-800">{u.nombreYapellidos}</span>

                                    {yaEsta ? (
                                        <button
                                            onClick={() => quitarUsuario(u.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Quitar de la competición"
                                        >
                                            <X size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => añadirUsuario(u.id)}
                                            className="text-green-600 hover:text-green-800"
                                            title="Añadir a la competición"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                </ul>


                <button
                    onClick={() => navigate(`/admin/competicion/${competicionId}`)}
                    className="mt-8 text-green-700 underline hover:text-green-800 block mx-auto"
                >
                    ← Volver al menú de gestión de competición
                </button>
            </main>
        </div>
    );
}

export default AñadirUsuarios;
