import api from '@config/api.js';

/**
 * Obtiene todos los análisis registrados en el sistema.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de objetos de análisis.
 */
export const getAnalyses = async () => {
    try {
        const response = await api.get('/analyses');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene un análisis específico por ID. 
 * Si el usuario tiene rol "Socio", se utiliza una ruta personalizada.
 *
 * @param {number|string} id - ID del análisis.
 * @param {Object} userData - Objeto con los datos del usuario autenticado.
 * @param {Object} userData.user - Datos del usuario.
 * @param {Object[]} userData.user.roles - Lista de roles del usuario.
 * @param {Object} userData.user.member - Datos del miembro, si existe.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto del análisis.
 */
export const getAnalysis = async (id, userData) => {
    try {
        if (userData.user.roles.some(role => role.name === 'Socio')) {
            const memberId = userData.user.member.id;
            const response = await api.get(`/members/${memberId}/entries/${id}/analyses`);
            return response.data;
        }

        const response = await api.get(`/analyses/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene todos los análisis relacionados con un miembro específico.
 *
 * @param {number|string} memberId - ID del miembro.
 * @returns {Promise<Object[]>} Una promesa que resuelve con una lista de análisis del miembro.
 */
export const getAnalysesForMember = async (memberId) => {
    try {
        const response = await api.get(`/members/${memberId}/analyses`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Crea un nuevo análisis con los datos proporcionados.
 *
 * @param {Object} analysisData - Datos del nuevo análisis.
 * @returns {Promise<Object>} Una promesa que resuelve con el análisis creado.
 */
export const createAnalysis = async (analysisData) => {
    try {
        const response = await api.post('/analyses', analysisData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Actualiza un análisis existente identificado por su ID.
 *
 * @param {number|string} id - ID del análisis a actualizar.
 * @param {Object} analysisData - Nuevos datos del análisis.
 * @returns {Promise<Object>} Una promesa que resuelve con el análisis actualizado.
 */
export const updateAnalysis = async (id, analysisData) => {
    try {
        const response = await api.put(`/analyses/${id}`, analysisData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Elimina un análisis del sistema por su ID.
 *
 * @param {number|string} id - ID del análisis a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteAnalysis = async (id) => {
    try {
        const response = await api.delete(`/analyses/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Maneja los errores que ocurren durante las solicitudes HTTP.
 *
 * @param {Object} error - Objeto de error capturado.
 * @returns {Object} Objeto con información del error formateado.
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
