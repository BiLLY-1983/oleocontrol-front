import React from "react";
import { useTranslation } from "react-i18next";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";


ChartJS.register(Tooltip, Legend);

/**
 * Componente de gráfica tipo donut.
 * 
 * Representa el número de análisis realizados para cada tipo de aceite.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object.<string, number>} props.oilCounts - Objeto donde las claves son tipos de aceite y los valores el número de análisis.
 * @returns {JSX.Element} Gráfico Doughnut que muestra los análisis por tipo de aceite.
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
