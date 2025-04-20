import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(Tooltip, Legend);

const OilAnalysisDoughnutChart = ({ oilCounts }) => {
  const doughnutOilData = {
    labels: Object.keys(oilCounts),
    datasets: [
      {
        data: Object.values(oilCounts),
        backgroundColor: [
          "#5A9BD5", // Azul Desaturado
          "#70AD47", // Verde Desaturado
          "#A076C4", // Púrpura Desaturado
          "#4DCBC4", // Teal Desaturado
          "#ED7D31", // Naranja Desaturado (como contraste)
          "#8395A7", // Gris Azulado
        ],
        hoverBackgroundColor: [
          "#4A8BC5", // Azul un poco más intenso
          "#609D37", // Verde un poco más intenso
          "#9066B4", // Púrpura un poco más intenso
          "#3DBABA", // Teal un poco más intenso
          "#DD6D21", // Naranja un poco más intenso
          "#738597", // Gris Azulado un poco más intenso
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
