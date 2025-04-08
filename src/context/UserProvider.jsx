import { useState, useEffect, useCallback } from "react";
import { UserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getProfileRequest } from "@services/authRequests";

const initializeUserData = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    return token ? { token, user } : { token: null, user: null };
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initializeUserData);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleProfileError = useCallback(() => {
        console.error("Error al obtener el perfil del usuario");
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUserData({ token: null, user: null });
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('userData');
            if (token && !storedUser) {
                try {
                    const response = await getProfileRequest(token);
                    if (response.status === "success") {
                        setUserData({ token, user: response.data });
                        localStorage.setItem('userData', JSON.stringify(response.data));
                    }
                } catch (error) {
                    handleProfileError();
                }
            }
            setLoading(false);
        };

        fetchProfileData();
    }, [handleProfileError]);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUserData({ token: null, user: null });
        navigate('/login');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;