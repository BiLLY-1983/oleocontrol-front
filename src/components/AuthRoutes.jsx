import { useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "@context/UserContext.jsx";
import authRoutes from "@routes/authRoutes.jsx";
import protectedRoutes from "@routes/protectedRoutes.jsx";
import dashboardRoutesAdmin from "@routes/dashboardRoutesAdmin.jsx";
import dashboardRoutesMember from "@routes/dashboardRoutesMember.jsx";
import DepartmentProtectedRoute from "@components/DepartmentProtectedRoute";
import DashboardAdmin from "@pages/Dashboard/DashboardAdmin.jsx";
import DashboardMember from "@pages/Dashboard/DashboardMember.jsx";
import DashboardEmployee from "@pages/Dashboard/DashboardEmployee.jsx";
import HomeEmployee from "@pages/Home/HomeEmployee";
import Entries from "@pages/Entry/Entries";
import Analyses from "@pages/Analysis/Analyses";
import Employees from "@pages/Employee/Employees";
import Departments from "@pages/Department/Departments";
import Members from "@pages/Member/Members";
import Settlements from "@pages/Settlement/Settlements";
import OilsEmployee from "@pages/Oil/OilsEmployee";
import Profile from "@pages/Profile/Profile";
import Error404 from "@pages/Error/Error404.jsx";

/**
 * Componente que protege las rutas para garantizar que el usuario esté autenticado.
 * Si el usuario está autenticado, renderiza los elementos hijos, de lo contrario, redirige al inicio.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isAuthenticated - Estado de autenticación del usuario.
 * @param {JSX.Element} props.children - Elementos hijos a renderizar si el usuario está autenticado.
 * @returns {JSX.Element} - Redirección o el contenido protegido.
 */
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

/**
 * Componente principal que gestiona todas las rutas de la aplicación,
 * incluidas las rutas públicas, protegidas y de dashboards.
 * Usa el contexto de usuario para comprobar si el usuario está autenticado.
 *
 * @returns {JSX.Element} - El componente de rutas configurado.
 */
export default function AuthRoutes() {
  const { userData, setUserData } = useContext(UserContext);

  /**
   * useEffect que se ejecuta al montar el componente para verificar si el usuario ya está autenticado.
   * Si se encuentra un token de autenticación y los datos del usuario en el almacenamiento local,
   * se actualizan los datos del usuario en el contexto.
   *
   */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("userData");
    if (token && user) {
      setUserData({ token, user: JSON.parse(user) });
    }
  }, [setUserData]);

  const isAuthenticated = Boolean(userData?.token);

  return (
    <Routes>
      {/* Rutas públicas */}
      {authRoutes.map(({ path, element }, i) => (
        <Route key={`auth-${i}`} path={path} element={element} />
      ))}

      {/* Rutas protegidas */}
      {protectedRoutes.map(({ path, element }, i) => (
        <Route
          key={`protected-${i}`}
          path={path}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {element}
            </ProtectedRoute>
          }
        />
      ))}

      {/* Rutas del Dashboard Admin */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      >
        {dashboardRoutesAdmin.map(({ path, element }, i) => (
          <Route key={`dashboard-${i}`} path={path} element={element} />
        ))}
      </Route>

      {/* Rutas del Dashboard Socio */}
      <Route
        path="/dashboard/member"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardMember />
          </ProtectedRoute>
        }
      >
        {dashboardRoutesMember.map(({ path, element }, i) => (
          <Route key={`dashboard-${i}`} path={path} element={element} />
        ))}
      </Route>

      {/* Rutas del Dashboard Empleado */}
      <Route
        path="/dashboard/employee"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardEmployee />
          </ProtectedRoute>
        }
      >
        <Route
          element={
            <DepartmentProtectedRoute
              allowedDepartments={["Control de entradas"]}
            />
          }
        >
          <Route path="entries" element={<Entries />} />
        </Route>

        <Route
          element={
            <DepartmentProtectedRoute allowedDepartments={["Laboratorio"]} />
          }
        >
          <Route path="analyses" element={<Analyses />} />
        </Route>

        <Route
          element={<DepartmentProtectedRoute allowedDepartments={["RRHH"]} />}
        >
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
        </Route>

        <Route
          element={
            <DepartmentProtectedRoute allowedDepartments={["Administración"]} />
          }
        >
          <Route path="members" element={<Members />} />
        </Route>

        <Route
          element={
            <DepartmentProtectedRoute allowedDepartments={["Contabilidad"]} />
          }
        >
          <Route path="settlements" element={<Settlements />} />
        </Route>

        {/* Estas rutas sí son comunes a todos los empleados */}
        <Route path="oils" element={<OilsEmployee />} />
        <Route path="home" element={<HomeEmployee />} />
        <Route path="profile" element={<Profile />} />

        {/* Ruta de error 404 por si escriben una ruta incorrecta */}
        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Ruta de error acceso denegado */}
      <Route path="/error404" element={<Error404 />} />
    </Routes>
  );
}
