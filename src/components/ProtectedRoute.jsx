// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '@context/UserContext';
import useUserAuth from '@hooks/useUserAuth'; 

const ProtectedRoute = ({ role, department, children }) => {
  const { userData } = useContext(UserContext);
  const { hasRole, hasDepartment } = useUserAuth();  // Usamos el hook aquí

  if (!userData || !userData.token) {
    return <Navigate to="/" replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }

  if (department && !hasDepartment(department)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
