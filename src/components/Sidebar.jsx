import { useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";

const menuItems = [
  { name: "Inicio", icon: <Home size={18} /> },
  { name: "Usuarios", icon: <Users size={18} /> },
  { name: "Roles", icon: <Shield size={18} /> },
  { name: "Empleados", icon: <Briefcase size={18} /> },
  { name: "Departamentos", icon: <Building size={18} /> },
  { name: "Socios", icon: <UserCircle size={18} /> },
  { name: "Entradas", icon: <FileText size={18} /> },
  { name: "Análisis", icon: <FlaskConical size={18} /> },
  { name: "Liquidaciones", icon: <Wallet size={18} /> },
  { name: "Aceites", icon: <Droplets size={18} /> },
];

export default function Sidebar() {
  /* Traducción */
  const { t } = useTranslation();
  /* ---------- */

  const [activeItem, setActiveItem] = useState("Inicio");

  return (
    <aside className="w-64 bg-olive-100 border-r border-olive-300 h-screen flex flex-col justify-between">
      <div>
        <div className="px-6 py-4 font-bold text-xl text-olive-800">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Login Icon"
              className="w-32"
            />
          </div>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-300 ${activeItem === item.name
                  ? "bg-olive-600 text-white"
                  : "text-olive-700 hover:bg-olive-200"
                } rounded-lg cursor-pointer`}
              onClick={() => setActiveItem(item.name)} // Cambiar el ítem activo al hacer clic
            >
              {item.icon}
              {t(item.name)}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
