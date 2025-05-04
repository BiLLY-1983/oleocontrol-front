import api from '@config/api.js';

/**
 * Obtiene todos los acuerdos de liquidación disponibles.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de acuerdos de liquidación.
 */
export const getSettlements = async () => {
    try {
        const response = await api.get('/settlements');
        return response.data;  // Devuelve los datos de todos los acuerdos de liquidación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Obtiene los datos de un acuerdo de liquidación específico.
 *
 * @param {number|string} id - ID del acuerdo de liquidación.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del acuerdo de liquidación solicitado.
 */
export const getSettlement = async (id) => {
    try {
        const response = await api.get(`/settlements/${id}`);
        return response.data;  // Devuelve los datos del acuerdo de liquidación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Obtiene todos los acuerdos de liquidación para un miembro específico.
 *
 * @param {number|string} memberId - ID del miembro cuyo acuerdo de liquidación se va a obtener.
 * @returns {Promise<Object[]>} Una promesa que resuelve con los acuerdos de liquidación del miembro.
 */
export const getSettlementsByMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/settlements`);
        return response.data;  // Devuelve los acuerdos de liquidación del miembro
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo acuerdo de liquidación.
 *
 * @param {Object} settlementData - Datos del nuevo acuerdo de liquidación.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del acuerdo de liquidación creado.
 */
export const createSettlement = async (settlementData) => {
    try {
        const response = await api.post('/settlements', settlementData);
        return response.data;  // Devuelve los datos del acuerdo de liquidación creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo acuerdo de liquidación disponible.
 *
 * @param {Object} settlementData - Datos del nuevo acuerdo de liquidación disponible.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del acuerdo de liquidación creado.
 */
export const createSettlementAvailable = async (settlementData) => {
    try {
        const response = await api.post('/settlementsAvailable', settlementData);
        return response.data;  // Devuelve los datos del acuerdo de liquidación disponible creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Actualiza un acuerdo de liquidación existente.
 *
 * @param {number|string} id - ID del acuerdo de liquidación a actualizar.
 * @param {Object} settlementData - Nuevos datos para el acuerdo de liquidación.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del acuerdo de liquidación actualizado.
 */
export const updateSettlement = async (id, settlementData) => {
    try {
        const response = await api.put(`/settlements/${id}`, settlementData);
        return response.data;  // Devuelve los datos del acuerdo de liquidación actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Elimina un acuerdo de liquidación específico.
 *
 * @param {number|string} id - ID del acuerdo de liquidación a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteSettlement = async (id) => {
    try {
        const response = await api.delete(`/settlements/${id}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

/**
 * Elimina un acuerdo de liquidación de un miembro específico.
 *
 * @param {number|string} memberId - ID del miembro cuyo acuerdo de liquidación se va a eliminar.
 * @param {number|string} settlementId - ID del acuerdo de liquidación a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteOwnSettlement = async (memberId, settlementId) => {
    try {
        const response = await api.delete(`/members/${memberId}/settlements/${settlementId}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
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
