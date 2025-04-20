import HomeEmployee from '@pages/Home/HomeEmployee';
import Entries from '@pages/Entry/Entries';
import Analyses from '@pages/Analysis/Analyses';
import Employees from '@pages/Employee/Employees';
import Departments from '@pages/Department/Departments';
import Members from '@pages/Member/Members';
import Settlements from '@pages/Settlement/Settlements';
import OilsEmployee from '@pages/Oil/OilsEmployee';
import Profile from '@pages/Profile/Profile';
import Error404 from '@pages/Error/Error404';

const dashboardRoutesEmployee = [
  { path: "home", element: <HomeEmployee /> },
  { path: "entries", element: <Entries /> },
  { path: "analyses", element: <Analyses /> },
  { path: "employees", element: <Employees /> },
  { path: "departments", element: <Departments /> },
  { path: "members", element: <Members /> },
  { path: "settlements", element: <Settlements /> },
  { path: "oils", element: <OilsEmployee /> },
  { path: "profile", element: <Profile /> },
  { path: "*", element: <Error404 /> },
];

export default dashboardRoutesEmployee;
