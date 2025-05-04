import api from '@config/api.js';

/**
 * Obtiene todos los usuarios. Solo accesible por administradores.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de usuarios.
 */
export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Obtiene un usuario por su ID.
 *
 * @param {number|string} id - ID del usuario a obtener.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del usuario.
 */
export const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;  // Devuelve los datos del usuario
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo usuario. Solo accesible por administradores.
 *
 * @param {Object} userData - Datos del usuario a crear.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del usuario creado.
 */
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        console.error("Error en createUser:", error.response?.data || error.message);
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Actualiza un usuario existente. Solo accesible por administradores.
 *
 * @param {number|string} id - ID del usuario a actualizar.
 * @param {Object} userData - Nuevos datos del usuario.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del usuario actualizado.
 */
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Elimina un usuario. Solo accesible por administradores.
 *
 * @param {number|string} id - ID del usuario a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Solicita el restablecimiento de la contraseña de un usuario.
 *
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} username - Nombre de usuario del usuario.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la solicitud de restablecimiento.
 */
export const requestPasswordReset = async (email, username) => {
    try {
        const response = await api.post('/reset-password-request', {
            email,
            username,
        });
        return response.data;  // Devuelve la respuesta de la solicitud de restablecimiento de contraseña
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Maneja los errores ocurridos durante las solicitudes HTTP.
 *
 * @param {Object} error - Objeto de error capturado.
 * @returns {Object} Objeto con `success: false` y un mensaje de error.
 */
const handleError = (error) => {
    if (error.response) {
        console.error('Error en la respuesta:', error.response);
        return { success: false, message: error.response.data.message || 'Error desconocido' };
    } else if (error.request) {
        console.error('No se recibió respuesta:', error.request);
        return { success: false, message: 'No se recibió respuesta del servidor' };
    } else {
        console.error('Error al configurar la solicitud:', error.message);
        return { success: false, message: error.message };
    }
};
