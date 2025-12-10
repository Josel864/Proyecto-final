const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  crearMateria,
  obtenerMaterias,
  obtenerMateriaPorId,
  actualizarMateria,
  eliminarMateria
} = require('../controllers/materias.controller');

// Todas estas rutas requieren estar logueado
router.use(authMiddleware);

// Crear materia
router.post('/', crearMateria);

// Listar materias
router.get('/', obtenerMaterias);

// Obtener una materia por id
router.get('/:id', obtenerMateriaPorId);

// Actualizar materia
router.put('/:id', actualizarMateria);

// Borrado lógico de materia
router.delete('/:id', eliminarMateria);

module.exports = router;
