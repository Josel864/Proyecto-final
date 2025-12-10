const { pool } = require('../config/db');

const Usuario = {
  async crearUsuario({ nombre, email, password_hash, rol = 'ESTUDIANTE' }) {
    const sql = `
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [nombre, email, password_hash, rol]);
    return result.insertId;
  },

  async buscarPorEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  },

  async buscarPorId(id_usuario) {
    const sql = `SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [id_usuario]);
    return rows[0];
  }
};

module.exports = Usuario;
