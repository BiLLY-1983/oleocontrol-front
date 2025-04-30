import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente de tarjeta de estadísticas.
 * 
 * Muestra un título, un valor y un subtexto opcional. El estilo y el texto son sensibles al tema actual (oscuro o claro).
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título de la tarjeta, que se traduce usando el hook de i18n.
 * @param {string|number} props.value - Valor que se muestra de forma destacada en la tarjeta.
 * @param {string} [props.subtext] - Subtexto opcional que se muestra debajo del valor, también traducido.
 * @returns {JSX.Element} Componente de tarjeta con el título, valor y subtexto (si se proporciona).
 */
export default function StatCard({ title, value, subtext }) {
  const { theme } = useTheme();
  const { t } = useTranslation(); 
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl shadow-2xl p-4 w-full border",
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
        {t(title)} 
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && (
        <div
          className={clsx(
            "text-xs mt-1",
            isDarkMode ? "text-dark-400" : "text-olive-500"
          )}
        >
          {t(subtext)}
        </div>
      )}
    </div>
  );
}
