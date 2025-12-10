const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { generarReporteResumen } = require('../controllers/reportes.controller');

// Todas las rutas de reportes requieren estar logueado
router.use(authMiddleware);

// GET /api/reportes/resumen  → genera y descarga PDF
router.get('/resumen', generarReporteResumen);

module.exports = router;
