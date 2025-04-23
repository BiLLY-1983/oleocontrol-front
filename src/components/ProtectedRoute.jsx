import { Navigate } from 'react-router-dom';

/**
 * Función que gestiona la ruta protegida.
 * Si el usuario está autenticado, se renderiza el contenido de la ruta.
 * De lo contrario, redirige al usuario a la página principal.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isAuthenticated - Indicador de autenticación del usuario.
 * @param {JSX.Element} props.children - Elementos que se renderizarán si el usuario está autenticado.
 * @returns {JSX.Element} Componente de ruta protegida o redirección.
 */
const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;