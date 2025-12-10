import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

function evaluarFuerzaPassword(password) {
  let puntos = 0;
  if (password.length >= 6) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  if (puntos <= 1) return 'Débil';
  if (puntos === 2 || puntos === 3) return 'Media';
  return 'Fuerte';
}

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeOk, setMensajeOk] = useState('');
  const [nivel, setNivel] = useState('Débil');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (value) => {
    setPassword(value);
    setNivel(evaluarFuerzaPassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeOk('');

    if (password !== confirmar) {
      setMensajeError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await register(nombre, email, password);
      setMensajeOk('Registro exitoso, ahora puedes iniciar sesión');
      // pequeña pausa opcional antes de redirigir
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.mensaje || 'Error al registrarse';
      setMensajeError(msg);
    } finally {
      setCargando(false);
    }
  };

  // Color visual para el nivel de contraseña
  const getBadgeStyle = () => {
    if (nivel === 'Débil') return { background: '#fee2e2', color: '#b91c1c' };
    if (nivel === 'Media') return { background: '#fef9c3', color: '#92400e' };
    return { background: '#dcfce7', color: '#166534' }; // Fuerte
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
          Crear cuenta
        </h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          Regístrate para empezar a organizar tus materias, tareas y exámenes.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              className="input"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

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
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
            <small className="text-muted">
              La contraseña debe tener mayúsculas, números y símbolos para ser más segura.
            </small>
            <div
              style={{
                display: 'inline-block',
                marginTop: '0.25rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                ...getBadgeStyle()
              }}
            >
              Seguridad: {nivel}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              className="input"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {mensajeError && <div className="alert-error">{mensajeError}</div>}
        {mensajeOk && <div className="alert-success">{mensajeOk}</div>}

        <p className="text-muted" style={{ marginTop: '0.75rem' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
