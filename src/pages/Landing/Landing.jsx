import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@context/UserContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

/**
 * Página de bienvenida de la aplicación, que muestra opciones de inicio de sesión.
 *
 * Esta página muestra un mensaje de bienvenida y tres botones de inicio de sesión, cada uno dirigido
 * a una ruta diferente en función del rol del usuario: "Administrador", "Empleado" y "Socio". Si el usuario ya
 * tiene un token y un rol asignado, será redirigido automáticamente a su página correspondiente al cargar la página.
 *
 * @component
 * @returns {JSX.Element} La estructura de la página de bienvenida con opciones de inicio de sesión.
 */
const LandingPage = () => {
  const { userData } = useContext(UserContext);
  const { theme } = useTheme();
  const { t } = useTranslation(); // Hook para traducciones
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.token && userData.user?.role) {
      switch (userData.user.role) {
        case "admin":
          navigate("/admin"); // Redirige a la página de administrador
          break;
        case "empleado":
          navigate("/empleado"); // Redirige a la página de empleado
          break;
        case "socio":
          navigate("/socio"); // Redirige a la página de socio
          break;
        default:
          break; // Si no tiene rol o el rol no es válido, no hace nada
      }
    }
  }, [userData, navigate]);

  return (
    <div
      className={clsx(
        "min-h-screen flex items-center justify-center px-4",
        isDarkMode ? "bg-dark-800 text-white" : "bg-olive-50 text-olive-900"
      )}
    >
      <div
        className={clsx(
          "w-full max-w-md rounded-2xl shadow-lg p-8 text-center transition-colors",
          isDarkMode ? "bg-dark-900" : "bg-white"
        )}
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-48" />
        </div>
        <h1 className="text-3xl font-semibold mb-2">
          {t("landing.welcome")}{" "}
        </h1>
        <p
          className={clsx(
            "text-sm mb-8",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          {t("landing.select_login")}{" "}
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login/admin")}
            className={clsx(
              "py-2 px-4 rounded-xl font-medium transition cursor-pointer",
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-olive-600 hover:bg-olive-700 text-white"
            )}
          >
            {t("landing.admin")} 
          </button>
          <button
            onClick={() => navigate("/login/employee")}
            className={clsx(
              "py-2 px-4 rounded-xl font-medium transition cursor-pointer",
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-olive-600 hover:bg-olive-700 text-white"
            )}
          >
            {t("landing.employee")}
          </button>
          <button
            onClick={() => navigate("/login/member")}
            className={clsx(
              "py-2 px-4 rounded-xl font-medium transition cursor-pointer",
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-olive-600 hover:bg-olive-700 text-white"
            )}
          >
            {t("landing.member")} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
