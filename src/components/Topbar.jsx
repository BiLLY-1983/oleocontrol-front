import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Settings, Sun, Moon, SunMoon, Globe, User, LogOut, ChevronRight, LaptopMinimal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { UserContext } from "@context/UserContext";
import Logout from "@components/Logout";

export default function Topbar() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const { userData } = useContext(UserContext);

  if (!userData?.token) {
    return <div>No estás autenticado</div>;
  }

  const { user } = userData; 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const appearanceRef = useRef(null);
  const languageRef = useRef(null);

  const logout = () => navigate("/");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        appearanceRef.current && !appearanceRef.current.contains(event.target) &&
        languageRef.current && !languageRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsAppearanceOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-olive-700">
      <div></div>
      <div className="flex items-center gap-4 relative">
        <button
          className="p-2 text-olive-700 hover:bg-olive-300 hover:text-olive-800 border border-olive-500 rounded-md cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Settings size={18} className="text-yellow-700" />
        </button>

        {/* Menú principal */}
        <div
          ref={menuRef}
          className={`absolute top-full mt-1 right-43 w-48 bg-white shadow-lg rounded-lg border border-olive-200 
            transition-all duration-500 ease-in-out
            ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ transitionProperty: 'opacity, visibility' }}
        >
          {isMenuOpen && (
            <ul className="text-olive-700">
              <li className="px-4 py-2 font-medium text-olive-800 border-b border-olive-800">{t("settings")}</li>

              {/* Submenú: Apariencia */}
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer relative"
                onMouseEnter={() => setIsAppearanceOpen(true)}
                onMouseLeave={() => setIsAppearanceOpen(false)}
                ref={appearanceRef}
              >
                <SunMoon size={20} />
                <span className="flex items-center justify-between w-full">
                  {t("appearance")} <ChevronRight size={16} />
                </span>

                {/* Submenú de Apariencia */}
                <div
                  className={`absolute top-0 left-full w-42 bg-white shadow-lg rounded-lg border border-olive-200 
                    transition-all duration-300 ease-in-out 
                    ${isAppearanceOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  style={{ transitionProperty: 'opacity, visibility' }}
                >
                  <ul className="text-olive-700">
                    <li className="flex items-center justify-start gap-1 px-4 py-2 hover:bg-olive-100 cursor-pointer">
                      <Sun size={20} className="text-yellow-500" />Modo Claro
                    </li>
                    <li className="flex items-center justify-start gap-1 px-4 py-2 hover:bg-olive-100 cursor-pointer">
                      <Moon size={20} className="text-blue-800" />Modo Oscuro
                    </li>
                    <li className="flex items-center justify-start gap-1 px-4 py-2 hover:bg-olive-100 cursor-pointer">
                      <LaptopMinimal size={20} className="text-gray-950" />Sistema
                    </li>
                  </ul>
                </div>
              </li>

              {/* Submenú: Idioma */}
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer relative"
                onMouseEnter={() => setIsLanguageOpen(true)}
                onMouseLeave={() => setIsLanguageOpen(false)}
                ref={languageRef}
              >
                <Globe size={20} />
                <span className="flex justify-between w-full">
                {t("language")} <ChevronRight size={16} />
                </span>

                {/* Submenú de Idioma */}
                <div
                  className={`absolute top-0 left-full w-42 bg-white shadow-lg rounded-lg border border-olive-200 
                    transition-all duration-300 ease-in-out 
                    ${isLanguageOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  style={{ transitionProperty: 'opacity, visibility' }}
                >
                  <ul className="text-olive-700">
                    <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer" onClick={() => changeLanguage("es")}>🇪🇸 {t("spanish")}</li>
                    <li className="px-4 py-2 hover:bg-olive-100 cursor-pointer" onClick={() => changeLanguage("en")}>🇬🇧 {t("english")}</li>
                  </ul>
                </div>
              </li>

              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("profile");
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer"
              >
                <User size={20} />
                <span>{t("profile")}</span>
              </li>

              <li className="flex items-center gap-2 px-4 py-2 hover:bg-olive-100 cursor-pointer text-red-500">
                <Logout />
              </li>
            </ul>
          )}
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-2">
          <div className="bg-olive-700 text-white font-semibold w-8 h-8 flex items-center justify-center rounded-full">{user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}</div>
          <div className="text-sm text-left">
            <div className="font-medium text-olive-800">{user.first_name} {user.last_name}</div>
            <div className="text-xs text-olive-500">{user.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
