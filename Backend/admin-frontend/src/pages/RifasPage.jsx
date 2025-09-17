// admin-frontend/src/pages/RifasPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { FaArrowLeft, FaHome, FaSpinner, FaTimesCircle, FaCheckCircle, FaEdit, FaTrashAlt, FaCalendarAlt, FaSave } from 'react-icons/fa';

// Importaciones para el editor de texto y el selector de fechas
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
registerLocale('es', es);

// Añadir soporte para emojis en ReactQuill
const Emoji = Quill.import('formats/emoji');
Quill.register(Emoji, true);

// Componente de Toast (simulado)
const showToast = (message, type = 'info') => {
    console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
};

// Componente ToggleSwitch
const ToggleSwitch = ({ id, checked, onChange }) => (
    <div className="toggle-switch-container">
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="toggle-switch-checkbox"
        />
        <label htmlFor={id} className="toggle-switch-label"></label>
    </div>
);

function RifasPage() {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRifa, setSelectedRifa] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const initialFormState = {
        nombreProducto: '',
        descripcion: '',
        imagenUrl: '',
        precioTicketUSD: '',
        tasaCambio: '',
        totalTickets: '',
        fechaInicioSorteo: null,
        fechaFin: null,
        fechaSorteo: null,
        estaAbiertaParaVenta: true,
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchRifas();
    }, []);

    const fetchRifas = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/rifas', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRifas(response.data);
        } catch (err) {
            console.error('Error al obtener rifas:', err);
            setError('No se pudieron cargar las rifas. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleQuillChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            descripcion: value,
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: date,
        }));
    };

    const handleCreateRifa = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const dataToSend = {
                ...formData,
                fechaInicioSorteo: formData.fechaInicioSorteo?.toISOString(),
                fechaFin: formData.fechaFin?.toISOString(),
                fechaSorteo: formData.fechaSorteo?.toISOString(),
                precioTicketUSD: parseFloat(formData.precioTicketUSD),
                tasaCambio: parseFloat(formData.tasaCambio),
                totalTickets: parseInt(formData.totalTickets, 10),
            };

            const response = await api.post('/rifas', dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast('Rifa creada exitosamente!', 'success');
            setIsFormOpen(false);
            setFormData(initialFormState);
            fetchRifas();
        } catch (err) {
            console.error('Error al crear rifa:', err.response?.data || err);
            setError(err.response?.data?.message || 'Error al crear la rifa. Asegúrate de que todos los campos requeridos sean válidos.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRifa = (rifa) => {
        setSelectedRifa(rifa);
        setFormData({
            ...rifa,
            fechaInicioSorteo: rifa.fechaInicioSorteo ? new Date(rifa.fechaInicioSorteo) : null,
            fechaFin: rifa.fechaFin ? new Date(rifa.fechaFin) : null,
            fechaSorteo: rifa.fechaSorteo ? new Date(rifa.fechaSorteo) : null,
        });
        setIsFormOpen(true);
    };

    const handleUpdateRifa = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const dataToSend = {
                ...formData,
                fechaInicioSorteo: formData.fechaInicioSorteo?.toISOString(),
                fechaFin: formData.fechaFin?.toISOString(),
                fechaSorteo: formData.fechaSorteo?.toISOString(),
                precioTicketUSD: parseFloat(formData.precioTicketUSD),
                tasaCambio: parseFloat(formData.tasaCambio),
                totalTickets: parseInt(formData.totalTickets, 10),
            };

            const response = await api.patch(`/rifas/${selectedRifa._id}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast('Rifa actualizada exitosamente!', 'success');
            setIsFormOpen(false);
            setSelectedRifa(null);
            setFormData(initialFormState);
            fetchRifas();
        } catch (err) {
            console.error('Error al actualizar rifa:', err.response?.data || err);
            setError(err.response?.data?.message || 'Error al actualizar la rifa. Asegúrate de que todos los campos sean válidos.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRifa = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta rifa? Esta acción es irreversible.')) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await api.delete(`/rifas/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast('Rifa eliminada exitosamente!', 'success');
            fetchRifas();
        } catch (err) {
            console.error('Error al eliminar rifa:', err);
            setError(err.response?.data?.message || 'Error al eliminar la rifa.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizarRifa = async (rifaId) => {
        if (!window.confirm('¿Estás seguro de que quieres finalizar esta rifa? La rifa quedará cerrada y no se podrá sortear más adelante.')) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await api.patch(`/rifas/${rifaId}/finalizar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast('Rifa finalizada exitosamente!', 'success');
            fetchRifas();
        } catch (err) {
            console.error('Error al finalizar la rifa:', err);
            setError(err.response?.data?.message || 'Error al finalizar la rifa. Asegúrate de que tu backend tenga el endpoint /rifas/:id/finalizar.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVentaManual = async (rifaId, currentStatus) => {
        const newStatus = !currentStatus;
        if (!window.confirm(`¿Estás seguro de que quieres ${newStatus ? 'ABRIR' : 'CERRAR'} esta rifa para la venta manual?`)) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await api.patch(`/rifas/${rifaId}/toggle-venta-manual`, {
                estaAbiertaParaVenta: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast(`Rifa ${newStatus ? 'abierta' : 'cerrada'} manualmente para la venta.`, 'success');
            fetchRifas();
        } catch (err) {
            console.error('Error al cambiar estado manual de venta:', err);
            setError(err.response?.data?.message || 'Error al cambiar el estado manual de venta de la rifa.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => { window.history.back(); };
    const handleGoToDashboard = () => { window.location.href = '/dashboard'; };

    const quillModules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean'],
            [{ 'align': [] }],
            ['emoji']
        ],
        'emoji-toolbar': true,
        'emoji-shortname': true,
    };

    if (loading) {
        return <div className="loading-screen"><FaSpinner className="loading-spinner" /><p className="loading-text">Cargando rifas...</p></div>;
    }

    if (error && !isFormOpen) {
        return (
            <div className="error-screen">
                <FaTimesCircle className="error-icon" />
                <h1 className="error-title">¡Oops! Error al Cargar Rifas</h1>
                <p className="error-message">{error}</p>
                <button onClick={fetchRifas} className="action-button reload">
                    <FaSpinner /> Reintentar Carga
                </button>
                <button onClick={handleGoToDashboard} className="action-button login mt-4">
                    <FaArrowLeft /> Ir al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="rifas-page-container">
            <div className="rifas-header">
                <div className="header-buttons">
                    <button onClick={handleGoBack} className="btn-navegacion">
                        <FaArrowLeft /> Volver Atrás
                    </button>
                    <button onClick={handleGoToDashboard} className="btn-navegacion btn-dashboard">
                        <FaHome /> Dashboard
                    </button>
                </div>
                <h2>Gestión de Rifas</h2>
            </div>

            {error && <p className="error-message">{error}</p>}

            {!isFormOpen && (
                <button onClick={() => {
                        setIsFormOpen(true);
                        setSelectedRifa(null);
                        setFormData(initialFormState);
                    }} className="add-button">
                    Crear Nueva Rifa
                </button>
            )}

            {isFormOpen && (
                <div className="form-container">
                    <h3>{selectedRifa ? 'Editar Rifa' : 'Crear Nueva Rifa'}</h3>
                    <form onSubmit={selectedRifa ? handleUpdateRifa : handleCreateRifa}>
                        <div className="form-group">
                            <label htmlFor="nombreProducto">Nombre del Producto:</label>
                            <input
                                type="text"
                                id="nombreProducto"
                                name="nombreProducto"
                                value={formData.nombreProducto}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción:</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.descripcion}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                placeholder="Escribe una descripción detallada aquí..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imagenUrl">URL de la Imagen:</label>
                            <input
                                type="text"
                                id="imagenUrl"
                                name="imagenUrl"
                                value={formData.imagenUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="precioTicketUSD">Precio Ticket (USD):</label>
                            <input
                                type="number"
                                id="precioTicketUSD"
                                name="precioTicketUSD"
                                value={formData.precioTicketUSD}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tasaCambio">Tasa de Cambio (VES por USD):</label>
                            <input
                                type="number"
                                id="tasaCambio"
                                name="tasaCambio"
                                value={formData.tasaCambio}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>
                        {formData.precioTicketUSD !== '' && formData.tasaCambio !== '' && !isNaN(formData.precioTicketUSD) && !isNaN(formData.tasaCambio) && (
                            <p className="calculated-price">
                                Precio en Bolívares (Calculado): <strong>VES {(parseFloat(formData.precioTicketUSD) * parseFloat(formData.tasaCambio)).toFixed(2)}</strong>
                            </p>
                        )}
                        <div className="form-group">
                            <label htmlFor="totalTickets">Total de Tickets:</label>
                            <input
                                type="number"
                                id="totalTickets"
                                name="totalTickets"
                                value={formData.totalTickets}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estaAbiertaParaVenta">Estado Manual de Venta:</label>
                            <ToggleSwitch
                                id="estaAbiertaParaVenta"
                                checked={formData.estaAbiertaParaVenta}
                                onChange={() => handleInputChange({ target: { name: 'estaAbiertaParaVenta', type: 'checkbox', checked: !formData.estaAbiertaParaVenta } })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fechaInicioSorteo">Fecha de Inicio del Sorteo:</label>
                            <div className="date-picker-container">
                                <FaCalendarAlt className="date-picker-icon" />
                                <DatePicker
                                    id="fechaInicioSorteo"
                                    selected={formData.fechaInicioSorteo}
                                    onChange={(date) => handleDateChange('fechaInicioSorteo', date)}
                                    dateFormat="dd/MM/yyyy"
                                    locale="es"
                                    required
                                    placeholderText="Seleccionar fecha"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaFin">Fecha de Finalización (y Hora):</label>
                            <div className="date-picker-container">
                                <FaCalendarAlt className="date-picker-icon" />
                                <DatePicker
                                    id="fechaFin"
                                    selected={formData.fechaFin}
                                    onChange={(date) => handleDateChange('fechaFin', date)}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy h:mm aa"
                                    locale="es"
                                    required
                                    placeholderText="Seleccionar fecha y hora"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaSorteo">Fecha y Hora del Sorteo:</label>
                            <div className="date-picker-container">
                                <FaCalendarAlt className="date-picker-icon" />
                                <DatePicker
                                    id="fechaSorteo"
                                    selected={formData.fechaSorteo}
                                    onChange={(date) => handleDateChange('fechaSorteo', date)}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy h:mm aa"
                                    locale="es"
                                    placeholderText="Seleccionar fecha y hora (Opcional)"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading}>
                                {loading ? <FaSpinner className="loading-spinner" /> : (selectedRifa ? 'Actualizar Rifa' : 'Crear Rifa')}
                            </button>
                            <button type="button" onClick={() => { setIsFormOpen(false); setSelectedRifa(null); setError(''); }} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!loading && !error && !isFormOpen && rifas.length > 0 && (
                <div className="rifas-list">
                    <h3>Rifas Existentes</h3>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tickets Vendidos</th>
                                    <th>Total Tickets</th>
                                    <th>% Vendido</th>
                                    <th>Precio (USD)</th>
                                    <th>Precio (VES)</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin Venta</th>
                                    <th>Fecha Sorteo</th>
                                    <th>Estado General</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rifas.map((rifa) => (
                                    <tr key={rifa._id}>
                                        <td>{rifa.nombreProducto}</td>
                                        <td>{rifa.ticketsVendidos}</td>
                                        <td>{rifa.totalTickets}</td>
                                        <td>{rifa.porcentajeVendido ? rifa.porcentajeVendido.toFixed(2) : '0.00'}%</td>
                                        <td>${typeof rifa.precioTicketUSD === 'number' ? rifa.precioTicketUSD.toFixed(2) : 'N/A'}</td>
                                        <td>VES {typeof rifa.precioTicketVES === 'number' ? rifa.precioTicketVES.toFixed(2) : 'N/A'}</td>
                                        <td>{rifa.fechaInicioSorteo ? new Date(rifa.fechaInicioSorteo).toLocaleDateString('es-VE') : 'N/A'}</td>
                                        <td>{rifa.fechaFin ? new Date(rifa.fechaFin).toLocaleString('es-VE') : 'N/A'}</td>
                                        <td>{rifa.fechaSorteo ? new Date(rifa.fechaSorteo).toLocaleString('es-VE') : 'Pendiente'}</td>
                                        <td>
                                            <span className={`status-badge status-${rifa.estado}`}>
                                                {rifa.estado.charAt(0).toUpperCase() + rifa.estado.slice(1)}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <ToggleSwitch
                                                id={`toggle-${rifa._id}`}
                                                checked={rifa.estaAbiertaParaVenta}
                                                onChange={() => handleToggleVentaManual(rifa._id, rifa.estaAbiertaParaVenta)}
                                            />
                                            <button onClick={() => handleEditRifa(rifa)} className="action-button edit-button" title="Editar Rifa"><FaEdit /></button>
                                            <button onClick={() => handleDeleteRifa(rifa._id)} className="action-button delete-button" title="Eliminar Rifa"><FaTrashAlt /></button>
                                            {rifa.estado !== 'finalizada' && rifa.ticketsVendidos > 0 && (
                                                <button onClick={() => handleFinalizarRifa(rifa._id)} className="action-button finalizar-button" title="Finalizar Rifa">
                                                    <FaSave /> Finalizar Rifa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && !error && !isFormOpen && rifas.length === 0 && (
                <p className="no-rifas-message">No hay rifas para mostrar. ¡Crea una nueva!</p>
            )}
        </div>
    );
}

export default RifasPage;