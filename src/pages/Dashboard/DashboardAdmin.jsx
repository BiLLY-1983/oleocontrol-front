import Sidebar from "@components/Sidebar";
import Topbar from "@components/Topbar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

const DashboardAdmin = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "flex min-h-screen h-screen overflow-hidden",
        isDarkMode ? "bg-dark-900" : "bg-olive-50"
      )}
    >
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen h-screen overflow-hidden",
          isDarkMode ? "bg-dark-800" : "bg-white"
        )}
      >
        <Topbar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
