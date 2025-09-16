// admin-frontend/src/api/topCompradoresApi.js
import api from './axiosInstance'; // ✅ Usa la misma instancia que todos

const API_URL = '/stats'; // Relativo a la baseURL ya configurada

// Obtener el top 10 de compradores por rifa
export const getTopCompradoresPorRifa = async (rifaId) => {
  try {
    const response = await api.get(`${API_URL}/top-compradores/${rifaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top compradores:', error);
    throw error.response?.data || { message: 'Error al obtener el top de compradores' };
  }
};