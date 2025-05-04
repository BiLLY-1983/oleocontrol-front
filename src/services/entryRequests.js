import api from '@config/api.js';

/**
 * Obtiene todas las entradas.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de entradas.
 */
export const getEntries = async () => {
    try {
        const response = await api.get('/entries');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene los datos de una entrada específica por su ID, dependiendo del rol del usuario.
 *
 * @param {number|string} id - ID de la entrada.
 * @param {Object} userData - Datos del usuario que realiza la solicitud.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la entrada.
 */
export const getEntry = async (id, userData) => {
    try {
        // Si el usuario es un socio, usamos la URL personalizada
        if (userData.user.roles.some(role => role.name === 'Socio')) {
            const memberId = userData.user.member.id;
            const response = await api.get(`/members/${memberId}/entries/${id}`);
            return response.data;
        }

        // Para otros roles (Administrador, Empleado, etc.), se usa la ruta estándar
        const response = await api.get(`/entries/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene las entradas asociadas a un miembro específico.
 *
 * @param {number|string} memberId - ID del miembro.
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de entradas del miembro.
 */
export const getEntriesForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/entries`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Crea una nueva entrada.
 *
 * @param {Object} entryData - Datos de la nueva entrada.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la entrada creada.
 */
export const createEntry = async (entryData) => {
    try {
        const response = await api.post('/entries', entryData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Actualiza una entrada existente por su ID.
 *
 * @param {number|string} id - ID de la entrada a actualizar.
 * @param {Object} entryData - Nuevos datos de la entrada.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la entrada actualizada.
 */
export const updateEntry = async (id, entryData) => {
    try {
        const response = await api.put(`/entries/${id}`, entryData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Elimina una entrada por su ID.
 *
 * @param {number|string} id - ID de la entrada a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la operación de eliminación.
 */
export const deleteEntry = async (id) => {
    try {
        const response = await api.delete(`/entries/${id}`);
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
