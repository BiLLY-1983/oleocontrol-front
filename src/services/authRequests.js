import api from '@config/api.js';

/**
 * Genera los encabezados de autorización para las peticiones autenticadas.
 *
 * @param {string} token - Token JWT del usuario autenticado.
 * @returns {Object} Encabezados HTTP con el token de autorización.
 */
const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

/**
 * Realiza la solicitud de inicio de sesión del usuario.
 *
 * @param {string} username - Nombre de usuario del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de autenticación (token, usuario, etc.).
 * @throws {Error} Lanza un error si la solicitud falla.
 */
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

/**
 * Realiza la solicitud para cerrar sesión del usuario.
 *
 * @param {string} token - Token JWT del usuario autenticado.
 * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const logoutRequest = async (token) => {
    try {
        const response = await api.post('/logout', {}, getAuthHeaders(token));
        return response.data.message || 'Cierre de sesión exitoso';
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/**
 * Obtiene los datos del perfil del usuario autenticado.
 *
 * @param {string} token - Token JWT del usuario autenticado.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del perfil del usuario.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getProfileRequest = async (token) => {
    try {
        const response = await api.get('/profile', getAuthHeaders(token));
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/**
 * Actualiza los datos del perfil del usuario autenticado.
 *
 * @param {Object} data - Datos actualizados del perfil.
 * @param {string} token - Token JWT del usuario autenticado.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del perfil actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateProfileRequest = async (data, token) => {
    try {
        const response = await api.put('/profile', data, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/**
 * Maneja los errores que pueden ocurrir durante una solicitud HTTP.
 *
 * @param {Object} error - Objeto de error capturado.
 * @returns {string} Mensaje de error formateado.
 */
const handleError = (error) => {
    if (error.response) {
        return error.response.data.message || 'Error en la solicitud al servidor.';
    } else if (error.request) {
        return 'No se pudo contactar con el servidor.';
    } else {
        return `Error en la solicitud: ${error.message}`;
    }
};
