import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente que muestra un gráfico circular (Pie Chart) con el estado actual
 * de las liquidaciones: Pendientes, Aceptadas y Canceladas.
 *
 * También muestra el total en euros de las liquidaciones aceptadas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.settlements - Array de objetos de liquidación. Cada objeto debe contener:
 *  - `settlement_status`: Estado de la liquidación ("Pendiente", "Aceptada" o "Cancelada").
 *  - `amount`: Cantidad de aceite liquidada.
 *  - `price`: Precio por litro.
 *  - `created_at`: Fecha de creación de la liquidación.
 *
 * @returns {JSX.Element} El componente visualiza un gráfico de pastel con la distribución de los estados de liquidación y el total de las liquidaciones aceptadas.
 *
 * @example
 * const settlements = [
 *   {
 *     settlement_status: "Aceptada",
 *     amount: 1200,
 *     price: 3.2,
 *     created_at: "2024-06-15"
 *   },
 *   {
 *     settlement_status: "Cancelada",
 *     amount: 900,
 *     price: 2.8,
 *     created_at: "2024-07-20"
 *   }
 * ];
 *
 * <ChartSettlementsHome settlements={settlements} />
 */
export default function ChartSettlementsHome({ settlements }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [settlementData, setSettlementData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalAmountAccepted, setTotalAmountAccepted] = useState(0);
  const [totalAmountCancelled, setTotalAmountCancelled] = useState(0);
  const [totalLast12Months, setTotalLast12Months] = useState(0);

  useEffect(() => {
    if (!settlements || settlements.length === 0) return;

    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const pendingSettlements = settlements.filter(
      (s) => s.settlement_status === "Pendiente"
    );
    const acceptedSettlements = settlements.filter(
      (s) => s.settlement_status === "Aceptada"
    );
    const cancelledSettlements = settlements.filter(
      (s) => s.settlement_status === "Cancelada"
    );

    const acceptedAmount = acceptedSettlements.reduce(
      (sum, s) => sum + Number(s.amount) * Number(s.price),
      0
    );
    const cancelledAmount = cancelledSettlements.reduce(
      (sum, s) => sum + Number(s.amount) * Number(s.price),
      0
    );

    setTotalAmountAccepted(acceptedAmount);
    setTotalAmountCancelled(cancelledAmount);

    const acceptedLast12Months = acceptedSettlements.filter((s) => {
      const date = new Date(s.created_at);
      return date >= twelveMonthsAgo && date <= now;
    });

    const cancelledLast12Months = cancelledSettlements.filter((s) => {
      const date = new Date(s.created_at);
      return date >= twelveMonthsAgo && date <= now;
    });

    const totalAccepted12 = acceptedLast12Months.reduce(
      (sum, s) => sum + Number(s.amount) * Number(s.price),
      0
    );
    const totalCancelled12 = cancelledLast12Months.reduce(
      (sum, s) => sum + Number(s.amount) * Number(s.price),
      0
    );

    setTotalLast12Months(totalAccepted12 + totalCancelled12);

    const chartData = {
      labels: [
        t("settlements.pending"),
        t("settlements.accept"),
        t("settlements.cancelled"),
      ],
      datasets: [
        {
          data: [
            pendingSettlements.length,
            acceptedSettlements.length,
            cancelledSettlements.length,
          ],
          backgroundColor: ["#EFC341", "#4CAF50", "#9E2A2B"],
          hoverBackgroundColor: ["#B39500", "#2D572C", "#7B3C2F"],
        },
      ],
    };

    setSettlementData(chartData);
  }, [settlements, t]);

  return (
    <div
      className={clsx(
        "rounded-2xl shadow-2xl p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <h2 className="text-xl font-semibold">{t("home.settlement_status")}</h2>

      <div className="mt-20 flex justify-center h-100">
        <div className="w-full max-w-sm">
          <Pie
            data={settlementData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {},
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-lg font-medium">
          {t("settlements.accept") + ": " +
            totalAmountAccepted.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + " €"}
        </div>
      </div>
    </div>
  );
}
