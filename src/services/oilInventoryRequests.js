import api from '@config/api.js';

/**
 * Obtiene todos los inventarios de aceite.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de inventarios de aceite.
 */
export const getOilInventories = async () => {
    try {
        const response = await api.get('/oil-inventories');
        return response.data;  // Devuelve los datos de todos los inventarios de aceite
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Obtiene los inventarios de aceite para un socio específico.
 *
 * @param {number|string} memberId - ID del socio.
 * @returns {Promise<Object[]>} Una promesa que resuelve con los datos de los inventarios de aceite del socio.
 */
export const getOilInventoriesForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/oil-inventories`);
        return response.data;  // Devuelve los datos de los inventarios de aceite del socio
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

/**
 * Crea un nuevo inventario de aceite.
 *
 * @param {Object} oilInventoryData - Datos del nuevo inventario de aceite.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del inventario de aceite creado.
 */
export const createOilInventory = async (oilInventoryData) => {
    try {
        const response = await api.post('/oil-inventories', oilInventoryData);
        return response.data;  // Devuelve los datos del inventario de aceite creado
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
