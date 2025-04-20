import { useState, useEffect, useCallback, useRef } from "react";
import { UserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getProfileRequest, logoutRequest } from "@services/authRequests";

// Duración de inactividad para cerrar sesión (expresado en milisegundos)
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // -> 1 hora

const initializeUserData = () => {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')) : null;
    return token ? { token, user } : { token: null, user: null };
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initializeUserData);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const inactivityTimer = useRef(null);

    const logout = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                await logoutRequest(token);
            } catch (e) {
                console.error("Error cerrando sesión:", e);
            }
        }
        sessionStorage.clear();
        setUserData({ token: null, user: null });
        navigate('/');
    }, [navigate]);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            console.log("Sesión cerrada por inactividad.");
            logout();
        }, INACTIVITY_TIMEOUT);
    }, [logout]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetInactivityTimer));
        resetInactivityTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, [resetInactivityTimer]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = sessionStorage.getItem('authToken');
            const storedUser = sessionStorage.getItem('userData');

            if (!token || storedUser) {
                setLoading(false);
                return;
            }

            try {
                const response = await getProfileRequest(token);
                if (response.status === "success") {
                    setUserData({ token, user: response.data });
                    sessionStorage.setItem('userData', JSON.stringify(response.data));
                }
            } catch (error) {
                logout(); // mejor que handleProfileError para cerrar sesión correctamente
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
