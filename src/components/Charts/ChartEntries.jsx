import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

/**
 * Componente que muestra un gráfico de barras con la evolución de las entradas de aceituna en los últimos 12 meses.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.entries - Lista de entradas de aceituna, cada entrada debe tener una fecha (`entry_date`) y una cantidad de aceituna (`olive_quantity`).
 * 
 * @example
 * const entries = [
 *   { entry_date: "2024-03-12", olive_quantity: 1500 },
 *   { entry_date: "2024-02-20", olive_quantity: 2000 },
 *   // Más entradas...
 * ];
 * 
 * <ChartEntries entries={entries} />
 */
export default function ChartEntries({ entries }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const today = new Date();
  const last12Months = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (11 - index),
      1
    );
    return {
      label: date.toLocaleDateString("default", {
        month: "short",
        year: "2-digit",
      }),
      value: 0,
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
    };
  });

  entries.forEach((entry) => {
    const entryDate = new Date(entry.entry_date);
    const key = `${entryDate.getFullYear()}-${String(
      entryDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const month = last12Months.find((m) => m.key === key);
    if (month) month.value += Number(entry.olive_quantity ?? 0) / 1000;
  });

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {t("navigation.olive_entries")}
        </h2>
        <p
          className={clsx(
            "text-sm",
            isDarkMode ? "text-dark-200" : "text-olive-600"
          )}
        >
          {t("navigation.year_evolution")}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={last12Months}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#30363d" : "#d9d9d9"}
          />
          <XAxis dataKey="label" stroke={isDarkMode ? "#c9d1d9" : "#1f2615"} />
          <YAxis
            stroke={isDarkMode ? "#c9d1d9" : "#1f2615"}
            tickFormatter={(value) => `${value.toFixed(2)}t`}
          />
          <Tooltip
            formatter={(value) => [
              `${value.toFixed(2)} t`,
              t("navigation.entries"),
            ]}
            contentStyle={{
              backgroundColor: isDarkMode ? "#000" : "#ffffff",
              borderColor: isDarkMode ? "#30363d" : "#d9d9d9",
              color: isDarkMode ? "#c9d1d9" : "#1f2615",
            }}
            itemStyle={{
              color: isDarkMode ? "#c9d1d9" : "#1f2615",
            }}
          />
          <Bar
            dataKey="value"
            fill={isDarkMode ? "#6e7681" : "#556339"}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
