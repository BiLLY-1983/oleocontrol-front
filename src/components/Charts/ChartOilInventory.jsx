import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * Componente de Gráfico de Doughnut para los aceites por tipo (Inventarios o Liquidaciones)
 *
 * @param {Object} props
 * @param {Array} props.oils - Array de aceites con sus datos para mostrar en el gráfico.
 * @returns {JSX.Element} El componente renderizado con el gráfico.
 */
const ChartOilInventory = ({ oils }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const labels = oils.map((oil) => oil.oil_name);
  const data = oils.map((oil) => oil.total_quantity || oil.total_amount); 

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Cantidad de Aceite",
        data: data,
        backgroundColor: [
          "#4CAF50", "#FF9800", "#FF5722", "#2196F3", 
        ],
        borderColor: "#FFFFFF", 
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t("home.oil_distribution"), 
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} Litros`;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div
      className={clsx(
        "rounded-2xl shadow p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >

      <div className="mt-6 flex justify-center h-100">
        <div className="w-full max-w-md">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartOilInventory;
