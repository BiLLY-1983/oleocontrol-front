import api from '@config/api.js';

/**
 * Obtiene todos los acuerdos de liquidación de aceite.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de acuerdos de liquidación de aceite.
 */
export const getOilSettlements = async () => {
    try {
        const response = await api.get('/oil-settlements');
        return response.data;  // Devuelve los datos de todos los acuerdos de liquidación
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Obtiene los acuerdos de liquidación de aceite para un socio específico.
 *
 * @param {number|string} memberId - ID del socio.
 * @returns {Promise<Object[]>} Una promesa que resuelve con los acuerdos de liquidación de aceite del socio.
 */
export const getOilSettlementsForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/oil-settlements`);
        return response.data;  // Devuelve los datos de los acuerdos de liquidación del socio
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo acuerdo de liquidación de aceite.
 *
 * @param {Object} oilSettlementData - Datos del nuevo acuerdo de liquidación.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del acuerdo de liquidación creado.
 */
export const createOilSettlement = async (oilSettlementData) => {
    try {
        const response = await api.post('/oil-settlements', oilSettlementData);
        return response.data;  // Devuelve los datos del acuerdo de liquidación creado
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
