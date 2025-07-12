// src/utils/axiosConfig.js
import axios from 'axios';

// 1. Crea una instancia de Axios si la necesitas para configuraciones específicas
// Si no, puedes configurar directamente la instancia default de axios
// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:5000/api', // Puedes poner aquí la base URL de tu API
//     timeout: 10000, // Tiempo de espera para las peticiones
// });

// 2. Configura el interceptor de peticiones
axios.interceptors.request.use(
    (config) => {
        // Obtiene el token del localStorage usando la clave CORRECTA: 'adminToken'
        const token = localStorage.getItem('adminToken');

        // Si el token existe, lo añade al encabezado de autorización
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Manejo de errores de petición (ej. errores de red antes de enviar)
        return Promise.reject(error);
    }
);

// Opcional: Interceptor de respuestas para manejar errores 401/403 globalmente
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Petición no autorizada (401). Posiblemente token inválido o expirado.');
            // Aquí puedes añadir lógica para redirigir al usuario al login
            // Ejemplo con window.location, pero si usas React Router, preferirías un contexto de autenticación o history object
            // if (window.location.pathname !== '/login') { // Evitar bucle de redirección
            //     localStorage.removeItem('adminToken');
            //     localStorage.removeItem('adminInfo');
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

// Puedes exportar axios por si necesitas la instancia configurada,
// pero si solo usas `axios` directamente, con import 'axios' en los componentes es suficiente
export default axios;