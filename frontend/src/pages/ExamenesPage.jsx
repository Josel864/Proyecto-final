import { useEffect, useState } from 'react';
import { obtenerMaterias } from '../services/materiasService';
import {
  obtenerExamenes,
  obtenerExamenesPorMateria,
  crearExamen,
  actualizarExamen,
  eliminarExamen
} from '../services/examenesService';

function ExamenesPage() {
  const [materias, setMaterias] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('TODAS');

  const [form, setForm] = useState({
    id_materia: '',
    titulo: '',
    tipo: 'OTRO',
    fecha_examen: '',
    porcentaje_nota: '',
    descripcion: ''
  });

  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarInicial() {
      try {
        const mats = await obtenerMaterias();
        setMaterias(mats);

        if (mats.length > 0) {
          setForm((f) => ({ ...f, id_materia: mats[0].id_materia }));
        }

        const ex = await obtenerExamenes();
        setExamenes(ex);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.mensaje || 'Error al cargar datos';
        setError(msg);
      }
    }
    cargarInicial();
  }, []);

  // Filtro por materia
  const handleFiltro = async (e) => {
    const value = e.target.value;
    setMateriaSeleccionada(value);
    setMensaje('');
    setError('');

    try {
      if (value === 'TODAS') {
        const ex = await obtenerExamenes();
        setExamenes(ex);
      } else {
        const ex = await obtenerExamenesPorMateria(value);
        setExamenes(ex);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al filtrar exámenes';
      setError(msg);
    }
  };

  // Cambios formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Guardar examen
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!form.id_materia || !form.titulo.trim() || !form.fecha_examen) {
      setError('El título, materia y fecha son obligatorios.');
      return;
    }

    try {
      if (editandoId) {
        await actualizarExamen(editandoId, {
          ...form,
          porcentaje_nota: form.porcentaje_nota
            ? Number(form.porcentaje_nota)
            : null
        });
        setMensaje('Examen actualizado correctamente');
      } else {
        await crearExamen({
          ...form,
          porcentaje_nota: form.porcentaje_nota
            ? Number(form.porcentaje_nota)
            : null
        });
        setMensaje('Examen creado correctamente');
      }

      // Recargar lista
      const ex =
        materiaSeleccionada === 'TODAS'
          ? await obtenerExamenes()
          : await obtenerExamenesPorMateria(materiaSeleccionada);

      setExamenes(ex);

      // limpiar
      setForm((f) => ({
        ...f,
        titulo: '',
        descripcion: '',
        tipo: 'OTRO',
        fecha_examen: '',
        porcentaje_nota: ''
      }));
      setEditandoId(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al guardar examen';
      setError(msg);
    }
  };

  const handleEditar = (ex) => {
    setEditandoId(ex.id_examen);
    setForm({
      id_materia: ex.id_materia,
      titulo: ex.titulo,
      tipo: ex.tipo,
      fecha_examen: ex.fecha_examen,
      porcentaje_nota: ex.porcentaje_nota || '',
      descripcion: ex.descripcion || ''
    });
    setMensaje('');
    setError('');
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setForm((f) => ({
      ...f,
      titulo: '',
      descripcion: '',
      tipo: 'OTRO',
      fecha_examen: '',
      porcentaje_nota: ''
    }));
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este examen?')) return;
    setMensaje('');
    setError('');

    try {
      await eliminarExamen(id);
      setMensaje('Examen eliminado correctamente');

      const ex =
        materiaSeleccionada === 'TODAS'
          ? await obtenerExamenes()
          : await obtenerExamenesPorMateria(materiaSeleccionada);

      setExamenes(ex);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al eliminar examen';
      setError(msg);
    }
  };

  // color por tipo de examen (solo visual)
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'PARCIAL':
        return '#3b82f6'; // azul
      case 'FINAL':
        return '#10b981'; // verde
      case 'QUIZ':
        return '#f59e0b'; // amarillo
      default:
        return '#6b7280'; // gris
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Exámenes</h2>

      {/* Filtro */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Filtro</h3>
        <div className="form-group">
          <label className="form-label">Filtrar por materia</label>
          <select
            className="select"
            value={materiaSeleccionada}
            onChange={handleFiltro}
          >
            <option value="TODAS">Todas</option>
            {materias.map((m) => (
              <option key={m.id_materia} value={m.id_materia}>
                {m.nombre}
              </option>
            ))}
          </select>
          <p className="text-muted">
            Visualiza todos los exámenes o solo los asociados a una materia.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {editandoId ? 'Editar examen' : 'Nuevo examen'}
        </h3>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Materia *</label>
            <select
              className="select"
              name="id_materia"
              value={form.id_materia}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una materia</option>
              {materias.map((m) => (
                <option key={m.id_materia} value={m.id_materia}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              className="input"
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Parcial 1 de Programación"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              className="select"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
            >
              <option value="PARCIAL">Parcial</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha *</label>
            <input
              className="input"
              type="date"
              name="fecha_examen"
              value={form.fecha_examen}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Porcentaje (opcional)</label>
            <input
              className="input"
              type="number"
              name="porcentaje_nota"
              value={form.porcentaje_nota}
              onChange={handleChange}
              max={100}
              min={0}
              placeholder="Ej: 30"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              placeholder="Temas incluidos, formato del examen, etc."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            )}
          </div>

          {mensaje && <div className="alert-success">{mensaje}</div>}
          {error && <div className="alert-error">{error}</div>}
        </form>
      </div>

      {/* Listado */}
      <h3 style={{ marginTop: '1.5rem' }}>Listado de exámenes</h3>
      <div className="card-list">
        {examenes.length === 0 && (
          <p className="text-muted">No hay exámenes registrados.</p>
        )}

        {examenes.map((ex) => (
          <div
            key={ex.id_examen}
            className="card examen-card"
            style={{ borderLeftColor: getTipoColor(ex.tipo) }}
          >
            <strong>{ex.titulo}</strong>{' '}
            <span className="text-muted">({ex.tipo})</span>

            <p className="text-muted">
              Fecha: {ex.fecha_examen} · Porcentaje:{' '}
              {ex.porcentaje_nota || 'N/A'}%
            </p>

            {ex.descripcion && <p>{ex.descripcion}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleEditar(ex)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleEliminar(ex.id_examen)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamenesPage;
