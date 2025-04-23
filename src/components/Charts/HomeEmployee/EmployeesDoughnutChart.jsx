import React from 'react';
import { Doughnut } from "react-chartjs-2";
import clsx from "clsx";

/**
 * Componente que muestra un gráfico tipo doughnut para visualizar
 * la distribución de empleados en diferentes áreas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.data - Objeto de configuración para Chart.js, incluyendo etiquetas y datasets.
 * @param {string} props.title - Título que se muestra sobre el gráfico.
 * @param {boolean} props.isDarkMode - Si está activado el modo oscuro, se aplican estilos oscuros.
 *
 * @returns {JSX.Element} Elemento JSX que contiene el gráfico Doughnut y su encabezado.
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
  /**
   * Callback para formatear las etiquetas del tooltip, mostrando el valor y su porcentaje.
   *
   * @function
   * @param {Object} tooltipItem - Objeto con la información del elemento del gráfico.
   * @param {string} tooltipItem.label - Etiqueta del elemento.
   * @param {number} tooltipItem.raw - Valor asociado al elemento.
   * @returns {string} Cadena formateada con el valor y su porcentaje respecto al total.
   */
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
