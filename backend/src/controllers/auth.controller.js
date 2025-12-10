const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const { pool } = require('../config/db');

// Función para registrar log de acceso
async function registrarLog({ id_usuario = null, ip, navegador, evento }) {
  const sql = `
    INSERT INTO logs_acceso (id_usuario, ip, navegador, evento)
    VALUES (?, ?, ?, ?)
  `;
  await pool.query(sql, [id_usuario, ip, navegador, evento]);
}

function obtenerIp(req) {
  // Si en algún momento usas proxy, puedes agregar: req.headers['x-forwarded-for']
  return req.ip || req.connection.remoteAddress || null;
}

function obtenerNavegador(req) {
  return req.headers['user-agent'] || 'desconocido';
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y password son obligatorios' });
    }

    // Validación básica de longitud
    if (password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // ¿Ya existe un usuario con ese email?
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario registrado con ese email' });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const id_usuario = await Usuario.crearUsuario({
      nombre,
      email,
      password_hash
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id_usuario,
        nombre,
        email,
        rol: 'ESTUDIANTE'
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const ip = obtenerIp(req);
    const navegador = obtenerNavegador(req);

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y password son obligatorios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario) {
      // Log de intento fallido sin usuario
      await registrarLog({ ip, navegador, evento: 'LOGIN_FALLIDO' });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      await registrarLog({ id_usuario: usuario.id_usuario, ip, navegador, evento: 'LOGIN_FALLIDO' });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    if (usuario.estado !== 1) {
      return res.status(403).json({ mensaje: 'Usuario inactivo o bloqueado' });
    }

    // Generar token JWT
    const payload = {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    // Registrar log de login exitoso
    await registrarLog({ id_usuario: usuario.id_usuario, ip, navegador, evento: 'LOGIN' });

    return res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// POST /api/auth/logout
async function logout(req, res) {
  try {
    const ip = obtenerIp(req);
    const navegador = obtenerNavegador(req);
    const { id_usuario } = req.body; // en el futuro lo sacaremos del token

    if (id_usuario) {
      await registrarLog({ id_usuario, ip, navegador, evento: 'LOGOUT' });
    }

    return res.json({ mensaje: 'Logout registrado' });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

module.exports = {
  register,
  login,
  logout
};
