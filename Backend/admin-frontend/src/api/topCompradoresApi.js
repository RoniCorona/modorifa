import axios from 'axios';

const API_URL = '/api/stats';

// Obtener el top 10 de compradores por rifa
export const getTopCompradoresPorRifa = async (rifaId) => {
  try {
    const response = await axios.get(`${API_URL}/top-compradores/${rifaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top compradores:', error);
    throw error.response?.data || { message: 'Error al obtener el top de compradores' };
  }
};