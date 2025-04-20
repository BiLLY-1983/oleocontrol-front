import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";


export default function StatCard({ title, value, subtext }) {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Hook para traducciones
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-4 w-full border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-100 border-olive-200 text-olive-800"
      )}
    >
      <div
        className={clsx(
          "text-sm font-medium",
          isDarkMode ? "text-dark-200" : "text-olive-600"
        )}
      >
        {t(title)} {/* Traducción del título */}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && (
        <div
          className={clsx(
            "text-xs mt-1",
            isDarkMode ? "text-dark-400" : "text-olive-500"
          )}
        >
          {t(subtext)} {/* Traducción del subtexto */}
        </div>
      )}
    </div>
  );
}
