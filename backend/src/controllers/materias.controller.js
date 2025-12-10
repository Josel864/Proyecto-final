const Materia = require('../models/materia.model');

// POST /api/materias
async function crearMateria(req, res) {
  try {
    const id_usuario = req.user.id_usuario; // viene del token
    const { nombre, descripcion, semestre, anio, color } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre de la materia es obligatorio' });
    }

    const id_materia = await Materia.crearMateria({
      id_usuario,
      nombre,
      descripcion,
      semestre,
      anio,
      color
    });

    return res.status(201).json({
      mensaje: 'Materia creada correctamente',
      materia: {
        id_materia,
        nombre,
        descripcion,
        semestre,
        anio,
        color
      }
    });
  } catch (error) {
    console.error('Error en crearMateria:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/materias
async function obtenerMaterias(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const materias = await Materia.obtenerMateriasPorUsuario(id_usuario);
    return res.json(materias);
  } catch (error) {
    console.error('Error en obtenerMaterias:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// GET /api/materias/:id
async function obtenerMateriaPorId(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_materia = req.params.id;

    const materia = await Materia.obtenerMateriaPorId(id_materia, id_usuario);

    if (!materia) {
      return res.status(404).json({ mensaje: 'Materia no encontrada' });
    }

    return res.json(materia);
  } catch (error) {
    console.error('Error en obtenerMateriaPorId:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// PUT /api/materias/:id
async function actualizarMateria(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_materia = req.params.id;
    const { nombre, descripcion, semestre, anio, color, activo } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre de la materia es obligatorio' });
    }

    const filasAfectadas = await Materia.actualizarMateria(id_materia, id_usuario, {
      nombre,
      descripcion,
      semestre,
      anio,
      color,
      activo
    });

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Materia no encontrada o ya eliminada' });
    }

    return res.json({ mensaje: 'Materia actualizada correctamente' });
  } catch (error) {
    console.error('Error en actualizarMateria:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

// DELETE /api/materias/:id (borrado lógico)
async function eliminarMateria(req, res) {
  try {
    const id_usuario = req.user.id_usuario;
    const id_materia = req.params.id;

    const filasAfectadas = await Materia.eliminarLogico(id_materia, id_usuario);

    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: 'Materia no encontrada o ya eliminada' });
    }

    return res.json({ mensaje: 'Materia eliminada (borrado lógico) correctamente' });
  } catch (error) {
    console.error('Error en eliminarMateria:', error);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
}

module.exports = {
  crearMateria,
  obtenerMaterias,
  obtenerMateriaPorId,
  actualizarMateria,
  eliminarMateria
};
