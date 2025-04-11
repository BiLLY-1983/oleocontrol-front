import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

const Error404 = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "h-screen flex flex-col justify-center items-center text-center",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-whie text-olive-800"
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
        {t("error.notFound") || "Lo sentimos, la página que buscas no existe."}
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
        {t("common.goBack") || "Volver atrás"}
      </button>
    </div>
  );
};

export default Error404;
