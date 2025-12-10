import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setCargando(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.mensaje || 'Error al iniciar sesión';
      setMensajeError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
          Iniciar sesión
        </h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          Accede a tu panel para gestionar materias, tareas y exámenes.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {mensajeError && <div className="alert-error">{mensajeError}</div>}

        <p className="text-muted" style={{ marginTop: '0.75rem' }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
