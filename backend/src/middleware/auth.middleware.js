const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'No se proporcionó token de autorización' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id_usuario, rol, iat, exp }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verificando token:', error.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
