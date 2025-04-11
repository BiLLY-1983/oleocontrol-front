import api from '@config/api.js';

export const getDepartments = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getDepartment = async (id) => {
    try {
        const response = await api.get(`/departments/${id}`);
        return response.data;  // Devuelve los datos del usuario
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await api.post('/departments', departmentData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await api.put(`/departments/${id}`, departmentData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/departments/${id}`);
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