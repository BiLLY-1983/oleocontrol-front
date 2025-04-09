import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProvider from '@context/UserProvider';
import authRoutes from '@routes/authRoutes';
import protectedRoutes from '@routes/protectedRoutes';
import dashboardRoutes from '@routes/dashboardRoutes';
import DashboardAdmin from '@pages/Dashboard/DashboardAdmin';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {authRoutes.map(({ path, element }, i) => (
            <Route key={`auth-${i}`} path={path} element={element} />
          ))}
          {protectedRoutes.map(({ path, element }, i) => (
            <Route key={`protected-${i}`} path={path} element={element} />
          ))}

          <Route path="/dashboard/admin" element={<DashboardAdmin />}>
            {dashboardRoutes.map(({ path, element }, i) => (
              <Route key={`dashboard-${i}`} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
