// src/utils/axiosConfig.js
import axios from 'axios';

// ✅ Establecer la URL base dinámicamente (Render o localhost)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = baseURL;

// ✅ Interceptor de peticiones: añadir token si existe
axios.interceptors.request.use(
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

// ✅ Interceptor de respuestas: manejo de errores globales (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Petición no autorizada (401). Token inválido o expirado.');
      // Puedes agregar lógica de redirección si quieres
    }
    return Promise.reject(error);
  }
);

export default axios;
