import api from '@config/api.js';

/**
 * Funciones para manejar los acuerdos de liquidación de aceite en la API.
 * Estas funciones permiten obtener, crear, actualizar y eliminar acuerdos de liquidación.
 */

// Obtener todos los acuerdos de liquidación
export const getOilSettlements = async () => {
    try {
        const response = await api.get('/oil-settlements');
        return response.data;  // Devuelve los datos de todos los acuerdos de liquidación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

// Obtener los acuerdos de liquidación para un socio específico
export const getOilSettlementsForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/oil-settlements`);
        return response.data;  // Devuelve los datos de los acuerdos de liquidación del socio
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

// Crear un nuevo acuerdo de liquidación
export const createOilSettlement = async (oilSettlementData) => {
    try {
        const response = await api.post('/oil-settlements', oilSettlementData);
        return response.data;  // Devuelve los datos del acuerdo de liquidación creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};


// Manejar errores
const handleError = (error) => {
    if (error.response) {
        // Si la respuesta es un error desde el servidor
        console.error('Error en la respuesta:', error.response);
        return { success: false, message: error.response.data.message || 'Error desconocido' };
    } else if (error.request) {
        // Si no se recibió respuesta del servidor
        console.error('No se recibió respuesta:', error.request);
        return { success: false, message: 'No se recibió respuesta del servidor' };
    } else {
        // Si ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
        return { success: false, message: error.message };
    }
};
