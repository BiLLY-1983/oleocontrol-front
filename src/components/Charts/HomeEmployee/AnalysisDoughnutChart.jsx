import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(Tooltip, Legend);

/**
 * Componente que muestra un gráfico tipo doughnut con el análisis de tipos de aceite.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object.<string, number>} props.oilCounts - Objeto con los tipos de aceite como claves y el número de análisis como valores.
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
                label: (tooltipItem) => {
                  const label = tooltipItem.label;
                  const value = tooltipItem.raw;
                  const total = Object.values(oilCounts).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} análisis (${percent}%)`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default OilAnalysisDoughnutChart;
