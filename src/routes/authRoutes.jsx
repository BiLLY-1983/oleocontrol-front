import LandingPage from '@pages/Landing/Landing';
import LoginAdmin from '@pages/Login/LoginAdmin';
import LoginEmployee from '@pages/Login/LoginEmployee';
import LoginMember from '@pages/Login/LoginMember';
import Logout from '@components/Logout';
import ForgotPassword from '@pages/ForgotPassword/ForgotPassword';
import Error404 from '@pages/Error/Error404';

/**
 * @description Rutas de autenticación
 */
const authRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login/admin', element: <LoginAdmin /> },
  { path: '/login/employee', element: <LoginEmployee /> },
  { path: '/login/member', element: <LoginMember /> },
  { path: '/logout', element: <Logout /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '*', element: <Error404 /> },
];

export default authRoutes;
