import api from '@config/api.js';

export const getEntries = async () => {
    try {
        const response = await api.get('/entries');
        return response.data;  // Devuelve los datos de todas las entradas
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getEntry = async (id, userData) => {
    try {
        // Si el usuario es un socio, usamos la URL personalizada
        if (userData.user.roles.some(role => role.name === 'Socio')) {
            const memberId = userData.user.member.id;
            const response = await api.get(`/members/${memberId}/entries/${id}`);
            return response.data;  // Devuelve los datos de la entrada
        }

        // Para otros roles (Administrador, Empleado, etc.), se usa la ruta estándar
        const response = await api.get(`/entries/${id}`);
        return response.data;  // Devuelve los datos de la entrada
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getEntriesForMember = async (memberId) => {
        try {
            const response = await api.get(`/members/${memberId}/entries`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
};

export const createEntry = async (entryData) => {
    try {
        const response = await api.post('/entries', entryData);
        return response.data;  // Devuelve los datos de la entrada creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const updateEntry = async (id, entryData) => {
    try {
        const response = await api.put(`/entries/${id}`, entryData);
        return response.data;  // Devuelve los datos de la entrada actualizada
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const deleteEntry = async (id) => {
    try {
        const response = await api.delete(`/entries/${id}`);
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