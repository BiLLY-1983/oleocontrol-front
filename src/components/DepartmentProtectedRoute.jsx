import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@context/UserContext.jsx";

/**
 * Componente de ruta protegida basado en el departamento del usuario.
 * 
 * Si el usuario no pertenece a uno de los departamentos permitidos, se redirige a la página de error 404.
 * De lo contrario, renderiza los componentes secundarios (Outlet).
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string[]} props.allowedDepartments - Lista de departamentos permitidos para acceder a la ruta.
 * @returns {JSX.Element} El componente Outlet si el usuario pertenece a un departamento permitido, o redirige a Error 404 si no.
 */
const DepartmentProtectedRoute = ({ allowedDepartments }) => {
  const { userData } = useContext(UserContext);
  const userDepartment = userData?.user?.employee?.department?.name;

  if (!allowedDepartments.includes(userDepartment)) {
    return <Navigate to="/error404" replace />;
  }

  return <Outlet />;
};

export default DepartmentProtectedRoute;