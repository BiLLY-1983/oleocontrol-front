import Home from '@pages/Home/Home';
import User from '@pages/User/User';
import Entry from '@pages/Entry/Entry';
import Analysis from '@pages/Analysis/Analysis';
import Role from '@pages/Role/Role';
import Employee from '@pages/Employee/Employee';
import Department from '@pages/Department/Department';
import Member from '@pages/Member/Member';
import Settlement from '@pages/Settlement/Settlement';
import Oil from '@pages/Oil/Oil';
import Profile from '@pages/Profile/Profile';
import Error404 from '@pages/Error/Error404';

const dashboardRoutes = [
    { path: "home", element: <Home /> },
    { path: "users", element: <User /> },
    { path: "entries", element: <Entry /> },
    { path: "analyses", element: <Analysis /> },
    { path: "roles", element: <Role /> },
    { path: "employees", element: <Employee /> },
    { path: "departments", element: <Department /> },
    { path: "members", element: <Member /> },
    { path: "settlements", element: <Settlement /> },
    { path: "oils", element: <Oil /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <Error404 /> }
];

export default dashboardRoutes;
