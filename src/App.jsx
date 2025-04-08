import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProvider from '@context/UserProvider';
import LandingPage from '@pages/Landing/Landing';
import Error404 from '@pages/Error/Error404';
import LoginAdmin from '@pages/Login/LoginAdmin';
import LoginEmployee from '@pages/Login/LoginEmployee';
import LoginMember from '@pages/Login/LoginMember';
import DashboardAdmin from '@pages/Dashboard/DashboardAdmin';
import DashboardEmployee from '@pages/Dashboard/DashboardEmployee';
import DashboradMember from '@pages/Dashboard/DashboardMember';
import ProtectedRoute from '@components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Pública */}
          <Route path="/" element={<LandingPage />} />

          {/* Logins */}
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/login/employee" element={<LoginEmployee />} />
          <Route path="/login/member" element={<LoginMember />} />

          {/* Protegidas */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute role="Administrador">
              <DashboardAdmin />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/empleado" element={
            <ProtectedRoute role="Empleado">
              <DashboardEmployee />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/socio" element={
            <ProtectedRoute role="Socio">
              <DashboradMember />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
