import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

// Registro de los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartOilsByType({ oilByType }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [oilData, setOilData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalOil, setTotalOil] = useState(0);

  useEffect(() => {
    if (!oilByType || Object.keys(oilByType).length === 0) {
      return;
    }

    // Calculamos el total de aceite
    const total = Object.values(oilByType).reduce((sum, quantity) => sum + quantity, 0);
    setTotalOil(total);

    // Preparar los datos para el gráfico
    const chartData = {
      labels: Object.keys(oilByType),
      datasets: [
        {
          label: "Cantidad de Aceite (L)",
          data: Object.values(oilByType),
          backgroundColor: [
            "#70AD47",
            "#A076C4",
            "#4DCBC4",
            "#ED7D31",
            "#8395A7",
            "#5A9BD5",
            "#F1C40F", 
            "#E74C3C",
            "#9B59B6",
          ],
          hoverBackgroundColor: [
            "#609D37",
            "#9066B4",
            "#3DBABA",
            "#DD6D21",
            "#738597",
            "#4A8BC5",
            "#D4B80B",
            "#C0392B",
            "#8E44AD",
          ],
        },
      ],
    };

    setOilData(chartData);
  }, [oilByType]);

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <h2 className="text-xl font-semibold">{t("home.oil_distribution")}</h2>

      <div className="mt-20 flex justify-center h-100">
        <div className="w-full max-w-sm">
          <Doughnut
            data={oilData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const quantity = tooltipItem.raw;
                      return `${tooltipItem.label}: ${quantity.toLocaleString()} L`;
                    },
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-lg font-medium">
          {t("home.total_oil")}: {totalOil} L
        </div>
      </div>
    </div>
  );
}
