import api from '@config/api.js';

/**
 * Obtiene todos los aceites.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de aceites.
 */
export const getOils = async () => {
    try {
        const response = await api.get('/oils');
        return response.data;  // Devuelve los datos de todos los aceites
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Obtiene los datos de un aceite específico.
 *
 * @param {number|string} id - ID del aceite.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del aceite.
 */
export const getOil = async (id) => {
    try {
        const response = await api.get(`/oils/${id}`);
        return response.data;  // Devuelve los datos del aceite
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo aceite.
 *
 * @param {Object} oilData - Datos del nuevo aceite.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del aceite creado.
 */
export const createOil = async (oilData) => {
    try {
        const response = await api.post('/oils', oilData);
        return response.data;  // Devuelve los datos del aceite creado
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Actualiza un aceite existente.
 *
 * @param {number|string} id - ID del aceite.
 * @param {Object} oilData - Nuevos datos del aceite.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del aceite actualizado.
 */
export const updateOil = async (id, oilData) => {
    try {
        const response = await api.put(`/oils/${id}`, oilData);
        return response.data;  // Devuelve los datos del aceite actualizado
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Elimina un aceite.
 *
 * @param {number|string} id - ID del aceite.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteOil = async (id) => {
    try {
        const response = await api.delete(`/oils/${id}`);
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
