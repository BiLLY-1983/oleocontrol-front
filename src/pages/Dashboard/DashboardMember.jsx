import SidebarMember from "@components/Sidebar/SidebarMember";
import Topbar from "@components/Topbar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

/**
 * DashboardMember
 * 
 * Componente layout principal para los usuarios con rol de miembro (ej. agricultores).
 * Incluye la barra lateral específica del miembro, la barra superior y el área de contenido.
 * 
 * @returns {JSX.Element} Estructura del dashboard de miembro.
 */
const DashboardMember = () => {
  /**
   * Hook para obtener el tema actual (oscuro o claro).
   * @type {Object}
   * @property {string} theme - El tema actual, puede ser "dark" o "light".
   */
  const { theme } = useTheme();
  
  /**
   * Determina si el modo oscuro está activado.
   * @type {boolean}
   */
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "flex min-h-screen h-screen overflow-hidden",
        isDarkMode ? "bg-dark-900" : "bg-olive-50"
      )}
    >
      <SidebarMember />
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

export default DashboardMember;
