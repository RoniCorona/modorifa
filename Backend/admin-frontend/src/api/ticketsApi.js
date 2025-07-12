// admin-frontend/src/api/ticketsApi.js
import axios from 'axios'; // Importa la instancia global de axios que ya configuraste

const API_BASE_URL = 'http://localhost:5000/api'; // Define la base URL si no la tienes en axiosConfig.js

export const consultarTicketPorNumeroYRifa = async (numeroTicket, rifaId) => {
    try {
        // La URL debe coincidir con la ruta del backend y enviar rifaId como query param
        const response = await axios.get(`${API_BASE_URL}/tickets/consultar-por-numero/${numeroTicket}`, {
            params: {
                rifaId: rifaId
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al consultar ticket ${numeroTicket} para la rifa ${rifaId}:`, error.response ? error.response.data : error.message);
        throw error; 
    }
};

// Si tienes otras funciones relacionadas con tickets, agrégalas aquí
// Por ejemplo, para obtener todos los tickets de una rifa (para el panel de admin)
export const getTicketsByRifaId = async (rifaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tickets/rifa/${rifaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener tickets para la rifa ${rifaId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// ... otras funciones de tickets si las tienes