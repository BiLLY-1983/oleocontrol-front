import { useState, useContext } from "react";
import { UserContext } from "@context/UserContext";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Home,
  Briefcase,
  Building,
  UserCircle,
  FileText,
  FlaskConical,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

const menuItems = [
  { name: "navigation.oils", icon: Droplets, to: "oils" },
];

// Diccionario de menús por departamento
const departmentMenus = {
  Contabilidad: [
    { name: "navigation.home", icon: Home, to: "home" },
    { name: "navigation.settlements", icon: FlaskConical, to: "settlements" },
    { name: "navigation.oils", icon: Droplets, to: "oils" },
  ],
  Laboratorio: [
    { name: "navigation.home", icon: Home, to: "home" },
    { name: "navigation.analyses", icon: FlaskConical, to: "analyses" },
    { name: "navigation.oils", icon: Droplets, to: "oils" },
  ],
  "Control de entradas": [
    { name: "navigation.home", icon: Home, to: "home" },
    { name: "navigation.entries", icon: FileText, to: "entries" },
    { name: "navigation.oils", icon: Droplets, to: "oils" },
  ],
  RRHH: [
    { name: "navigation.home", icon: Home, to: "home" },
    { name: "navigation.employees", icon: Briefcase, to: "employees" },
    { name: "navigation.departments", icon: Building, to: "departments" },
    { name: "navigation.oils", icon: Droplets, to: "oils" },
  ],
  Administración: [
    { name: "navigation.home", icon: Home, to: "home" },
    { name: "navigation.members", icon: UserCircle, to: "members" },
    { name: "navigation.oils", icon: Droplets, to: "oils" },
  ],
};

export default function SidebarEmployee() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const isDarkMode = theme === "dark";

  const { userData } = useContext(UserContext);
  const departmentName = userData.user.employee?.department?.name;

  const filteredMenuItems = departmentMenus[departmentName] || menuItems;

  return (
    <aside
      className={clsx(
        "flex flex-col min-h-screen h-screen overflow-hidden transition-all duration-300 border-r",
        collapsed ? "w-20" : "w-64",
        isDarkMode
          ? "bg-dark-900 border-dark-700"
          : "bg-olive-100 border-olive-300"
      )}
    >
      {/* Logo + Botón de colapsar */}
      <div
        className={clsx(
          "flex items-center justify-center px-4 py-4 relative border-b mb-5",
          isDarkMode ? "border-dark-600" : "border-olive-700"
        )}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className={clsx(
            "transition-all duration-300",
            collapsed ? "w-14" : "w-32"
          )}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "hover:opacity-80 transition absolute right-0",
            isDarkMode ? "text-dark-200" : "text-olive-600"
          )}
        >
          {collapsed ? (
            <ChevronRight size={20} className="cursor-pointer" />
          ) : (
            <ChevronLeft size={32} className="cursor-pointer" />
          )}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-2 space-y-1 overflow-auto">
        {filteredMenuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                collapsed && "justify-center",
                isActive
                  ? isDarkMode
                    ? "bg-dark-700 text-dark-50"
                    : "bg-olive-600 text-white"
                  : isDarkMode
                  ? "text-dark-200 hover:bg-dark-800"
                  : "text-olive-700 hover:bg-olive-200"
              )
            }
          >
            <item.icon size={18} />
            {!collapsed && <span>{t(item.name)}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
