const Examen = require('../models/examen.model');

// POST /api/examenes
async function crearExamen(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_materia, titulo, tipo, fecha_examen, porcentaje_nota, descripcion } = req.body;

    if (!id_materia || !titulo || !fecha_examen) {
      return res.status(400).json({
        mensaje: 'id_materia, titulo y fecha_examen son obligatorios'
      });
    }

    const id_examen = await Examen.crearExamen({
      id_materia,
      titulo,
      tipo,
      fecha_examen,
      porcentaje_nota,
      descripcion
    });

    return res.status(201).json({
      mensaje: 'Examen creado correctamente',
      examen: {
        id_examen,
        id_materia,
        titulo,
        tipo: tipo || 'OTRO',
        fecha_examen,
        porcentaje_nota: porcentaje_nota || null,
        descripcion
      }
    });
  } catch (error) {
    console.error('Error en crearExamen:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/examenes
async function obtenerTodosLosExamenes(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const examenes = await Examen.obtenerTodosExamenesPorUsuario(id_usuario);
    return res.json(examenes);
  } catch (error) {
    console.error('Error en obtenerTodosLosExamenes:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/examenes/materia/:id_materia
async function obtenerExamenesPorMateria(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_materia = req.params.id_materia;

    const examenes = await Examen.obtenerExamenesPorMateria(id_materia, id_usuario);
    return res.json(examenes);
  } catch (error) {
    console.error('Error en obtenerExamenesPorMateria:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/examenes/:id
async function obtenerExamenPorId(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_examen = req.params.id;

    const examen = await Examen.obtenerExamenPorId(id_examen, id_usuario);
    if (!examen) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    return res.json(examen);
  } catch (error) {
    console.error('Error en obtenerExamenPorId:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// PUT /api/examenes/:id
async function actualizarExamen(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_examen = req.params.id;
    const { titulo, tipo, fecha_examen, porcentaje_nota, descripcion } = req.body;

    if (!titulo || !fecha_examen) {
      return res.status(400).json({
        mensaje: 'titulo y fecha_examen son obligatorios'
      });
    }

    const filasAfectadas = await Examen.actualizarExamen(id_examen, id_usuario, {
      titulo,
      tipo,
      fecha_examen,
      porcentaje_nota,
      descripcion
    });

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    return res.json({ mensaje: 'Examen actualizado correctamente' });
  } catch (error) {
    console.error('Error en actualizarExamen:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// DELETE /api/examenes/:id
async function eliminarExamen(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_examen = req.params.id;

    const filasAfectadas = await Examen.eliminarExamen(id_examen, id_usuario);

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    return res.json({ mensaje: 'Examen eliminado correctamente' });
  } catch (error) {
    console.error('Error en eliminarExamen:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

module.exports = {
  crearExamen,
  obtenerTodosLosExamenes,
  obtenerExamenesPorMateria,
  obtenerExamenPorId,
  actualizarExamen,
  eliminarExamen
};
