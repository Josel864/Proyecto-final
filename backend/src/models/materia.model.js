const { pool } = require('../config/db');

const Materia = {
  async crearMateria({ id_usuario, nombre, descripcion, semestre, anio, color }) {
    const sql = `
      INSERT INTO materias (id_usuario, nombre, descripcion, semestre, anio, color)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      id_usuario,
      nombre,
      descripcion || null,
      semestre || null,
      anio || null,
      color || null
    ]);
    return result.insertId;
  },

  async obtenerMateriasPorUsuario(id_usuario) {
    const sql = `
      SELECT
        id_materia,
        nombre,
        descripcion,
        semestre,
        anio,
        color,
        activo,
        eliminado_logico,
        fecha_creacion
      FROM materias
      WHERE id_usuario = ?
        AND eliminado_logico = 0
      ORDER BY fecha_creacion DESC
    `;
    const [rows] = await pool.query(sql, [id_usuario]);
    return rows;
  },

  async obtenerMateriaPorId(id_materia, id_usuario) {
    const sql = `
      SELECT
        id_materia,
        nombre,
        descripcion,
        semestre,
        anio,
        color,
        activo,
        eliminado_logico,
        fecha_creacion
      FROM materias
      WHERE id_materia = ?
        AND id_usuario = ?
        AND eliminado_logico = 0
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id_materia, id_usuario]);
    return rows[0];
  },

  async actualizarMateria(id_materia, id_usuario, datos) {
    const { nombre, descripcion, semestre, anio, color, activo } = datos;

    const sql = `
      UPDATE materias
      SET nombre = ?,
          descripcion = ?,
          semestre = ?,
          anio = ?,
          color = ?,
          activo = ?
      WHERE id_materia = ?
        AND id_usuario = ?
        AND eliminado_logico = 0
    `;

    const [result] = await pool.query(sql, [
      nombre,
      descripcion || null,
      semestre || null,
      anio || null,
      color || null,
      activo !== undefined ? activo : 1,
      id_materia,
      id_usuario
    ]);

    return result.affectedRows; // 1 si actualizó, 0 si no encontró
  },

  async eliminarLogico(id_materia, id_usuario) {
    const sql = `
      UPDATE materias
      SET eliminado_logico = 1
      WHERE id_materia = ?
        AND id_usuario = ?
        AND eliminado_logico = 0
    `;
    const [result] = await pool.query(sql, [id_materia, id_usuario]);
    return result.affectedRows;
  }
};

module.exports = Materia;
