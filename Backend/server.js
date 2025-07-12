// Importamos la librería 'dotenv' para cargar las variables de entorno
require('dotenv').config();

// Importamos Express para crear y configurar nuestro servidor web
const express = require('express');

// Importamos Mongoose para conectarnos a MongoDB y trabajar con nuestros modelos
const mongoose = require('mongoose');

// Importamos 'cors' para manejar las políticas de seguridad del navegador.
const cors = require('cors');

// Importamos 'path' para trabajar con rutas de archivos y directorios (útil para servir comprobantes)
const path = require('path');

// Inicializamos la aplicación Express
const app = express();

// AQUÍ, ANTES DE LAS RUTAS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuramos el puerto del servidor.
const PORT = process.env.PORT || 5000;

// Obtenemos la URI de conexión a MongoDB desde las variables de entorno
const MONGO_URI = process.env.MONGO_URI;

// --- Middlewares (Funciones que se ejecutan antes de que la petición llegue a la ruta final) ---

// Habilitar CORS con configuración específica
// ¡MUY IMPORTANTE! Configuración de CORS para tu frontend
// Ahora permitimos múltiples orígenes para desarrollo.
const allowedOrigins = [
    'http://localhost:5173', // Origen para tu frontend de administración (React)
    'http://127.0.0.1:5500', // Origen para Live Server (cuando abres index.html directamente)
    // Agrega aquí cualquier otro origen que necesites, por ejemplo:
    // 'http://localhost:3000', // Si usas Create React App u otro en 3000
    // 'https://tu-dominio-produccion.com' // Cuando despliegues a producción
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman, CURL, o archivos locales cargados directamente)
        if (!origin) return callback(null, true); 
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `La política CORS para este sitio no permite el acceso desde el Origen: ${origin}.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos HTTP que tu frontend usará
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras que tu frontend enviará (Authorization es CRÍTICO para JWT)
}));


// Habilitar el parsing de JSON en el cuerpo de las peticiones
app.use(express.json());

// Servir archivos estáticos, por ejemplo, los comprobantes de pago subidos
// Asumiendo que tus comprobantes se guardan en 'backend/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Conexión a MongoDB ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado exitosamente'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- Importación de Modelos (debe ser antes de usar sus rutas) ---
// Es crucial que los modelos se importen ANTES de usar sus rutas,
// para que Mongoose los "conozca" al inicializar.
require('./models/Rifa');
require('./models/Ticket');
require('./models/Pago');
require('./models/Admin');
require('./models/TasaCambio'); // <--- NUEVA LÍNEA: Importamos el modelo TasaCambio


// --- Importación y Uso de Rutas ---
// Importamos las rutas de autenticación para administradores.
const adminAuthRoutes = require('./routes/adminAuth');
app.use('/api/admin', adminAuthRoutes);

// Importamos el archivo de rutas para rifas.
const rifasRoutes = require('./routes/rifas');
app.use('/api/rifas', rifasRoutes);

// Importamos el archivo de rutas para tickets.
const ticketsRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketsRoutes);

// Importamos el archivo de rutas para pagos.
const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', pagosRoutes); 

// Importamos las nuevas rutas para el dashboard
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Importamos las rutas para la tasa de cambio
const tasaCambioRoutes = require('./routes/tasacambio'); // <--- NUEVA LÍNEA: Importamos las rutas de TasaCambio
app.use('/api/tasacambio', tasaCambioRoutes); // <--- NUEVA LÍNEA: Usamos las rutas de TasaCambio


// Una ruta simple de prueba para verificar que el servidor esté funcionando.
app.get('/', (req, res) => {
    res.send('🎉 API de Rifas está funcionando!');
});

// --- Manejo de errores centralizado (opcional pero recomendado) ---
// Si tienes un middleware de errores, descoméntalo y úsalo aquí.
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);


// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}/ para verificar.`);
    console.log(`Comprobantes subidos disponibles en http://localhost:${PORT}/uploads`);
});
