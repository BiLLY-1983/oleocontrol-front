import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from '@context/UserProvider.jsx';
import AuthRoutes from '@components/AuthRoutes';

/**
 * Componente principal de la aplicación.
 * Este componente envuelve la aplicación en un contexto de usuario y define las rutas de autenticación.
 */
const App = () => {

  return (
    <Router>
      <UserProvider>
        <AuthRoutes />
      </UserProvider>
    </Router>
  );
};

export default App;
