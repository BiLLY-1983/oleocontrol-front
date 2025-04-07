import axios from 'axios';

// Configuración dinámica de la baseURL dependiendo del entorno
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'; 

// Crear una instancia de Axios
const api = axios.create({
    baseURL,  // Usa la baseURL configurada
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,  // Timeout de 10 segundos para evitar que las solicitudes se queden colgadas
});

// Agregar un interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
            // Si el token existe, incluirlo en los headers de la solicitud
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;  // Asegurarse de retornar la configuración modificada
    },
    (error) => {
        // Manejo de errores en caso de que falle el interceptor
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response, // Devuelve la respuesta si todo está bien
    (error) => {
        // Si el error es un 401 (No autorizado), fuerza el cierre de sesión
        if (error.response && error.response.status === 401) {
            // Eliminar token y datos del usuario del localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Redirigir al login o mostrar un mensaje (según tu preferencia)
            window.location.href = '/login';  // Redirigir al login, o lo que prefieras hacer
        } else if (error.response && error.response.status === 500) {
            // Manejo de error 500 (servidor caído)
            alert('Error en el servidor. Por favor, intente nuevamente más tarde.');
        }
        
        return Promise.reject(error);
    }
);

export default api;
