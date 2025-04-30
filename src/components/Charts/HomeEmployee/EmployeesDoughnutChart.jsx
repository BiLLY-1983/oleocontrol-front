import React from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from "react-chartjs-2";
import clsx from "clsx";


/**
 * Componente de gráfica tipo donut.
 * 
 * Visualiza la distribución de empleados en diferentes áreas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.data - Objeto de configuración para Chart.js, incluyendo etiquetas y datasets.
 * @param {string} props.title - Título que se muestra sobre el gráfico.
 * @param {boolean} props.isDarkMode - Indica si debe usarse el tema oscuro.
 * @returns {JSX.Element} Gráfico Doughnut con la distribución de empleados.
 */
const EmployeesDoughnutChart = ({ data, title, isDarkMode }) => {
  const { t } = useTranslation();

  const formatTooltipLabel = (tooltipItem) => {
    const label = tooltipItem.label;
    const value = tooltipItem.raw;
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    const percent = ((value / total) * 100).toFixed(1);
    return `${label}: ${value} (${percent}%)`;
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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-center">{t(`chart_titles.${title}`, { defaultValue: title })}</h2>
      </div>
      <div className="relative" style={{ height: 488 }}>
        <Doughnut
          data={{
            ...data,
            labels: data.labels.map((label) => t(`employee_areas.${label}`, { defaultValue: label })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
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
  );
};

export default EmployeesDoughnutChart;
