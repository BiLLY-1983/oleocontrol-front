import api from '@config/api.js';

/**
 * Obtiene la lista de todos los departamentos.
 *
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de departamentos.
 */
export const getDepartments = async () => {
    try {
        const response = await api.get('/departments');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Obtiene los datos de un departamento por su ID.
 *
 * @param {number|string} id - ID del departamento.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del departamento.
 */
export const getDepartment = async (id) => {
    try {
        const response = await api.get(`/departments/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Crea un nuevo departamento.
 *
 * @param {Object} departmentData - Datos del nuevo departamento.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del departamento creado.
 */
export const createDepartment = async (departmentData) => {
    try {
        const response = await api.post('/departments', departmentData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Actualiza un departamento existente por su ID.
 *
 * @param {number|string} id - ID del departamento a actualizar.
 * @param {Object} departmentData - Nuevos datos del departamento.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del departamento actualizado.
 */
export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await api.put(`/departments/${id}`, departmentData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Elimina un departamento por su ID.
 *
 * @param {number|string} id - ID del departamento a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la operación de eliminación.
 */
export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/departments/${id}`);
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
