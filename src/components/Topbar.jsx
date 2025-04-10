import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Settings,
  Sun,
  Moon,
  SunMoon,
  Globe,
  User,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { UserContext } from "@context/UserContext";
import Logout from "@components/Logout";
import { useTheme } from "@context/ThemeContext";

export default function Topbar() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const { userData } = useContext(UserContext);
  const { theme, setTheme } = useTheme();

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDarkMode = theme === "dark";

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-6 py-4 border-b",
        isDarkMode ? "bg-dark-800 border-dark-700" : "bg-white border-olive-700"
      )}
    >
      <div></div>
      <div className="flex justify-center items-center gap-4 relative">
        <button
          className={clsx(
            "p-2 border rounded-md cursor-pointer transition",
            isDarkMode
              ? "text-dark-200 bg-dark-800 border-dark-600 hover:bg-dark-900"
              : "text-olive-700 bg-olive-100 border-olive-500 hover:bg-olive-300"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Settings size={18} />
        </button>

        {/* Menú principal */}
        <div
          ref={menuRef}
          className={clsx(
            "absolute top-full mt-1 right-43 w-48 shadow-lg rounded-lg border transition-all duration-500 ease-in-out",
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
            isDarkMode
              ? "bg-dark-800 border-dark-600"
              : "bg-white border-olive-200"
          )}
          style={{ transitionProperty: "opacity, visibility" }}
        >
          {isMenuOpen && (
            <ul
              className={clsx(isDarkMode ? "text-dark-200" : "text-olive-700")}
            >
              <li
                className={clsx(
                  "px-4 py-2 font-medium border-b",
                  isDarkMode
                    ? "text-dark-50 border-dark-700"
                    : "text-olive-800 border-olive-800"
                )}
              >
                {t("settings")}
              </li>

              {/* Submenú: Apariencia */}
              <li
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer relative transition",
                  isDarkMode ? "hover:bg-dark-600" : "hover:bg-olive-100"
                )}
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
                  className={clsx(
                    "absolute top-0 left-full w-42 shadow-lg rounded-lg border transition-all duration-300 ease-in-out",
                    isAppearanceOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible",
                    isDarkMode
                      ? "bg-dark-800 border-dark-600"
                      : "bg-white border-olive-200"
                  )}
                  style={{ transitionProperty: "opacity, visibility" }}
                >
                  <ul>
                    <li
                      className={clsx(
                        "flex items-center gap-1 px-4 py-2 cursor-pointer transition",
                        isDarkMode
                          ? "hover:bg-dark-600 text-dark-200"
                          : "hover:bg-olive-100 text-olive-700"
                      )}
                      onClick={() => setTheme("light")}
                    >
                      <Sun size={18} className="text-yellow-500" />
                      Modo Claro
                    </li>
                    <li
                      className={clsx(
                        "flex items-center gap-1 px-4 py-2 cursor-pointer transition",
                        isDarkMode
                          ? "hover:bg-dark-600 text-dark-200"
                          : "hover:bg-olive-100 text-olive-700"
                      )}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon size={18} className="text-blue-800" />
                      Modo Oscuro
                    </li>
                  </ul>
                </div>
              </li>

              {/* Submenú: Idioma */}
              <li
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer relative transition",
                  isDarkMode ? "hover:bg-dark-600" : "hover:bg-olive-100"
                )}
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
                  className={clsx(
                    "absolute top-0 left-full w-42 shadow-lg rounded-lg border transition-all duration-300 ease-in-out",
                    isLanguageOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible",
                    isDarkMode
                      ? "bg-dark-800 border-dark-600"
                      : "bg-white border-olive-200"
                  )}
                  style={{ transitionProperty: "opacity, visibility" }}
                >
                  <ul
                    className={clsx(
                      isDarkMode ? "text-dark-200" : "text-olive-700"
                    )}
                  >
                    <li
                      className={clsx(
                        "px-4 py-2 cursor-pointer transition",
                        isDarkMode ? "hover:bg-dark-600" : "hover:bg-olive-100"
                      )}
                      onClick={() => changeLanguage("es")}
                    >
                      🇪🇸 {t("spanish")}
                    </li>
                    <li
                      className={clsx(
                        "px-4 py-2 cursor-pointer transition",
                        isDarkMode ? "hover:bg-dark-600" : "hover:bg-olive-100"
                      )}
                      onClick={() => changeLanguage("en")}
                    >
                      🇬🇧 {t("english")}
                    </li>
                  </ul>
                </div>
              </li>

              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("profile");
                }}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer transition",
                  isDarkMode
                    ? "hover:bg-dark-600 text-dark-200"
                    : "hover:bg-olive-100 text-olive-700"
                )}
              >
                <User size={20} />
                <span>{t("profile")}</span>
              </li>

              <li
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer transition text-red-500",
                  isDarkMode ? "hover:bg-dark-600" : "hover:bg-olive-100"
                )}
              >
                <Logout />
              </li>
            </ul>
          )}
        </div>

        {/* Perfil */}
        <div
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md transition",
            isDarkMode
              ? " text-dark-200"
              : " text-olive-700"
          )}
        >
          <div
            className={clsx(
              "font-semibold w-8 h-8 flex items-center justify-center rounded-full",
              isDarkMode
                ? "bg-dark-700 text-dark-50"
                : "bg-olive-700 text-white"
            )}
          >
            {user.first_name.charAt(0).toUpperCase()}
            {user.last_name.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm text-left">
            <div
              className={clsx(
                "font-medium",
                isDarkMode ? "text-dark-50" : "text-olive-800"
              )}
            >
              {user.first_name} {user.last_name}
            </div>
            <div
              className={clsx(
                "text-xs",
                isDarkMode ? "text-dark-200" : "text-olive-500"
              )}
            >
              {user.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
