import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@context/UserContext.jsx";

const DepartmentProtectedRoute = ({ allowedDepartments }) => {
  const { userData } = useContext(UserContext);
  const userDepartment = userData?.user?.employee?.department?.name;

  if (!allowedDepartments.includes(userDepartment)) {
    return <Navigate to="/error404" replace />;
  }

  return <Outlet />;
};

export default DepartmentProtectedRoute;