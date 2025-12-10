import api from './api';

export async function obtenerExamenes() {
  const { data } = await api.get('/examenes');
  return data;
}

export async function obtenerExamenesPorMateria(id_materia) {
  const { data } = await api.get(`/examenes/materia/${id_materia}`);
  return data;
}

export async function crearExamen(examen) {
  const { data } = await api.post('/examenes', examen);
  return data;
}

export async function actualizarExamen(id_examen, examen) {
  const { data } = await api.put(`/examenes/${id_examen}`, examen);
  return data;
}

export async function eliminarExamen(id_examen) {
  const { data } = await api.delete(`/examenes/${id_examen}`);
  return data;
}
