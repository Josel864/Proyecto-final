const PDFDocument = require('pdfkit');
const Materia = require('../models/materia.model');
const Tarea = require('../models/tarea.model');
const Examen = require('../models/examen.model');

async function generarReporteResumen(req, res) {
  try {
    const id_usuario = req.user.id_usuario;

    // Obtener datos
    const materias = await Materia.obtenerMateriasPorUsuario(id_usuario);
    const tareas = await Tarea.obtenerTodasTareasPorUsuario(id_usuario);
    const examenes = await Examen.obtenerTodosExamenesPorUsuario(id_usuario);

    // Configurar headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_uniplanner.pdf"'
    );

    const doc = new PDFDocument({ margin: 50 });

    // Enviar el PDF directamente a la respuesta
    doc.pipe(res);

    // Título
    doc
      .fontSize(18)
      .text('UniPlanner - Resumen académico', { align: 'center' })
      .moveDown(0.5);

    const fecha = new Date().toLocaleString();
    doc.fontSize(10).text(`Generado: ${fecha}`, { align: 'right' });
    doc.moveDown();

    // Sección materias
    doc
      .fontSize(14)
      .text('1. Materias registradas', { underline: true })
      .moveDown(0.5);

    if (materias.length === 0) {
      doc.fontSize(10).text('No hay materias registradas.').moveDown();
    } else {
      materias.forEach((m, i) => {
        doc
          .fontSize(11)
          .text(
            `${i + 1}. ${m.nombre}  (Semestre: ${m.semestre || 'N/A'} - Año: ${
              m.anio || 'N/A'
            })`
          );
        if (m.descripcion) {
          doc.fontSize(9).text(`   Descripción: ${m.descripcion}`);
        }
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Sección tareas
    doc
      .addPage()
      .fontSize(14)
      .text('2. Tareas', { underline: true })
      .moveDown(0.5);

    if (tareas.length === 0) {
      doc.fontSize(10).text('No hay tareas registradas.').moveDown();
    } else {
      const pendientes = tareas.filter((t) => t.estado === 'PENDIENTE');
      const completadas = tareas.filter((t) => t.estado === 'COMPLETADA');

      doc
        .fontSize(11)
        .text(`Total de tareas: ${tareas.length}`)
        .text(`Pendientes: ${pendientes.length}`)
        .text(`Completadas: ${completadas.length}`)
        .moveDown();

      tareas.forEach((t, i) => {
        doc
          .fontSize(11)
          .text(
            `${i + 1}. ${t.titulo}  (Materia: ${
              t.nombre_materia || t.id_materia
            })`
          );
        doc
          .fontSize(9)
          .text(
            `   Estado: ${t.estado} | Prioridad: ${t.prioridad} | Entrega: ${t.fecha_entrega}`
          );
        if (t.descripcion) {
          doc.text(`   Descripción: ${t.descripcion}`);
        }
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Sección exámenes
    doc
      .addPage()
      .fontSize(14)
      .text('3. Exámenes', { underline: true })
      .moveDown(0.5);

    if (examenes.length === 0) {
      doc.fontSize(10).text('No hay exámenes registrados.').moveDown();
    } else {
      doc.fontSize(11).text(`Total de exámenes: ${examenes.length}`).moveDown();

      examenes.forEach((e, i) => {
        doc
          .fontSize(11)
          .text(
            `${i + 1}. ${e.titulo} (${e.tipo}) - Materia: ${
              e.nombre_materia || e.id_materia
            }`
          );
        doc
          .fontSize(9)
          .text(
            `   Fecha: ${e.fecha_examen} | Porcentaje: ${
              e.porcentaje_nota || 'N/A'
            }%`
          );
        if (e.descripcion) {
          doc.text(`   Descripción: ${e.descripcion}`);
        }
        doc.moveDown(0.3);
      });
    }

    // Finalizar PDF
    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ mensaje: 'Error interno al generar el reporte PDF' });
    }
  }
}

module.exports = { generarReporteResumen };
