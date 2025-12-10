import axios from 'axios';

// Ajusta si tu backend corre en otro puerto
const API_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // lo guardaremos ahí
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
