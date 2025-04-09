import DashboardAdmin from '@pages/Dashboard/DashboardAdmin';
import DashboardEmployee from '@pages/Dashboard/DashboardEmployee';
import DashboardMember from '@pages/Dashboard/DashboardMember';
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
    path: '/dashboard/empleado',
    element: (
      <ProtectedRoute role="Empleado">
        <DashboardEmployee />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/socio',
    element: (
      <ProtectedRoute role="Socio">
        <DashboardMember />
      </ProtectedRoute>
    ),
  },
];

export default protectedRoutes;
