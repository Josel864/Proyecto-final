import api from './api';

export async function descargarReporteResumen() {
  const response = await api.get('/reportes/resumen', {
    responseType: 'blob',
  });
  return response.data;
}
