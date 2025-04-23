import axios from 'axios';

import { alert } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";


/**
 * Define la base URL para las solicitudes API, que puede variar según el entorno.
 * Si no está definida en el entorno, se usa la URL local por defecto.
 * 
 * @constant {string} baseURL
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Crea una instancia de Axios con configuración personalizada, como la base URL, los headers y el tiempo de espera (timeout).
 * 
 * @constant {AxiosInstance} api
 */
const api = axios.create({
    baseURL,  // Usa la baseURL configurada
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,  // Timeout de 10 segundos para evitar que las solicitudes se queden colgadas
});

/**
 * Interceptor para añadir el token de autenticación en cada solicitud.
 * Si el token está disponible en el localStorage, se incluye en los headers de la solicitud.
 * 
 * @function
 * @param {Object} config - La configuración de la solicitud.
 * @returns {Object} La configuración de la solicitud modificada.
 */
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

/**
 * Interceptor para manejar los errores de respuesta de las solicitudes.
 * Si la respuesta es un error 401, elimina el token y los datos del usuario.
 * Si la respuesta es un error 500, muestra una alerta al usuario.
 * 
 * @function
 * @param {Object} response - La respuesta de la solicitud.
 * @param {Object} error - El error de la respuesta.
 * @returns {Promise} Promesa con la respuesta o el error.
 */
api.interceptors.response.use(
    (response) => response, // Devuelve la respuesta si todo está bien
    (error) => {
        // Si el error es un 401 (No autorizado), fuerza el cierre de sesión
        if (error.response && error.response.status === 401) {
            // Eliminar token y datos del usuario del localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

        } else if (error.response && error.response.status === 500) {
            // Manejo de error 500 (servidor caído)
            alert({
                title: "Internal server error",
                delay: 2000,
            });
        }

        return Promise.reject(error);
    }
);

export default api;
