const Tarea = require('../models/tarea.model');

// POST /api/tareas
async function crearTarea(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_materia, titulo, descripcion, fecha_entrega, estado, prioridad } = req.body;

    if (!id_materia || !titulo || !fecha_entrega) {
      return res.status(400).json({
        mensaje: 'id_materia, titulo y fecha_entrega son obligatorios'
      });
    }

    const id_tarea = await Tarea.crearTarea({
      id_materia,
      titulo,
      descripcion,
      fecha_entrega,
      estado,
      prioridad
    });

    return res.status(201).json({
      mensaje: 'Tarea creada correctamente',
      tarea: {
        id_tarea,
        id_materia,
        titulo,
        descripcion,
        fecha_entrega,
        estado: estado || 'PENDIENTE',
        prioridad: prioridad || 'MEDIA'
      }
    });
  } catch (error) {
    console.error('Error en crearTarea:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/tareas (todas las tareas del usuario)
async function obtenerTodasLasTareas(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const tareas = await Tarea.obtenerTodasTareasPorUsuario(id_usuario);
    return res.json(tareas);
  } catch (error) {
    console.error('Error en obtenerTodasLasTareas:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/tareas/materia/:id_materia
async function obtenerTareasPorMateria(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_materia = req.params.id_materia;

    const tareas = await Tarea.obtenerTareasPorMateria(id_materia, id_usuario);
    return res.json(tareas);
  } catch (error) {
    console.error('Error en obtenerTareasPorMateria:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/tareas/:id
async function obtenerTareaPorId(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_tarea = req.params.id;

    const tarea = await Tarea.obtenerTareaPorId(id_tarea, id_usuario);
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    return res.json(tarea);
  } catch (error) {
    console.error('Error en obtenerTareaPorId:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// PUT /api/tareas/:id
async function actualizarTarea(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_tarea = req.params.id;
    const { titulo, descripcion, fecha_entrega, estado, prioridad } = req.body;

    if (!titulo || !fecha_entrega) {
      return res.status(400).json({
        mensaje: 'titulo y fecha_entrega son obligatorios'
      });
    }

    const filasAfectadas = await Tarea.actualizarTarea(id_tarea, id_usuario, {
      titulo,
      descripcion,
      fecha_entrega,
      estado,
      prioridad
    });

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    return res.json({ mensaje: 'Tarea actualizada correctamente' });
  } catch (error) {
    console.error('Error en actualizarTarea:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// DELETE /api/tareas/:id
async function eliminarTarea(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_tarea = req.params.id;

    const filasAfectadas = await Tarea.eliminarTarea(id_tarea, id_usuario);

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    return res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en eliminarTarea:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

module.exports = {
  crearTarea,
  obtenerTodasLasTareas,
  obtenerTareasPorMateria,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea
};
