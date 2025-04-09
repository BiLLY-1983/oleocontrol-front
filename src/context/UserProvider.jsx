import { useState, useEffect, useCallback } from "react";
import { UserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getProfileRequest } from "@services/authRequests";

// Función para inicializar los datos del usuario
const initializeUserData = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    return token ? { token, user } : { token: null, user: null };
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initializeUserData);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Manejo de errores al obtener el perfil
    const handleProfileError = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUserData({ token: null, user: null });
        navigate('/');
    }, [navigate]);

    // Obtener los datos del perfil si no están en el almacenamiento local
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('userData');
            
            // Si no hay token o usuario en el localStorage, salir
            if (!token || storedUser) {
                setLoading(false);
                return;
            }

            // Si hay token pero no usuario, intentar obtener el perfil
            try {
                const response = await getProfileRequest(token);
                if (response.status === "success") {
                    setUserData({ token, user: response.data });
                    localStorage.setItem('userData', JSON.stringify(response.data));
                }
            } catch (error) {
                handleProfileError();
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [handleProfileError]);

    return (
        <UserContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
