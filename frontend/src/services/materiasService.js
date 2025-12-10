import api from './api';

export async function obtenerMaterias() {
  const { data } = await api.get('/materias');
  return data;
}

export async function crearMateria(materia) {
  const { data } = await api.post('/materias', materia);
  return data;
}

export async function actualizarMateria(id_materia, materia) {
  const { data } = await api.put(`/materias/${id_materia}`, materia);
  return data;
}

export async function eliminarMateria(id_materia) {
  const { data } = await api.delete(`/materias/${id_materia}`);
  return data;
}
