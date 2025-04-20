import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import { formatEuro } from "@/utils/formatEuro";

export default function ChartSettlements({ settlements }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Obtener los últimos 12 meses
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
      accepted: 0,
      cancelled: 0,
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
    };
  });

  // Clasificar y agregar las liquidaciones aceptadas y canceladas por mes y estado
  settlements.forEach((settlement) => {
    const settlementDateRes = settlement.settlement_date_res
      ? new Date(settlement.settlement_date_res)
      : null;

    // Si hay fecha de resolución (settlement_date_res), usamos esta para aceptadas y canceladas
    if (settlementDateRes) {
      const key = `${settlementDateRes.getFullYear()}-${String(
        settlementDateRes.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = last12Months.find((m) => m.key === key);

      if (month) {
        // Convertir amount y price a número
        const amount = Number(settlement.amount);
        const price = Number(settlement.price);

        // Si es aceptada, sumar al mes correspondiente
        if (settlement.settlement_status === "Aceptada") {
          month.accepted += amount * price;
        }

        // Si es cancelada, sumar al mes correspondiente
        if (settlement.settlement_status === "Cancelada") {
          month.cancelled += amount * price;
        }
      }
    }
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
        <h2 className="text-lg font-semibold">{t("settlements.management")}</h2>
        <p
          className={clsx(
            "text-sm",
            isDarkMode ? "text-dark-200" : "text-olive-600"
          )}
        >
          {t("settlements.year_evolution")}
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
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Aceptadas") {
                return [`${formatEuro(value)}`, t("settlements.accept")];
              }
              if (name === "Canceladas") {
                return [`${formatEuro(value)}`, t("settlements.cancelled")];
              }
              return [`${formatEuro(value)} €`, t("settlements.amount")];
            }}
            contentStyle={{
              backgroundColor: isDarkMode ? "#000" : "#ffffff",
              borderColor: isDarkMode ? "#30363d" : "#d9d9d9",
              color: isDarkMode ? "#c9d1d9" : "#1f2615",
            }}
            itemStyle={{
              color: isDarkMode ? "#c9d1d9" : "#1f2615",
            }}
          />
          <Legend
            wrapperStyle={{
              top: 0,
              left: 0,
              right: 0,
              marginBottom: 20,
            }}
          />
          <Bar
            dataKey="accepted"
            fill={isDarkMode ? "#3b5b7d" : "#4caf50"}
            radius={[4, 4, 0, 0]}
            name={t("settlements.accept")}
          />
          <Bar
            dataKey="cancelled"
            fill={"#9e2a2b"}
            radius={[4, 4, 0, 0]}
            name={t("settlements.cancelled")}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
