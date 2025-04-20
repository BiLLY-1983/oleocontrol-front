import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import clsx from "clsx";

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const MembersDoughnutChart = ({ doughnutData, title, isDarkMode }) => {
  return (
    <div className="w-full md:w-1/3">
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
                    label: (tooltipItem) => {
                      const label = tooltipItem.label;
                      const value = tooltipItem.raw;
                      const total =
                        doughnutData.datasets[0].data.reduce((a, b) => a + b, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return `${label}: ${value} socios (${percent}%)`;
                    },
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
