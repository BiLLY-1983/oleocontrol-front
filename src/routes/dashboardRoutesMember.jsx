import HomeMember from '@pages/Home/HomeMember';
import EntriesMember from '@pages/Entry/EntriesMember';
import AnalysesMember from '@pages/Analysis/AnalysesMember';
import SettlementsMember from '@pages/Settlement/SettlementsMember';
import OilsMember from '@pages/Oil/OilsMember';
import OilPrices from '@pages/OilPrices/OilPrices';
import Profile from '@pages/Profile/Profile';
import Error404 from '@pages/Error/Error404';

/**
 * @description Rutas del dashboard para el rol de socio.
 */
const dashboardRoutesMember = [
    { path: "home", element: <HomeMember /> },
    { path: "entries", element: <EntriesMember /> },
    { path: "analyses", element: <AnalysesMember /> },
    { path: "settlements", element: <SettlementsMember /> },
    { path: "oils", element: <OilsMember /> },
    { path: "prices", element: <OilPrices /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <Error404 /> }
];

export default dashboardRoutesMember;
