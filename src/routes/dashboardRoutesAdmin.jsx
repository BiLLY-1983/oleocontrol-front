import HomeAdmin from '@pages/Home/HomeAdmin';
import Users from '@pages/User/Users';
import Entries from '@pages/Entry/Entries';
import Analyses from '@pages/Analysis/Analyses';
import Roles from '@pages/Role/Roles';
import Employees from '@pages/Employee/Employees';
import Departments from '@pages/Department/Departments';
import Members from '@pages/Member/Members';
import Settlements from '@pages/Settlement/Settlements';
import Oils from '@pages/Oil/Oils';
import Profile from '@pages/Profile/Profile';
import Error404 from '@pages/Error/Error404';

const dashboardRoutesAdmin = [
    { path: "home", element: <HomeAdmin /> },
    { path: "users", element: <Users /> },
    { path: "entries", element: <Entries /> },
    { path: "analyses", element: <Analyses /> },
    { path: "roles", element: <Roles /> },
    { path: "employees", element: <Employees /> },
    { path: "departments", element: <Departments /> },
    { path: "members", element: <Members /> },
    { path: "settlements", element: <Settlements /> },
    { path: "oils", element: <Oils /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <Error404 /> }
];

export default dashboardRoutesAdmin;
