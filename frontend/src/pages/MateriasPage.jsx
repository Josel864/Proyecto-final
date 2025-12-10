import { useEffect, useState } from 'react';
import {
  obtenerMaterias,
  crearMateria,
  actualizarMateria,
  eliminarMateria
} from '../services/materiasService';

function MateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    semestre: '',
    anio: '',
    color: '#4f46e5'
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  async function cargarMaterias() {
    try {
      const data = await obtenerMaterias();
      setMaterias(data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al cargar materias';
      setError(msg);
    }
  }

  useEffect(() => {
    cargarMaterias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      if (editandoId) {
        await actualizarMateria(editandoId, {
          ...form,
          anio: form.anio ? Number(form.anio) : null,
          activo: 1
        });
        setMensaje('Materia actualizada correctamente');
      } else {
        await crearMateria({
          ...form,
          anio: form.anio ? Number(form.anio) : null
        });
        setMensaje('Materia creada correctamente');
      }

      setForm({
        nombre: '',
        descripcion: '',
        semestre: '',
        anio: '',
        color: '#4f46e5'
      });
      setEditandoId(null);
      await cargarMaterias();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al guardar la materia';
      setError(msg);
    }
  };

  const handleEditar = (materia) => {
    setEditandoId(materia.id_materia);
    setForm({
      nombre: materia.nombre || '',
      descripcion: materia.descripcion || '',
      semestre: materia.semestre || '',
      anio: materia.anio || '',
      color: materia.color || '#4f46e5'
    });
    setMensaje('');
    setError('');
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm({
      nombre: '',
      descripcion: '',
      semestre: '',
      anio: '',
      color: '#4f46e5'
    });
  };

  const handleEliminar = async (id_materia) => {
    if (!window.confirm('¿Seguro que deseas eliminar (lógicamente) esta materia?')) return;

    setMensaje('');
    setError('');

    try {
      await eliminarMateria(id_materia);
      setMensaje('Materia eliminada correctamente');
      await cargarMaterias();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || 'Error al eliminar la materia';
      setError(msg);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Materias</h2>

      {/* FORMULARIO */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {editandoId ? 'Editar materia' : 'Nueva materia'}
        </h3>

        <form onSubmit={handleSubmit} className="form">

          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              className="input"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
            />
          </div>

          {/* Semestre y Año */}
          <div className="form-group">
            <label className="form-label">Semestre</label>
            <select
              className="select"
              name="semestre"
              value={form.semestre}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Año</label>
            <input
              className="input"
              type="number"
              min="2000"
              max="2100"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              placeholder="Ej: 2025"
            />
          </div>

          {/* Color */}
          <div className="form-group">
            <label className="form-label">Color</label>
            <input
              className="input"
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
            />
          </div>

          {/* Botones */}
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

      {/* LISTADO */}
      <h3 style={{ marginTop: '1.5rem' }}>Listado de materias</h3>

      <div className="card-list">
        {materias.length === 0 && (
          <p className="text-muted">No tienes materias registradas.</p>
        )}

        {materias.map((m) => (
          <div
            key={m.id_materia}
            className="card materia-card"
            style={{ borderLeftColor: m.color || '#4f46e5' }}
          >
            <strong>{m.nombre}</strong>

            <p className="text-muted">
              Semestre: {m.semestre || '—'} · Año: {m.anio || '—'}
            </p>

            {m.descripcion && <p>{m.descripcion}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleEditar(m)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleEliminar(m.id_materia)}
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

export default MateriasPage;
