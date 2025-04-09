import { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from '@context/UserContext.jsx';
import authRoutes from '@routes/authRoutes.jsx';
import protectedRoutes from '@routes/protectedRoutes.jsx';
import dashboardRoutes from '@routes/dashboardRoutes.jsx';
import DashboardAdmin from '@pages/Dashboard/DashboardAdmin.jsx';
import Error404 from '@pages/Error/Error404.jsx';

function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default function AuthRoutes() {
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('userData');
        if (token && user) {
            setUserData({ token, user: JSON.parse(user) });
        }
    }, [setUserData]);

    const isAuthenticated = Boolean(userData?.token);

    return (
        <Routes>
            {/* Rutas públicas */}
            {authRoutes.map(({ path, element }, i) => (
                <Route key={`auth-${i}`} path={path} element={element} />
            ))}

            {/* Rutas protegidas */}
            {protectedRoutes.map(({ path, element }, i) => (
                <Route
                    key={`protected-${i}`}
                    path={path}
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            {element}
                        </ProtectedRoute>
                    }
                />
            ))}

            {/* Rutas del Dashboard */}
            <Route
                path="/dashboard/admin"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <DashboardAdmin />
                    </ProtectedRoute>
                }
            >
                {dashboardRoutes.map(({ path, element }, i) => (
                    <Route key={`dashboard-${i}`} path={path} element={element} />
                ))}
            </Route>

            {/* Ruta de error 404 */}
            <Route path="/error404" element={<Error404 />} />
        </Routes>
    );
}