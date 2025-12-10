const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  crearTarea,
  obtenerTodasLasTareas,
  obtenerTareasPorMateria,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea
} = require('../controllers/tareas.controller');

// Todas requieren estar logueado
router.use(authMiddleware);

// Crear tarea
router.post('/', crearTarea);

// Listar todas las tareas del usuario
router.get('/', obtenerTodasLasTareas);

// Listar tareas de una materia específica
router.get('/materia/:id_materia', obtenerTareasPorMateria);

// Obtener una tarea por id
router.get('/:id', obtenerTareaPorId);

// Actualizar tarea
router.put('/:id', actualizarTarea);

// Eliminar tarea
router.delete('/:id', eliminarTarea);

module.exports = router;
