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
 * Componente de gráfica de barras.
 * 
 * Muestra un gráfico de barras comparando el precio del aceite entre diferentes tipos de aceite.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array<{ name: string, price: number }>} props.oils - Lista de aceites, cada elemento debe contener un nombre (`name`) y un precio (`price`).
 * @returns {JSX.Element} Gráfico de barras con los precios de los aceites.
 */
export default function ChartOilPricesBar({ oils }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const formattedData = oils.map((oil) => ({
    name: oil.name,
    price: Number(oil.price ?? 0),
  }));

  return (
    <div
      className={clsx(
        "rounded-2xl shadow-2xl p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{t("navigation.oil_prices")}</h2>
        <p
          className={clsx(
            "text-sm",
            isDarkMode ? "text-dark-200" : "text-olive-600"
          )}
        >
          {t("navigation.oil_price_comparison")}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={488}>
        <BarChart data={formattedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#30363d" : "#d9d9d9"}
          />
          <XAxis dataKey="name" stroke={isDarkMode ? "#c9d1d9" : "#1f2615"} />
          <YAxis
            stroke={isDarkMode ? "#c9d1d9" : "#1f2615"}
            tickFormatter={(value) => `€${value.toFixed(2)}`}
          />
          <Tooltip
            formatter={(value) => [
              `€${value.toFixed(2)}`,
              t("navigation.price"),
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
            dataKey="price"
            fill={isDarkMode ? "#6e7681" : "#10b981"}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
