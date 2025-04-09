import Home from '../pages/Home/Home.jsx';

const dashboardRoutes = [
    { path: "/", element: <Home />, exact: true },
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
    { path: "*", element: <Error404 /> }
];

export default dashboardRoutes;
