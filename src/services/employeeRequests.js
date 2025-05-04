import api from '@config/api.js';

/**
 * Obtiene la lista de todos los empleados.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de empleados.
 */
export const getEmployees = async () => {
    try {
        const response = await api.get('/employees');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene los datos de un empleado por su ID.
 *
 * @param {number|string} id - ID del empleado.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del empleado.
 */
export const getEmployee = async (id) => {
    try {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Crea un nuevo empleado.
 *
 * @param {Object} employeeData - Datos del nuevo empleado.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del empleado creado.
 */
export const createEmployee = async (employeeData) => {
    try {
        const response = await api.post('/employees', employeeData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Actualiza un empleado existente por su ID.
 *
 * @param {number|string} id - ID del empleado a actualizar.
 * @param {Object} employeeData - Nuevos datos del empleado.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del empleado actualizado.
 */
export const updateEmployee = async (id, employeeData) => {
    try {
        const response = await api.put(`/employees/${id}`, employeeData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Elimina un empleado por su ID.
 *
 * @param {number|string} id - ID del empleado a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la operación de eliminación.
 */
export const deleteEmployee = async (id) => {
    try {
        const response = await api.delete(`/employees/${id}`);
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
