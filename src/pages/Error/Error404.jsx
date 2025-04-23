import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

/**
 * Componente para mostrar una página de error 404.
 * 
 * Este componente muestra un mensaje de error cuando la página no es encontrada
 * (Error 404). Incluye un botón para regresar a la página anterior.
 * 
 * @component
 * @example
 * return (
 *   <Error404 />
 * )
 * 
 * @returns {JSX.Element} La página de error 404.
 */
const Error404 = () => {
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
        {t("error.notFound")} 
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

export default Error404;