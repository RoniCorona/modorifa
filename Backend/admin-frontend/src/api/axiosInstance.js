// admin-frontend/src/api/axiosInstance.js
import axios from 'axios';

// Crea una instancia de Axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Tu base URL del backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token de autorización a cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;