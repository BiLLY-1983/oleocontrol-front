import api from '@config/api.js';

/**
 * Funciones para manejar la autenticación de usuarios.
 * Estas funciones interactúan con la API para iniciar sesión, cerrar sesión y obtener el perfil del usuario.
 */

/* Función para hacer peticiones con el token */
const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

/* Login */
export const loginRequest = async (username, password) => {
    try {
        const response = await api.post('/login', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/* Logout */
export const logoutRequest = async (token) => {
    try {
        const response = await api.post('/logout', {}, getAuthHeaders(token));
        return response.data.message || 'Cierre de sesión exitoso';
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/* Obtener Profile */
export const getProfileRequest = async (token) => {
    try {
        const response = await api.get('/profile', getAuthHeaders(token));
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/* Actualizar Profile */
export const updateProfileRequest = async (data, token) => {
    try {
        const response = await api.put('/profile', data, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};


/* Función para manejar los errores */
const handleError = (error) => {
    if (error.response) {
        // El error proviene del backend
        return error.response.data.message || 'Error en la solicitud al servidor.';
    } else if (error.request) {
        // No se obtuvo respuesta del servidor (problema de red o servidor no disponible)
        return 'No se pudo contactar con el servidor.';
    } else {
        // Problema con la configuración de la solicitud
        return `Error en la solicitud: ${error.message}`;
    }
};

