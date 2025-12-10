import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MateriasPage from './pages/MateriasPage';
import TareasPage from './pages/TareasPage';
import ExamenesPage from './pages/ExamenesPage';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';
import logo from './assets/logo2.png';

function App() {
  const logged = isAuthenticated();
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        {/* Marca con logo */}
        <div className="navbar-brand">
          <img src={logo} alt="UniPlanner" className="navbar-logo" />
          <div className="navbar-brand-text">
            <span className="navbar-title">UniPlanner</span>
            <span className="navbar-subtitle">Gestión académica para estudiantes</span>
          </div>
        </div>

        {/* Links */}
        <div className="navbar-links">
          {!logged && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          )}

          {logged && (
            <>
              <span className="navbar-user">Hola, {user?.nombre}</span>
              <Link to="/">Inicio</Link>
              <Link to="/materias">Materias</Link>
              <Link to="/tareas">Tareas</Link>
              <Link to="/examenes">Exámenes</Link>
              <button className="btn btn-danger" onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas (ajusta según tu PrivateRoute si lo usas) */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/materias" element={<MateriasPage />} />
          <Route path="/tareas" element={<TareasPage />} />
          <Route path="/examenes" element={<ExamenesPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <strong>UniPlanner</strong> · Proyecto final Programación Web III
        </div>
        <div className="footer-right">
          <span>Desarrollado por estudiantes UMSA</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
