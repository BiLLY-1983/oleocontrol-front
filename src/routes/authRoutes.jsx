import LandingPage from '@pages/Landing/Landing';
import LoginAdmin from '@pages/Login/LoginAdmin';
import LoginEmployee from '@pages/Login/LoginEmployee';
import LoginMember from '@pages/Login/LoginMember';
import Logout from '@components/Logout';
import Error404 from '@pages/Error/Error404';

const authRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login/admin', element: <LoginAdmin /> },
  { path: '/login/employee', element: <LoginEmployee /> },
  { path: '/login/member', element: <LoginMember /> },
  { path: '/logout', element: <Logout /> },
  { path: '*', element: <Error404 /> },
];

export default authRoutes;
