import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

const data = [
  { name: "Ene", value: 410 },
  { name: "Feb", value: 310 },
  { name: "Mar", value: 200 },
  { name: "Abr", value: 280 },
  { name: "May", value: 180 },
  { name: "Jun", value: 240 },
];

export default function ChartSection() {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Usar el contexto del tema
  const [tab, setTab] = useState("Entradas");

  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">{t("Entradas de Aceituna")}</h2>
          <p
            className={clsx(
              "text-sm",
              isDarkMode ? "text-dark-200" : "text-olive-600"
            )}
          >
            {t("Evolución mensual de entradas de aceituna en la campaña actual")}
          </p>
        </div>
        <div className="flex gap-2">
          {["Entradas", "Aceites"].map((name) => (
            <button
              key={name}
              className={clsx(
                "px-4 py-1 text-sm rounded-full border cursor-pointer transition-all duration-300",
                tab === name
                  ? isDarkMode
                    ? "bg-dark-700 text-dark-50 border-dark-400"
                    : "bg-olive-600 text-white border-olive-300"
                  : isDarkMode
                  ? "bg-dark-800 text-dark-200 border-dark-600 hover:bg-dark-700"
                  : "bg-white text-olive-600 border-olive-200 hover:bg-olive-100"
              )}
              onClick={() => setTab(name)}
            >
              {t(name)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#30363d" : "#d9d9d9"}
          />
          <XAxis
            dataKey="name"
            stroke={isDarkMode ? "#c9d1d9" : "#1f2615"}
            tickFormatter={(tick) => t(tick)}
          />
          <YAxis stroke={isDarkMode ? "#c9d1d9" : "#1f2615"} />
          <Tooltip
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
            fill={isDarkMode ? "#21262d" : "#556339"}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}