import SidebarEmployee from "@components/Sidebar/SidebarEmployee";
import Topbar from "@components/Topbar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

/**
 * Layout principal para los usuarios con rol de empleado.
 * Incluye barra lateral, barra superior y área de contenido.
 *
 * @component
 * @returns {JSX.Element} Estructura del dashboard de empleado.
 */
const DashboardEmployee = () => {

  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "flex min-h-screen h-screen overflow-hidden",
        isDarkMode ? "bg-dark-900" : "bg-olive-50"
      )}
    >
      <SidebarEmployee />
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen h-screen overflow-hidden",
          isDarkMode ? "bg-dark-800" : "bg-white"
        )}
      >
        <Topbar />
        <div className="flex-1 flex flex-col overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardEmployee;
