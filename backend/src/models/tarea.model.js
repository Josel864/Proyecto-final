const { pool } = require('../config/db');

const Tarea = {
  async crearTarea({ id_materia, titulo, descripcion, fecha_entrega, estado, prioridad }) {
    const sql = `
      INSERT INTO tareas (id_materia, titulo, descripcion, fecha_entrega, estado, prioridad)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      id_materia,
      titulo,
      descripcion || null,
      fecha_entrega,
      estado || 'PENDIENTE',
      prioridad || 'MEDIA'
    ]);
    return result.insertId;
  },

  async obtenerTareasPorMateria(id_materia, id_usuario) {
    const sql = `
      SELECT t.*
      FROM tareas t
      INNER JOIN materias m ON t.id_materia = m.id_materia
      WHERE t.id_materia = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
      ORDER BY t.fecha_entrega ASC
    `;
    const [rows] = await pool.query(sql, [id_materia, id_usuario]);
    return rows;
  },

  async obtenerTareaPorId(id_tarea, id_usuario) {
    const sql = `
      SELECT t.*
      FROM tareas t
      INNER JOIN materias m ON t.id_materia = m.id_materia
      WHERE t.id_tarea = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id_tarea, id_usuario]);
    return rows[0];
  },

  async obtenerTodasTareasPorUsuario(id_usuario) {
    const sql = `
      SELECT 
        t.*,
        m.nombre AS nombre_materia
      FROM tareas t
      INNER JOIN materias m ON t.id_materia = m.id_materia
      WHERE m.id_usuario = ?
        AND m.eliminado_logico = 0
      ORDER BY t.fecha_entrega ASC
    `;
    const [rows] = await pool.query(sql, [id_usuario]);
    return rows;
  },

  async actualizarTarea(id_tarea, id_usuario, datos) {
    const { titulo, descripcion, fecha_entrega, estado, prioridad } = datos;

    const sql = `
      UPDATE tareas t
      INNER JOIN materias m ON t.id_materia = m.id_materia
      SET t.titulo = ?,
          t.descripcion = ?,
          t.fecha_entrega = ?,
          t.estado = ?,
          t.prioridad = ?,
          t.fecha_actualizacion = NOW()
      WHERE t.id_tarea = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
    `;

    const [result] = await pool.query(sql, [
      titulo,
      descripcion || null,
      fecha_entrega,
      estado || 'PENDIENTE',
      prioridad || 'MEDIA',
      id_tarea,
      id_usuario
    ]);

    return result.affectedRows;
  },

  async eliminarTarea(id_tarea, id_usuario) {
    const sql = `
      DELETE t
      FROM tareas t
      INNER JOIN materias m ON t.id_materia = m.id_materia
      WHERE t.id_tarea = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
    `;
    const [result] = await pool.query(sql, [id_tarea, id_usuario]);
    return result.affectedRows;
  }
};

module.exports = Tarea;
