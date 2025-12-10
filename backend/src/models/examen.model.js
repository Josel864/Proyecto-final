const { pool } = require('../config/db');

const Examen = {
  async crearExamen({ id_materia, titulo, tipo, fecha_examen, porcentaje_nota, descripcion }) {
    const sql = `
      INSERT INTO examenes (id_materia, titulo, tipo, fecha_examen, porcentaje_nota, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      id_materia,
      titulo,
      tipo || 'OTRO',
      fecha_examen,
      porcentaje_nota || null,
      descripcion || null
    ]);
    return result.insertId;
  },

  async obtenerExamenesPorMateria(id_materia, id_usuario) {
    const sql = `
      SELECT e.*
      FROM examenes e
      INNER JOIN materias m ON e.id_materia = m.id_materia
      WHERE e.id_materia = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
      ORDER BY e.fecha_examen ASC
    `;
    const [rows] = await pool.query(sql, [id_materia, id_usuario]);
    return rows;
  },

  async obtenerTodosExamenesPorUsuario(id_usuario) {
    const sql = `
      SELECT 
        e.*,
        m.nombre AS nombre_materia
      FROM examenes e
      INNER JOIN materias m ON e.id_materia = m.id_materia
      WHERE m.id_usuario = ?
        AND m.eliminado_logico = 0
      ORDER BY e.fecha_examen ASC
    `;
    const [rows] = await pool.query(sql, [id_usuario]);
    return rows;
  },

  async obtenerExamenPorId(id_examen, id_usuario) {
    const sql = `
      SELECT e.*
      FROM examenes e
      INNER JOIN materias m ON e.id_materia = m.id_materia
      WHERE e.id_examen = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id_examen, id_usuario]);
    return rows[0];
  },

  async actualizarExamen(id_examen, id_usuario, datos) {
    const { titulo, tipo, fecha_examen, porcentaje_nota, descripcion } = datos;

    const sql = `
      UPDATE examenes e
      INNER JOIN materias m ON e.id_materia = m.id_materia
      SET e.titulo = ?,
          e.tipo = ?,
          e.fecha_examen = ?,
          e.porcentaje_nota = ?,
          e.descripcion = ?
      WHERE e.id_examen = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
    `;

    const [result] = await pool.query(sql, [
      titulo,
      tipo || 'OTRO',
      fecha_examen,
      porcentaje_nota || null,
      descripcion || null,
      id_examen,
      id_usuario
    ]);

    return result.affectedRows;
  },

  async eliminarExamen(id_examen, id_usuario) {
    const sql = `
      DELETE e
      FROM examenes e
      INNER JOIN materias m ON e.id_materia = m.id_materia
      WHERE e.id_examen = ?
        AND m.id_usuario = ?
        AND m.eliminado_logico = 0
    `;
    const [result] = await pool.query(sql, [id_examen, id_usuario]);
    return result.affectedRows;
  }
};

module.exports = Examen;
