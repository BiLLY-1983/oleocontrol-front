import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Shield,
  Briefcase,
  Building,
  UserCircle,
  FileText,
  FlaskConical,
  Wallet,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const menuItems = [
  { name: "Inicio", icon: Home, to: "home" },
  { name: "Usuarios", icon: Users, to: "users" },
  { name: "Roles", icon: Shield, to: "roles" },
  { name: "Empleados", icon: Briefcase, to: "employees" },
  { name: "Departamentos", icon: Building, to: "departments" },
  { name: "Socios", icon: UserCircle, to: "members" },
  { name: "Entradas", icon: FileText, to: "entries" },
  { name: "Análisis", icon: FlaskConical, to: "analyses" },
  { name: "Liquidaciones", icon: Wallet, to: "settlements" },
  { name: "Aceites", icon: Droplets, to: "oils" },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState("Inicio");
  const [collapsed, setCollapsed] = useState(false); // Estado para contraer/expandir

  return (
    <aside
      className={`bg-olive-100 border-r border-olive-300 h-screen flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Logo + Botón de colapsar */}
      <div className="flex items-center justify-center px-4 py-4 relative border-b-1 border-olive-700 mb-5">
        <img
          src="/logo.png"
          alt="Logo"
          className={`transition-all duration-300 ${collapsed ? "w-14" : "w-32"
            }`}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-olive-600 hover:text-olive-800 transition absolute right-0"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={32} />}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index} 
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActive ? "bg-olive-600 text-white" : "text-olive-700 hover:bg-olive-200"
              } ${collapsed ? "justify-center" : ""}`
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
