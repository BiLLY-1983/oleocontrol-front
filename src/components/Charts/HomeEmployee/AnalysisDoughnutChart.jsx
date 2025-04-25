import React from "react";
import { useTranslation } from "react-i18next";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(Tooltip, Legend);

/**
 * Componente que muestra un gráfico tipo doughnut representando el número de análisis
 * realizados para cada tipo de aceite.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object.<string, number>} props.oilCounts - Objeto donde las claves son tipos de aceite y los valores el número de análisis.
 *
 * @returns {JSX.Element} Elemento JSX que renderiza el gráfico Doughnut.
 *
 * @example
 * const oilCounts = {
 *   "Aceite de Oliva Virgen Extra": 8,
 *   "Aceite de Oliva Virgen": 5,
 *   "Aceite de Oliva Lampante": 3
 * };
 *
 * <OilAnalysisDoughnutChart oilCounts={oilCounts} />
 */
const OilAnalysisDoughnutChart = ({ oilCounts }) => {
  const { t } = useTranslation();
  /**
   * Datos para el gráfico doughnut, generados dinámicamente a partir del objeto `oilCounts`.
   *
   * @type {Object}
   */
  const doughnutOilData = {
    labels: Object.keys(oilCounts),
    datasets: [
      {
        data: Object.values(oilCounts),
        backgroundColor: [
          "#5A9BD5",
          "#70AD47",
          "#A076C4",
          "#4DCBC4",
          "#ED7D31",
          "#8395A7",
        ],
        hoverBackgroundColor: [
          "#4A8BC5",
          "#609D37",
          "#9066B4",
          "#3DBABA",
          "#DD6D21",
          "#738597",
        ],
      },
    ],
  };

  /**
   * Callback que personaliza el contenido del tooltip para mostrar el porcentaje de cada tipo de aceite.
   *
   * @function
   * @param {Object} tooltipItem - Objeto con la información del elemento del gráfico.
   * @param {string} tooltipItem.label - Etiqueta del tipo de aceite.
   * @param {number} tooltipItem.raw - Valor asociado al tipo de aceite.
   * @returns {string} Cadena formateada con la cantidad y el porcentaje.
   */
  const formatTooltipLabel = (tooltipItem) => {
    const label = tooltipItem.label;
    const value = tooltipItem.raw;
    const total = Object.values(oilCounts).reduce((a, b) => a + b, 0);
    const percent = ((value / total) * 100).toFixed(1);
    return `${label}: ${value} ${t('analysis')} (${percent}%)`;
  };

  return (
    <div className="relative" style={{ height: 488 }}>
      <Doughnut
        data={doughnutOilData}
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
  );
};

export default OilAnalysisDoughnutChart;
