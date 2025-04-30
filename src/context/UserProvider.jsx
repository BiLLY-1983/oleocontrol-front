import { useState, useEffect, useCallback, useRef } from "react";
import { UserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getProfileRequest, logoutRequest } from "@services/authRequests";

/** 
 * Duración de inactividad para cerrar sesión (expresado en milisegundos)
 */ 
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // -> 1 hora

/**
 * Inicializa los datos del usuario desde localStorage.
 * Recupera el token de autenticación y la información del usuario.
 * 
 * @returns {Object} Objeto con el token y los datos del usuario.
 */
const initializeUserData = () => {
    const token = localStorage.getItem('authToken'); 
    const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null; 
    return token ? { token, user } : { token: null, user: null };
};

/**
 * Proveedor del contexto del usuario.
 * 
 * Gestiona el estado del usuario autenticado, incluyendo el token, los datos del perfil y el manejo de inactividad.
 * También proporciona funciones para cerrar sesión y actualizar los datos del usuario.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {JSX.Element} props.children - Componentes hijos que estarán envueltos por el proveedor.
 * @returns {JSX.Element} Proveedor del contexto del usuario.
 */
const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initializeUserData);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const inactivityTimer = useRef(null);

    /**
     * Función para cerrar sesión y limpiar los datos almacenados.
     * También realiza la redirección al inicio (ruta '/').
     */
    const logout = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                await logoutRequest(token);
            } catch (e) {
                console.error("Error cerrando sesión:", e);
            }
        }
        localStorage.clear(); 
        setUserData({ token: null, user: null });
        navigate('/');
    }, [navigate]);

    /**
     * Función para reiniciar el temporizador de inactividad. 
     * Se reinicia cada vez que el usuario interactúa con la página (movimiento, teclas, clics, desplazamiento).
     */
    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            console.log("Sesión cerrada por inactividad.");
            logout();
        }, INACTIVITY_TIMEOUT);
    }, [logout]);

    /**
     * useEffect que se encarga de gestionar la inactividad del usuario. 
     * Se configuran varios eventos para detectar la actividad del usuario 
     * (movimiento del ratón, teclas presionadas, clics y desplazamiento). 
     * Si el usuario no interactúa con la página durante el tiempo especificado, 
     * la sesión se cerrará automáticamente.
     * 
     * Se ejecuta una vez al montar el componente y se limpia al desmontarse o
     * cuando cambian las dependencias.
     */
    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetInactivityTimer));
        resetInactivityTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, [resetInactivityTimer]);

    /**
     * useEffect que se ejecuta al montar el componente y tiene como objetivo
     * obtener los datos del perfil del usuario desde el backend, si el token de autenticación
     * está presente en el almacenamiento local. 
     * 
     * Si el token existe y no hay datos de usuario, se realiza una solicitud al backend para 
     * obtener los datos del perfil. Si la solicitud es exitosa, se actualiza el estado y 
     * se guardan los datos en localStorage. Si la solicitud falla, se cierra la sesión.
     * 
     * Este efecto también depende de la función `logout`, que se utiliza para cerrar sesión
     * en caso de error.
     */
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('userData'); 

            if (!token || storedUser) {
                setLoading(false);
                return;
            }

            try {
                const response = await getProfileRequest(token);
                if (response.status === "success") {
                    setUserData({ token, user: response.data });
                    localStorage.setItem('userData', JSON.stringify(response.data)); 
                }
            } catch (error) {
                logout(); 
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [logout]);

    return (
        <UserContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
