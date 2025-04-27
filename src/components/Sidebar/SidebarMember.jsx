import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Home,
  FileText,
  FlaskConical,
  Wallet,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Euro
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

/**
 * Definición de los elementos del menú de la barra lateral.
 * Cada objeto contiene propiedades como `name`, `icon` y `to` que representan 
 * el nombre de la ruta para traducir, el icono que se usará en el menú y la 
 * ruta a la que lleva el enlace.
 * 
 * @type {Array<Object>}
 * @property {string} name - Nombre de la ruta para la traducción.
 * @property {JSX.Element} icon - El ícono correspondiente a la ruta.
 * @property {string} to - La ruta de navegación a la que apunta el enlace.
 */
const menuItems = [
  { name: "navigation.home", icon: Home, to: "home" },
  { name: "navigation.my_entries", icon: FileText, to: "entries" },
  { name: "navigation.my_analyses", icon: FlaskConical, to: "analyses" },
  { name: "navigation.my_settlements", icon: Wallet, to: "settlements" },
  { name: "navigation.oils", icon: Droplets, to: "oils" },
  { name: "navigation.prices", icon: Euro, to: "prices" },
];

/**
 * Componente para la barra lateral (sidebar) de un miembro.
 * Permite navegar entre diferentes secciones de la aplicación.
 * Incluye la opción de colapsar el menú y adaptarse a dispositivos móviles.
 * 
 * @component
 * @example
 * <SidebarMember />
 * 
 * @returns {JSX.Element} El sidebar con la navegación para los socios.
 */
export default function SidebarMember() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isDarkMode = theme === "dark";

  /**
   * useEffect para detectar cambios en el tamaño de la ventana y ajustar el estado de la vista móvil
   */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    // Detectar al montar
    handleResize();

    // Detectar cambios de tamaño
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {!isMobile && (
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
        )}
      </div>

      {/* Menú */}
      <nav className="flex-1 px-2 space-y-1 overflow-auto">
        {menuItems.map((item, index) => (
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
