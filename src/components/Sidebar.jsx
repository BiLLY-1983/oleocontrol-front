import {
    LayoutDashboard,
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
  
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
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
    return (
      <aside className="w-64 bg-white border-r h-screen flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 font-bold text-xl text-green-700">🌿 Almazara</div>
          <nav className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-green-100 cursor-pointer"
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </nav>
        </div>
  
        <div className="p-4 border-t flex items-center gap-3">
          <div className="bg-green-100 text-green-800 font-semibold w-10 h-10 flex items-center justify-center rounded-full">AP</div>
          <div>
            <div className="text-sm font-medium text-gray-800">Admin</div>
            <div className="text-xs text-gray-500">admin@almazara.com</div>
          </div>
        </div>
      </aside>
    );
  }
  