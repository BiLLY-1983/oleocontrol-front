import DashboardAdmin from '@pages/Dashboard/DashboardAdmin';
import DashboardEmployee from '@pages/Dashboard/DashboardEmployee';
import DashboardMember from '@pages/Dashboard/DashboardMember';
import Profile from '@pages/Profile/Profile';
import ProtectedRoute from '@components/ProtectedRoute';

const protectedRoutes = [
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute role="Administrador">
        <DashboardAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/employee',
    element: (
      <ProtectedRoute role="Empleado">
        <DashboardEmployee />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/member',
    element: (
      <ProtectedRoute role="Socio">
        <DashboardMember />
      </ProtectedRoute>
    ),
  },
];

export default protectedRoutes;
