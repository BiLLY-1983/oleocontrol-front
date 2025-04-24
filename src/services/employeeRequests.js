import api from '@config/api.js';

/**
 * Funciones para manejar los empleados.
 * Estas funciones realizan solicitudes HTTP a la API para obtener, crear, actualizar y eliminar empleados.
 */

export const getEmployees = async () => {
    try {
        const response = await api.get('/employees');
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const getEmployee = async (id) => {
    try {
        const response = await api.get(`/employees/${id}`);
        return response.data;  // Devuelve los datos del usuario
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const createEmployee = async (employeeData) => {
    try {
        const response = await api.post('/employees', employeeData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const updateEmployee = async (id, employeeData) => {
    try {
        const response = await api.put(`/employees/${id}`, employeeData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await api.delete(`/employees/${id}`);
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