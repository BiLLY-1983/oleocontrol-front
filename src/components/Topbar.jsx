import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Settings, Sun, Globe, User, LogOut, ChevronRight } from "lucide-react";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navigate = useNavigate();

  // Referencias a los menús
  const menuRef = useRef(null);
  const appearanceRef = useRef(null);
  const languageRef = useRef(null);

  const logout = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        appearanceRef.current &&
        !appearanceRef.current.contains(event.target) &&
        languageRef.current &&
        !languageRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsAppearanceOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-olive-50 border-b border-olive-200">
      <div></div>
      <div className="flex items-center gap-4 relative">
        <button
          className="p-2 text-olive-700 hover:bg-olive-300 hover:text-olive-800 border border-olive-500 rounded-md cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Settings size={20} />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full mt-1 right-43 w-48 bg-white shadow-lg rounded-lg border border-olive-200"
          >
            <ul className="text-olive-700">
              <li className="px-4 py-2 font-medium text-olive-800">Configuración</li>

              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer relative"
                onMouseEnter={() => setIsAppearanceOpen(true)}
                onMouseLeave={() => setIsAppearanceOpen(false)}
                ref={appearanceRef}
              >
                <Sun size={20} />
                <span className="flex items-center justify-between w-full">
                  Apariencia <ChevronRight size={16} />
                </span>
                {isAppearanceOpen && (
                  <div className="absolute top-0 left-full w-48 bg-white shadow-lg rounded-lg border border-olive-200">
                    <ul className="text-olive-700">
                      <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer">Modo Claro</li>
                      <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer">Modo Oscuro</li>
                      <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer">Sistema</li>
                    </ul>
                  </div>
                )}
              </li>

              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer relative"
                onMouseEnter={() => setIsLanguageOpen(true)}
                onMouseLeave={() => setIsLanguageOpen(false)}
                ref={languageRef}
              >
                <Globe size={20} />
                <span className="flex justify-between w-full">
                  Idioma <ChevronRight size={16} />
                </span>
                {isLanguageOpen && (
                  <div className="absolute top-0 left-full w-48 bg-white shadow-lg rounded-lg border border-olive-200">
                    <ul className="text-olive-700">
                      <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer">Español</li>
                      <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer">Inglés</li>
                    </ul>
                  </div>
                )}
              </li>

              <li className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer">
                <User size={20} />
                <span>Perfil</span>
              </li>

              <li className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer text-red-500">
                <LogOut size={16} />
                <button onClick={logout} className="w-full text-left">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="bg-olive-200 text-olive-800 font-semibold w-8 h-8 flex items-center justify-center rounded-full">AP</div>
          <div className="text-sm">
            <div className="font-medium text-olive-800">Admin</div>
            <div className="text-xs text-olive-500">admin@almazara.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
