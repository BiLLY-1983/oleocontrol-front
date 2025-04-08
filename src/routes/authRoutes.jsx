import { Navigate } from 'react-router-dom';
import LoginMember from '../pages/members/LoginMember/LoginMember.jsx';
import LoginEmployee from '../pages/employees/LoginEmployee/LoginEmployee.jsx';
import LoginAdmin from '../pages/admins/LoginAdmin/LoginAdmin.jsx';
import DashboardMember from '../pages/members/DashboardMember/DashboardMember.jsx';
import DashboardEmployee from '../pages/employees/DashboardEmployee/DashboardEmployee.jsx';
import DashboardAdmin from '../pages/admins/DashboardAdmin/DashboardAdmin.jsx';
import Error404 from '../pages/Error404/Error404.jsx';

const authRoutes = [
    { 
        path: '/', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Socio') 
                ? <Navigate to="/dashboard/member/home" replace /> 
                : <Navigate to="/dashboard/employee/home" replace />) 
            : <Navigate to="/login/member" replace />
    },
    { 
        path: '/login/member', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Socio') 
                ? <Navigate to="/dashboard/member/home" replace /> 
                : <Navigate to="/login/member" replace />) 
            : <LoginMember />
    },
    { 
        path: '/login/employee', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Empleado') 
                ? <Navigate to="/dashboard/employee/home" replace /> 
                : <Navigate to="/login/employee" replace />) 
            : <LoginEmployee />
    },
    { 
        path: '/login/admin', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Administrador') 
                ? <Navigate to="/dashboard/admin/home" replace /> 
                : <Navigate to="/login/admin" replace />) 
            : <LoginAdmin />
    },
    { 
        path: '/members', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Socio') 
                ? <Navigate to="/dashboard/member/home" replace /> 
                : <Navigate to="/login/member" replace />) 
            : <LoginMember />
    },
    { 
        path: '/employees', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Empleado') 
                ? <Navigate to="/dashboard/employee/home" replace /> 
                : <Navigate to="/login/employee" replace />) 
            : <LoginEmployee />
    },
    { 
        path: '/dashboard/member/*', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Socio') 
                ? <DashboardMember /> 
                : <Navigate to="/login/member" replace />) 
            : <Navigate to="/login/member" replace />
    },
    { 
        path: '/dashboard/employee/*', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Empleado') 
                ? <DashboardEmployee /> 
                : <Navigate to="/login/employee" replace />) 
            : <Navigate to="/login/employee" replace />
    },
    { 
        path: '/dashboard/admin/*', 
        element: (isAuthenticated, userRoles) => isAuthenticated 
            ? (userRoles.includes('Administrador') 
                ? <DashboardAdmin /> 
                : <Navigate to="/login/admin" replace />) 
            : <Navigate to="/login/admin" replace />
    },
    { 
        path: '*', 
        element: <Error404 /> 
    }
];

export default authRoutes;