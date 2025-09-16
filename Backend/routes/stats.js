const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Pago = require('../models/Pago');
const { protect, authorize } = require('../middleware/auth');

// @desc    Obtener el top 10 de compradores por rifa (agrupados por cédula)
// @route   GET /api/stats/top-compradores/:rifaId
// @access  Private (Admin)
router.get('/top-compradores/:rifaId', protect, authorize(['admin']), async (req, res) => {
    try {
        const { rifaId } = req.params;

        // Validar que rifaId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(rifaId)) {
            return res.status(400).json({ message: 'ID de rifa no válido' });
        }

        const topCompradores = await Pago.aggregate([
            {
                $match: {
                    rifa: new mongoose.Types.ObjectId(rifaId), // Filtra por la rifa específica
                    estado: 'verificado', // Solo pagos verificados cuentan
                    'comprador.numeroIdentificacion': { $exists: true, $ne: null } // Solo compradores con cédula
                }
            },
            {
                $group: {
                    _id: '$comprador.numeroIdentificacion', // Agrupa por cédula
                    nombre: { $first: '$comprador.nombre' },
                    totalTicketsComprados: { $sum: '$cantidadTickets' }, // Suma los tickets de todas sus compras
                    compras: { $sum: 1 } // Cuenta el número de transacciones (compras)
                }
            },
            { $sort: { totalTicketsComprados: -1 } }, // Ordena de mayor a menor
            { $limit: 10 } // Top 10
        ]);

        res.json(topCompradores);
    } catch (err) {
        console.error('Error al obtener el top de compradores:', err);
        res.status(500).json({ message: 'Error del servidor al obtener el top de compradores.' });
    }
});

module.exports = router;