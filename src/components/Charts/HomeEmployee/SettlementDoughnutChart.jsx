import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

// Registramos los componentes de Chart.js
ChartJS.register(Tooltip, Legend);

/**
 * Componente que muestra un gráfico de tipo Doughnut con el estado de las liquidaciones.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.doughnutDataSettlements - Datos del gráfico para el Doughnut, con la estructura esperada por Chart.js.
 * @param {Object} props.settlementStatusCounts - Objeto con los recuentos de cada estado de la liquidación (Aceptada, Cancelada, Pendiente).
 * @param {Object} props.settlementTotals - Totales de las liquidaciones por cada estado, representados en euros.
 *
 * @example
 * const data = {
 *   labels: ['Aceptadas', 'Canceladas', 'Pendientes'],
 *   datasets: [{
 *     data: [80, 15, 5],
 *     backgroundColor: ['#70AD47', '#ED7D31', '#4DCBC4'],
 *     hoverBackgroundColor: ['#609D37', '#DD6D21', '#3DBABA']
 *   }]
 * };
 * const statusCounts = { Aceptada: 80, Cancelada: 15, Pendiente: 5 };
 * const totals = { Aceptada: 1200, Cancelada: 300, Pendiente: 0 };
 *
 * <SettlementDoughnutChart
 *   doughnutDataSettlements={data}
 *   settlementStatusCounts={statusCounts}
 *   settlementTotals={totals}
 * />
 */
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
