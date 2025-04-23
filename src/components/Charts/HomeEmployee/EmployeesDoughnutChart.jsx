import React from 'react';
import { Doughnut } from "react-chartjs-2";
import clsx from "clsx";

/**
 * Componente que muestra un gráfico doughnut para representar datos relacionados con empleados.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.data - Datos del gráfico, compatibles con Chart.js.
 * @param {string} props.title - Título que se muestra encima del gráfico.
 * @param {boolean} props.isDarkMode - Determina si se usa el modo oscuro para aplicar estilos.
 * 
 * @example
 * const data = {
 *   labels: ['Administración', 'Contabilidad', 'Laboratorio'],
 *   datasets: [
 *     {
 *       data: [10, 20, 15],
 *       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
 *       hoverBackgroundColor: ['#FF6384CC', '#36A2EBCC', '#FFCE56CC']
 *     }
 *   ]
 * };
 * 
 * <EmployeesDoughnutChart
 *   data={data}
 *   title="Distribución de empleados"
 *   isDarkMode={false}
 * />
 */
const EmployeesDoughnutChart = ({ data, title, isDarkMode }) => {
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
        <h2 className="text-lg font-semibold text-center">{title}</h2>
      </div>
      <div className="relative" style={{ height: 488 }}>
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const label = tooltipItem.label;
                    const value = tooltipItem.raw;
                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} (${percent}%)`;
                  },
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
