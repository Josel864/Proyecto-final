const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  crearExamen,
  obtenerTodosLosExamenes,
  obtenerExamenesPorMateria,
  obtenerExamenPorId,
  actualizarExamen,
  eliminarExamen
} = require('../controllers/examenes.controller');

// Todas requieren estar logueado
router.use(authMiddleware);

// Crear examen
router.post('/', crearExamen);

// Listar todos los examenes del usuario
router.get('/', obtenerTodosLosExamenes);

// Listar examenes de una materia específica
router.get('/materia/:id_materia', obtenerExamenesPorMateria);

// Obtener un examen por id
router.get('/:id', obtenerExamenPorId);

// Actualizar examen
router.put('/:id', actualizarExamen);

// Eliminar examen
router.delete('/:id', eliminarExamen);

module.exports = router;
