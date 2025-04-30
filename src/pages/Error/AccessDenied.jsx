import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

/**
 * Componente para mostrar una página de acceso denegado.
 * Muestra un mensaje indicando que el acceso está restringido e incluye un botón para regresar.
 *
 * @component
 * @example
 * return (
 *   <AccessDenied />
 * )
 *
 * @returns {JSX.Element} La página de acceso denegado.
 */
const AccessDenied = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "h-screen flex flex-col justify-center items-center text-center",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1
        className={clsx(
          "text-6xl font-bold mb-4",
          isDarkMode ? "text-dark-100" : "text-olive-700"
        )}
      >
        404
      </h1>
      <p
        className={clsx(
          "text-xl mb-6",
          isDarkMode ? "text-dark-300" : "text-olive-600"
        )}
      >
        Acceso denegado 
      </p>
      <button
        onClick={() => navigate(-1)}
        className={clsx(
          "px-6 py-2 font-semibold rounded-md transition-all cursor-pointer",
          isDarkMode
            ? "bg-dark-600 text-dark-50 hover:bg-dark-500 focus:ring-dark-300"
            : "bg-olive-500 text-white hover:bg-olive-600 focus:ring-olive-400"
        )}
      >
        {t("common.goBack")}
      </button>
    </div>
  );
};

export default AccessDenied;