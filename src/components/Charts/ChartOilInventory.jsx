import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";


ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * Componente de gráfica tipo donut.
 * 
 * Muestra un gráfico Doughnut para visualizar la distribución de aceites por tipo (inventarios o liquidaciones).
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.oils - Array de aceites con sus datos para mostrar en el gráfico.
 * @returns {JSX.Element} Gráfico Doughnut con la distribución de aceites.
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
          "#70AD47",
          "#A076C4",
          "#4DCBC4",
          "#ED7D31",
          "#8395A7",
          "#5A9BD5",
        ],
        hoverBackgroundColor: [
          "#609D37",
          "#9066B4",
          "#3DBABA",
          "#DD6D21",
          "#738597",
          "#4A8BC5",
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
        "rounded-2xl shadow-2xl p-6 mt-6 border",
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
