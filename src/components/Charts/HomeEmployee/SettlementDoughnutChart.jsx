import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

// Registramos los componentes de Chart.js
ChartJS.register(Tooltip, Legend);

const SettlementDoughnutChart = ({ doughnutDataSettlements, settlementStatusCounts, settlementTotals }) => {
  return (
    <div className="relative" style={{ height: 488 }}>
      <Doughnut
        data={doughnutDataSettlements}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label;
                  const count = tooltipItem.raw;
                  const total =
                    settlementStatusCounts.Aceptada +
                    settlementStatusCounts.Cancelada +
                    settlementStatusCounts.Pendiente;
                  const percent = ((count / total) * 100).toFixed(1);

                  const euro =
                    settlementTotals[
                      label.replace("adas", "ada") // transforma "Aceptadas" -> "Aceptada"
                    ]?.toFixed(2) ?? "0.00";

                  return `${label}: ${count} (${percent}%) - ${euro} €`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default SettlementDoughnutChart;
