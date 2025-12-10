import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  // Guardar token
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function register(nombre, email, password) {
  const { data } = await api.post('/auth/register', { nombre, email, password });
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function getCurrentUser() {
  const stored = localStorage.getItem('usuario');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
