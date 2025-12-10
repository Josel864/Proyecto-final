import { useEffect, useState } from 'react';
import api from '../services/api';
import { descargarReporteResumen } from '../services/reportesService';
import studyImg from '../assets/imgest1.png';


function DashboardPage() {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get('/materias');
        setMensaje(`Tienes ${data.length} materias registradas.`);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.mensaje || 'Error al cargar datos';
        setError(msg);
      }
    }
    fetchData();
  }, []);

  const handleDescargarPDF = async () => {
    setError('');
    setDescargando(true);
    try {
      const blob = await descargarReporteResumen();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte_uniplanner.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensaje || 'Error al descargar el reporte PDF';
      setError(msg);
    } finally {
      setDescargando(false);
    }
  };

  return (
  <div className="page-container">
    <h2 className="page-title">Inicio</h2>

    {/* 🔵 Banner superior */}
    <div className="dashboard-banner">
      <div>
        <h1 style={{ margin: 0 }}>Bienvenido a UniPlanner 🎓</h1>
        <p className="text-muted">
          Organiza tus estudios con una interfaz limpia, moderna y eficiente.
        </p>
      </div>

      <img
        src="/src/assets/logo2.png"
        alt="Decoración"
        className="banner-img"
      />
    </div>

    {/* Resumen rápido */}
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Resumen general</h3>
      {mensaje && <div className="alert-success">{mensaje}</div>}
      {error && <div className="alert-error">{error}</div>}

      <p className="text-muted" style={{ marginTop: '0.75rem' }}>
        Desde aquí puedes ver un resumen rápido de tu organización académica.
        Utiliza el menú superior para gestionar materias, tareas y exámenes.
      </p>
    </div>

    {/* Acciones rápidas */}
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Acciones rápidas</h3>
      <p className="text-muted" style={{ marginBottom: '0.75rem' }}>
        Genera un reporte en PDF con tus materias, tareas y exámenes registrados.
      </p>
      <button
        className="btn btn-primary"
        onClick={handleDescargarPDF}
        disabled={descargando}
      >
        {descargando ? 'Generando PDF...' : 'Descargar reporte PDF'}
      </button>
    </div>
  </div>
);

}

export default DashboardPage;
