import api from '@config/api.js';

export const getAnalyses = async () => {
    try {
        const response = await api.get('/analyses');
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getAnalysis = async (id, userData) => {
    try {
        // Si el usuario es un socio, usamos la URL personalizada
        if (userData.user.roles.some(role => role.name === 'Socio')) {
            const memberId = userData.user.member.id;
            const response = await api.get(`/members/${memberId}/entries/${id}/analyses`);
            return response.data;  // Devuelve los datos del análisis
        }

        // Para otros roles (Administrador, Empleado, etc.), se usa la ruta estándar
        const response = await api.get(`/analyses/${id}`);
        return response.data;  // Devuelve los datos del análisis
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const createAnalysis = async (analysisData) => {
    try {
        const response = await api.post('/analyses', analysisData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const updateAnalysis = async (id, analysisData) => {
    try {
        const response = await api.put(`/analyses/${id}`, analysisData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const deleteAnalysis = async (id) => {
    try {
        const response = await api.delete(`/analyses/${id}`);
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