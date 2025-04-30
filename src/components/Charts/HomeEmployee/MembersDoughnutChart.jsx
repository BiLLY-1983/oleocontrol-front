import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import clsx from "clsx";


ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente de gráfica tipo donut.
 * 
 * Representa la distribución de socios según su estado (activos, inactivos, etc.).
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.doughnutData - Datos del gráfico según la estructura de Chart.js.
 * @param {string} props.title - Título del gráfico que se renderiza sobre el mismo.
 * @param {boolean} props.isDarkMode - Indica si debe usarse el tema oscuro.
 * @returns {JSX.Element} Gráfico Doughnut con la distribución de socios.
 */
const MembersDoughnutChart = ({ doughnutData, title, isDarkMode }) => {

  const formatTooltipLabel = (tooltipItem) => {
    const label = tooltipItem.label;
    const value = tooltipItem.raw;
    const total = doughnutData.datasets[0].data.reduce((a, b) => a + b, 0);
    const percent = ((value / total) * 100).toFixed(1);
    return `${label}: ${value} socios (${percent}%)`;
  };

  return (
    <div className="w-full md:w-1/3">
      <div
        className={clsx(
          "rounded-2xl shadow-2xl p-6 mt-6 border",
          isDarkMode
            ? "bg-dark-900 border-dark-700 text-dark-50"
            : "bg-olive-50 border-olive-200 text-olive-800"
        )}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
        </div>
        <div className="relative" style={{ height: 488 }}>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: formatTooltipLabel,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MembersDoughnutChart;
