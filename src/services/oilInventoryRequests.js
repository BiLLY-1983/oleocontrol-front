import api from '@config/api.js';

/**
 * Funciones para manejar los inventarios de aceite en la API.
 * Estas funciones permiten obtener, crear, actualizar y eliminar inventarios de aceite.
 */

// Obtener todos los inventarios de aceite
export const getOilInventories = async () => {
    try {
        const response = await api.get('/oil-inventories');
        return response.data;  // Devuelve los datos de todos los inventarios de aceite
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};


// Obtener los inventarios de aceite para un socio específico
export const getOilInventoriesForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/oil-inventories`);
        return response.data;  // Devuelve los datos de los inventarios de aceite del socio
    } catch (error) {
        return handleError(error);  // Maneja el error si ocurre
    }
};

// Crear un nuevo inventario de aceite
export const createOilInventory = async (oilInventoryData) => {
    try {
        const response = await api.post('/oil-inventories', oilInventoryData);
        return response.data;  // Devuelve los datos del inventario de aceite creado
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
