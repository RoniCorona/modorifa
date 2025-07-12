// admin-frontend/src/api/pagosApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pagos'; // Asegúrate de que esta URL coincida con la de tu backend

const getPagos = async (filters = {}) => {
    try {
        const { rifaId, estado, searchTerm, page = 1, limit = 10 } = filters;
        const queryParams = new URLSearchParams();

        if (rifaId) queryParams.append('rifaId', rifaId);
        if (estado) queryParams.append('estado', estado);
        if (searchTerm) queryParams.append('searchTerm', searchTerm);
        queryParams.append('page', page);
        queryParams.append('limit', limit);

        // Ya no se añade el header de autorización aquí, el interceptor global lo hará
        const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pagos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getPagoById = async (id) => {
    try {
        // Ya no se añade el header de autorización aquí
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching pago with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const verifyPago = async (id, notes = '') => {
    try {
        // Ya no se añade el header de autorización aquí
        const response = await axios.patch(`${API_URL}/${id}/verificar`, { notasAdministrador: notes });
        return response.data;
    } catch (error) {
        console.error(`Error verifying pago with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const rejectPago = async (id, notes = '') => {
    try {
        // Ya no se añade el header de autorización aquí
        const response = await axios.patch(`${API_URL}/${id}/rechazar`, { notasAdministrador: notes });
        return response.data;
    } catch (error) {
        console.error(`Error rejecting pago with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const deletePago = async (id) => {
    try {
        // Ya no se añade el header de autorización aquí
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting pago with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

export {
    getPagos,
    getPagoById,
    verifyPago,
    rejectPago,
    deletePago
};