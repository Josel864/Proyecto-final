import api from './api';

export async function obtenerTareas() {
  const { data } = await api.get('/tareas');
  return data;
}

export async function obtenerTareasPorMateria(id_materia) {
  const { data } = await api.get(`/tareas/materia/${id_materia}`);
  return data;
}

export async function crearTarea(tarea) {
  const { data } = await api.post('/tareas', tarea);
  return data;
}

export async function actualizarTarea(id_tarea, tarea) {
  const { data } = await api.put(`/tareas/${id_tarea}`, tarea);
  return data;
}

export async function eliminarTarea(id_tarea) {
  const { data } = await api.delete(`/tareas/${id_tarea}`);
  return data;
}
