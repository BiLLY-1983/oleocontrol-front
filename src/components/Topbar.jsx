import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Bell, Settings } from "lucide-react";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Función para el cierre de sesión
  const logout = () => {
    // Lógica de cierre de sesión, puedes eliminar el token o limpiar el estado
    navigate("/"); // Redirigir a la página principal o a donde desees
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div></div>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 text-gray-600 hover:text-green-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)} >
          <Settings />
        </button>

        {/* Menú desplegable de configuración */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg dark:bg-gray-700">
            <ul className="text-gray-700 dark:text-white">
              
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-800 font-semibold w-8 h-8 flex items-center justify-center rounded-full">AP</div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">Admin</div>
            <div className="text-xs text-gray-500">admin@almazara.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
