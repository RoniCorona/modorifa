// admin-frontend/src/api/rifasApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rifas';

const getRifas = async () => {
    try {
        // Ya no se añade el header de autorización aquí
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching rifas:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export { getRifas };