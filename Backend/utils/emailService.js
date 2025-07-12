// backend/utils/emailService.js

const nodemailer = require('nodemailer');

// Configura el transporter de Nodemailer
// Usamos variables de entorno para las credenciales por seguridad
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar esto si usas otro proveedor (ej. 'Outlook365')
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo electrónico de confirmación de tickets.
 * @param {string} emailTo - Email del comprador.
 * @param {string} nombreComprador - Nombre del comprador.
 * @param {object} rifa - Objeto Rifa.
 * @param {Array} tickets - Array de objetos Ticket comprados.
 */
const sendTicketConfirmationEmail = async (emailTo, nombreComprador, rifa, tickets) => {
    // Asegurarse de que rifa.precioTicketUSD sea un número antes de usar toFixed
    const precioUnitario = typeof rifa.precioTicketUSD === 'number' ? rifa.precioTicketUSD : 0;
    const ticketNumbers = tickets.map(ticket => ticket.numeroTicket).join(', ');
    const totalAmount = (tickets.length * precioUnitario).toFixed(2); // Calcula el monto total usando precioTicketUSD

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: `¡Gracias por tu compra! Tus tickets para la rifa de ${rifa.nombreProducto}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">¡Hola ${nombreComprador}!</h2>
                <p>Muchas gracias por participar en nuestra rifa **${rifa.nombreProducto}**. Tu apoyo significa mucho para nosotros.</p>
                <p>Hemos recibido tu compra y tus tickets están listos:</p>
                <div style="background-color: #f9f9f9; border-left: 5px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <h3>Detalles de tu compra:</h3>
                    <p><strong>Rifa:</strong> ${rifa.nombreProducto}</p>
                    <p><strong>Tickets Comprados:</strong> ${tickets.length}</p>
                    <p><strong>Números de Ticket:</strong> ${ticketNumbers}</p>
                    <p><strong>Precio por Ticket:</strong> $${precioUnitario.toFixed(2)}</p> <!-- Corrección aquí -->
                    <p><strong>Monto Total Pagado:</strong> $${totalAmount}</p>
                </div>
                <p>Recuerda que los resultados del sorteo se anunciarán en nuestra página web o por los canales que dispongamos.</p>
                <p>¡Te deseamos mucha suerte!</p>
                <p>Atentamente,</p>
                <p>El equipo de [Tu Nombre de Empresa/Rifas]</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8em; color: #666;">Este es un correo automático, por favor no respondas a esta dirección.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de confirmación enviado a ${emailTo} para la rifa ${rifa.nombreProducto}.`);
    } catch (error) {
        console.error(`Error al enviar correo de confirmación a ${emailTo}:`, error);
        // Puedes lanzar el error de nuevo si quieres que el controlador superior lo maneje
        // throw error; 
    }
};

module.exports = {
    sendTicketConfirmationEmail
};