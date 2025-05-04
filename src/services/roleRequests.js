import api from '@config/api.js';

/**
 * Obtiene todos los roles disponibles.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de roles.
 */
export const getRoles = async () => {
    try {
        const response = await api.get('/roles');
        return response.data;  // Devuelve los datos de todos los roles
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Obtiene los datos de un rol específico.
 *
 * @param {number|string} id - ID del rol.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del rol solicitado.
 */
export const getRole = async (id) => {
    try {
        const response = await api.get(`/roles/${id}`);
        return response.data;  // Devuelve los datos del rol
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo rol.
 *
 * @param {Object} roleData - Datos del nuevo rol.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del rol creado.
 */
export const createRole = async (roleData) => {
    try {
        const response = await api.post('/roles', roleData);
        return response.data;  // Devuelve los datos del rol creado
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Actualiza un rol existente.
 *
 * @param {number|string} id - ID del rol a actualizar.
 * @param {Object} roleData - Nuevos datos para el rol.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del rol actualizado.
 */
export const updateRole = async (id, roleData) => {
    try {
        const response = await api.put(`/roles/${id}`, roleData);
        return response.data;  // Devuelve los datos del rol actualizado
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Elimina un rol específico.
 *
 * @param {number|string} id - ID del rol a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteRole = async (id) => {
    try {
        const response = await api.delete(`/roles/${id}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
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
