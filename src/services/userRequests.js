import api from '@config/api.js';

// Obtener todos los usuarios (solo accesible por admin)
export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;  // Devuelve los datos de todos los usuarios
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

// Obtener un usuario por ID
export const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;  // Devuelve los datos del usuario
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

// Crear un nuevo usuario (solo accesible por admin)
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;  // Devuelve los datos del usuario creado
    } catch (error) {
        console.error("Error en createUser:", error.response?.data || error.message);
        return handleError(error); // Maneja el error si ocurre
    }
};

// Actualizar un usuario (solo accesible por admin)
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;  // Devuelve los datos del usuario actualizado
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

// Eliminar un usuario (solo accesible por admin)
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;  // Devuelve la respuesta con el estado de la eliminación
    } catch (error) {
        return handleError(error); // Maneja el error si ocurre
    }
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email, username) => {
    try {
        const response = await api.post('/reset-password-request', {
            email,
            username,
        });
        return response.data;  
    } catch (error) {
        return handleError(error); 
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