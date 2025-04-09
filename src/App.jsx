import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from '@context/UserProvider.jsx';
import AuthRoutes from '@components/AuthRoutes';

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
