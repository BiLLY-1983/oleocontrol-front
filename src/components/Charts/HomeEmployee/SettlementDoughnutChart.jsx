import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(Tooltip, Legend);

/**
 * Componente de gráfica tipo donut.
 * 
 * Muestra un gráfico Doughnut para visualizar el estado de las liquidaciones, incluyendo el número de liquidaciones
 * por estado y su importe total en euros.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.doughnutDataSettlements - Datos estructurados para Chart.js (labels, datasets).
 * @param {Object} props.settlementStatusCounts - Recuento total de liquidaciones por estado (Aceptada, Cancelada, Pendiente).
 * @param {Object} props.settlementTotals - Total económico por estado de liquidación, en euros.
 * @returns {JSX.Element} Gráfico Doughnut con estadísticas y tooltips personalizados.
 */
const SettlementDoughnutChart = ({
  doughnutDataSettlements,
  settlementStatusCounts,
  settlementTotals,
}) => {

  const formatTooltipLabel = (tooltipItem) => {
    const label = tooltipItem.label;
    const count = tooltipItem.raw;

    const total =
      settlementStatusCounts.Aceptada +
      settlementStatusCounts.Cancelada +
      settlementStatusCounts.Pendiente;

    const percent = ((count / total) * 100).toFixed(1);

    // Normalizamos la etiqueta para coincidir con la clave del objeto de totales
    const normalizedKey = label.replace("adas", "ada");
    const euro = settlementTotals[normalizedKey]?.toFixed(2) ?? "0.00";

    return `${label}: ${count} (${percent}%) - ${euro} €`;
  };

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
                label: formatTooltipLabel,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default SettlementDoughnutChart;
