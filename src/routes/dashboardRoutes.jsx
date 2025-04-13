import Home from '@pages/Home/Home';
import Users from '@pages/User/Users';
import Entry from '@pages/Entry/Entry';
import Analysis from '@pages/Analysis/Analysis';
import Roles from '@pages/Role/Roles';
import Employee from '@pages/Employee/Employee';
import Departments from '@pages/Department/Departments';
import Members from '@pages/Member/Members';
import Settlement from '@pages/Settlement/Settlement';
import Oil from '@pages/Oil/Oil';
import Profile from '@pages/Profile/Profile';
import Error404 from '@pages/Error/Error404';

const dashboardRoutes = [
    { path: "home", element: <Home /> },
    { path: "users", element: <Users /> },
    { path: "entries", element: <Entry /> },
    { path: "analyses", element: <Analysis /> },
    { path: "roles", element: <Roles /> },
    { path: "employees", element: <Employee /> },
    { path: "departments", element: <Departments /> },
    { path: "members", element: <Members /> },
    { path: "settlements", element: <Settlement /> },
    { path: "oils", element: <Oil /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <Error404 /> }
];

export default dashboardRoutes;
