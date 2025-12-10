import { useEffect, useState } from 'react';
import { obtenerMaterias } from '../services/materiasService';
import {
  obtenerTareas,
  obtenerTareasPorMateria,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from '../services/tareasService';

function TareasPage() {
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('TODAS');
  const [form, setForm] = useState({
    id_materia: '',
    titulo: '',
    descripcion: '',
    fecha_entrega: '',
    estado: 'PENDIENTE',
    prioridad: 'MEDIA'
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar materias y tareas al inicio
  useEffect(() => {
    async function cargarInicial() {
      try {
        const mats = await obtenerMaterias();
        setMaterias(mats);
        if (mats.length > 0) {
          setForm((prev) => ({ ...prev, id_materia: mats[0].id_materia }));
        }

        const ts = await obtenerTareas();
        setTareas(ts);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.mensaje || 'Error al cargar datos';
        setError(msg);
      }
    }

    cargarInicial();
  }, []);

  // Cambiar filtro de materia
  const handleMateriaFiltroChange = async (e) => {
    const value = e.target.value;
    setMateriaSeleccionada(value);
    setMensaje('');
    setError('');

    try {
      if (value === 'TODAS') {
        const ts = await obtenerTareas();
        setTareas(ts);
      } else {
        const ts = await obtenerTareasPorMateria(value);
        setTareas(ts);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al filtrar tareas';
      setError(msg);
    }
  };

  // Cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!form.id_materia || !form.titulo.trim() || !form.fecha_entrega) {
      setError('Materia, título y fecha de entrega son obligatorios.');
      return;
    }

    try {
      if (editandoId) {
        await actualizarTarea(editandoId, form);
        setMensaje('Tarea actualizada correctamente');
      } else {
        await crearTarea(form);
        setMensaje('Tarea creada correctamente');
      }

      // refrescar listado según filtro actual
      if (
        materiaSeleccionada === 'TODAS' ||
        materiaSeleccionada === form.id_materia.toString()
      ) {
        const ts =
          materiaSeleccionada === 'TODAS'
            ? await obtenerTareas()
            : await obtenerTareasPorMateria(form.id_materia);
        setTareas(ts);
      }

      setForm((prev) => ({
        ...prev,
        titulo: '',
        descripcion: '',
        fecha_entrega: '',
        estado: 'PENDIENTE',
        prioridad: 'MEDIA'
      }));
      setEditandoId(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al guardar la tarea';
      setError(msg);
    }
  };

  const handleEditar = (tarea) => {
    setEditandoId(tarea.id_tarea);
    setForm({
      id_materia: tarea.id_materia,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      fecha_entrega: tarea.fecha_entrega,
      estado: tarea.estado,
      prioridad: tarea.prioridad
    });
    setMensaje('');
    setError('');
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm((prev) => ({
      ...prev,
      titulo: '',
      descripcion: '',
      fecha_entrega: '',
      estado: 'PENDIENTE',
      prioridad: 'MEDIA'
    }));
  };

  const handleEliminar = async (id_tarea) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    setMensaje('');
    setError('');

    try {
      await eliminarTarea(id_tarea);
      setMensaje('Tarea eliminada correctamente');

      if (materiaSeleccionada === 'TODAS') {
        const ts = await obtenerTareas();
        setTareas(ts);
      } else {
        const ts = await obtenerTareasPorMateria(materiaSeleccionada);
        setTareas(ts);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al eliminar la tarea';
      setError(msg);
    }
  };

  // Color lateral según prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'ALTA':
        return '#dc2626'; // rojo
      case 'MEDIA':
        return '#3b82f6'; // azul
      case 'BAJA':
      default:
        return '#6b7280'; // gris
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Tareas</h2>

      {/* Filtro por materia */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Filtro</h3>
        <div className="form-group">
          <label className="form-label">Filtrar por materia</label>
          <select
            className="select"
            value={materiaSeleccionada}
            onChange={handleMateriaFiltroChange}
          >
            <option value="TODAS">Todas</option>
            {materias.map((m) => (
              <option key={m.id_materia} value={m.id_materia}>
                {m.nombre}
              </option>
            ))}
          </select>
          <p className="text-muted">
            Puedes ver todas las tareas o solo las asociadas a una materia específica.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {editandoId ? 'Editar tarea' : 'Nueva tarea'}
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
              placeholder="Ej: Informe de laboratorio"
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
              placeholder="Detalles importantes, formato de entrega, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de entrega *</label>
            <input
              className="input"
              type="date"
              name="fecha_entrega"
              value={form.fecha_entrega}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              className="select"
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="VENCIDA">Vencida</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              className="select"
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>

          {mensaje && <div className="alert-success">{mensaje}</div>}
          {error && <div className="alert-error">{error}</div>}
        </form>
      </div>

      {/* Listado de tareas */}
      <h3 style={{ marginTop: '1.5rem' }}>Listado de tareas</h3>
      <div className="card-list">
        {tareas.length === 0 && (
          <p className="text-muted">No hay tareas para mostrar.</p>
        )}

        {tareas.map((t) => (
          <div
            key={t.id_tarea}
            className="card tarea-card"
            style={{ borderLeftColor: getPrioridadColor(t.prioridad) }}
          >
            <strong>{t.titulo}</strong>{' '}
            <span className="text-muted">
              ({t.estado} · Prioridad: {t.prioridad})
            </span>
            <p className="text-muted">
              Materia ID: {t.id_materia} · Entrega: {t.fecha_entrega}
            </p>
            {t.descripcion && <p>{t.descripcion}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleEditar(t)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleEliminar(t.id_tarea)}
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

export default TareasPage;
