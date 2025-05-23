import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";
import { FileText, FileSpreadsheet } from "lucide-react";

function Clasificacion() {
  const { id: competicionId } = useParams();
  const [clasificacion, setClasificacion] = useState([]);
  const [nombreCompeticion, setNombreCompeticion] = useState("");
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchClasificacion = async () => {
    try {
      const resCompeticion = await fetch(
        `${API_URL}/api/competiciones/${competicionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const dataCompeticion = await resCompeticion.json();
      setNombreCompeticion(dataCompeticion.nombre || "Competición");

      const resClasif = await fetch(
        `${API_URL}/api/apuestas/clasificacion/${competicionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const clasifData = await resClasif.json();

      const resParticipantes = await fetch(
        `${API_URL}/api/competiciones/${competicionId}/participantes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const participantesData = await resParticipantes.json();

      const puntosMap = new Map(clasifData.map((u) => [u.id, u.puntos]));

      const combinada = participantesData.map((usuario) => ({
        id: usuario.id,
        nombreUsuario: usuario.nombreYapellidos,
        puntos: puntosMap.get(usuario.id) || 0,
      }));

      combinada.sort((a, b) => b.puntos - a.puntos);
      setClasificacion(combinada);
    } catch (err) {
      console.error("Error al cargar la clasificación", err);
    } finally {
      setCargando(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      clasificacion.map((u, i) => ({
        Posición: i + 1,
        Usuario: u.nombreUsuario,
        Puntos: u.puntos ?? 0,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clasificación");
    XLSX.writeFile(workbook, "clasificacion.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString("es-ES");

    doc.setFontSize(14);
    doc.text(`Clasificación - ${nombreCompeticion}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Posición", "Usuario", "Puntos"]],
      body: clasificacion.map((u, i) => [i + 1, u.nombreUsuario, u.puntos ?? 0]),
    });

    doc.save(`clasificacion-${nombreCompeticion}.pdf`);
  };

  useEffect(() => {
    fetchClasificacion();
  }, [competicionId]);

  return (
    <div className="min-h-screen bg-gray-100">
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

      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Clasificación</h2>

        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded"
          >
            <FileSpreadsheet size={18} /> Exportar a Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded"
          >
            <FileText size={18} /> Exportar a PDF
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-600">Cargando clasificación...</p>
        ) : clasificacion.length === 0 ? (
          <p className="text-center text-gray-600">
            Aún no hay participantes en esta competición.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Posición</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">Puntos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {clasificacion.map((usuario, index) => {
                  const posicion = index + 1;
                  const medalla =
                    posicion === 1 ? "🥇" : posicion === 2 ? "🥈" : posicion === 3 ? "🥉" : null;
                  const filaColor =
                    posicion === 1
                      ? "bg-yellow-50"
                      : posicion === 2
                      ? "bg-gray-100"
                      : posicion === 3
                      ? "bg-orange-50"
                      : "";

                  return (
                    <tr key={usuario.id} className={`hover:bg-gray-50 transition ${filaColor}`}>
                      <td className="px-6 py-3 text-sm text-gray-700">{medalla || posicion}</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">{usuario.nombreUsuario}</td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-green-700">{usuario.puntos}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => navigate(`/admin/competicion/${competicionId}`)}
          className="mt-10 text-green-700 underline hover:text-green-800 block mx-auto"
        >
          ← Volver al menú de gestión de competición
        </button>
      </main>
    </div>
  );
}

export default Clasificacion;
