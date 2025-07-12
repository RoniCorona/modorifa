import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    setError(''); // Limpia cualquier mensaje de error previo
    setLoading(true); // Activa el estado de carga para el botón

    try {
      // Realiza la petición POST al backend para iniciar sesión
      const response = await axios.post('/admin/login', {
        email,
        password,
      });

      // Si el inicio de sesión es exitoso, el backend devolverá un token y la información del admin
      const { token, admin } = response.data;

      // *** CORRECCIÓN CLAVE AQUÍ: Usamos 'adminToken' como clave en localStorage ***
      // ¡Esta clave debe coincidir exactamente con la que lee tu PrivateRoute.jsx!
      localStorage.setItem('adminToken', token); // Cambiado de 'token' a 'adminToken'
      
      // Guardamos también la información del admin, si es necesaria para el frontend
      // Es una buena práctica guardar la información como una cadena JSON
      localStorage.setItem('adminInfo', JSON.stringify(admin)); 

      // Redirige al Dashboard (la ruta principal '/')
      // Una vez que el token se guarda, PrivateRoute.jsx permitirá el acceso a la ruta protegida.
      navigate('/');

    } catch (err) {
      // Si hay un error (ej. credenciales inválidas, error de red), muestra el mensaje de error
      console.error('Error al iniciar sesión:', err);
      // Intenta obtener un mensaje de error específico del backend si está disponible
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        // Mensaje genérico para otros tipos de errores (ej. red)
        setError('Ocurrió un error inesperado al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false); // Desactiva el estado de carga, sin importar si hubo éxito o error
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión Administrador</h2>
      {error && <p className="error-message">{error}</p>} {/* Muestra el error si existe */}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Campo requerido
            placeholder="Introduce tu email"
            autoComplete="username" // Sugerencia de autocompletado para el navegador
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Campo requerido
            placeholder="Introduce tu contraseña"
            autoComplete="current-password" // Sugerencia de autocompletado para el navegador
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Entrar al Panel'} {/* Cambia el texto del botón según el estado de carga */}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;