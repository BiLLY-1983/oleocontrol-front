import api from '@config/api.js';

export const getSettlements = async () => {
    try {
        const response = await api.get('/settlements');
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getSettlement = async (id) => {
    try {
        const response = await api.get(`/settlements/${id}`);
        return response.data;  // Devuelve los datos del usuario
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getSettlementsByMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/settlements`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
  
export const createSettlement = async (settlementData) => {
    try {
        const response = await api.post('/settlements', settlementData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const createSettlementAvailable = async (settlementData) => {
    try {
        const response = await api.post('/settlementsAvailable', settlementData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const updateSettlement = async (id, settlementData) => {
    try {
        const response = await api.put(`/settlements/${id}`, settlementData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const deleteSettlement = async (id) => {
    try {
        const response = await api.delete(`/settlements/${id}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
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