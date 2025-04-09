import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

export default function StatCard({ title, value, subtext }) {
  const { theme } = useTheme(); // Usar el contexto del tema
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-4 w-full border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <div
        className={clsx(
          "text-sm font-medium",
          isDarkMode ? "text-dark-200" : "text-olive-600"
        )}
      >
        {title}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && (
        <div
          className={clsx(
            "text-xs mt-1",
            isDarkMode ? "text-dark-400" : "text-olive-500"
          )}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}