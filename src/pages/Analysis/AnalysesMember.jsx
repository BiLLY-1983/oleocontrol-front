import React from "react";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";


const AnalysesMember = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      Análisis Socio
    </div>
  );
};

export default AnalysesMember;
