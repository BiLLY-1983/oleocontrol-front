import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

const AccessDenied = () => {
  const { t } = useTranslation(); // Hook para traducciones
  const { theme } = useTheme(); // Hook para el tema
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
        Acceso denegado {/* Traducción para "Página no encontrada" */}
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
        {t("common.goBack")} {/* Traducción para "Volver atrás" */}
      </button>
    </div>
  );
};

export default AccessDenied;