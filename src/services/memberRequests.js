import api from '@config/api.js';

/**
 * Obtiene todos los miembros.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de miembros.
 */
export const getMembers = async () => {
    try {
        const response = await api.get('/members');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene los datos de un miembro específico por su ID.
 *
 * @param {number|string} id - ID del miembro.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del miembro.
 */
export const getMember = async (id) => {
    try {
        const response = await api.get(`/members/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Crea un nuevo miembro.
 *
 * @param {Object} memberData - Datos del nuevo miembro.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del miembro creado.
 */
export const createMember = async (memberData) => {
    try {
        const response = await api.post('/members', memberData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Actualiza un miembro existente por su ID.
 *
 * @param {number|string} id - ID del miembro a actualizar.
 * @param {Object} memberData - Nuevos datos del miembro.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del miembro actualizado.
 */
export const updateMember = async (id, memberData) => {
    try {
        const response = await api.put(`/members/${id}`, memberData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Elimina un miembro por su ID.
 *
 * @param {number|string} id - ID del miembro a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la operación de eliminación.
 */
export const deleteMember = async (id) => {
    try {
        const response = await api.delete(`/members/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
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
