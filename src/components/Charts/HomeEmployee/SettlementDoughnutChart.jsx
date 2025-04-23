import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(Tooltip, Legend);

/**
 * Componente que muestra un gráfico Doughnut para visualizar el estado de las liquidaciones.
 * Presenta un resumen visual del número de liquidaciones por estado y su importe total en euros.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.doughnutDataSettlements - Datos estructurados para Chart.js (labels, datasets).
 * @param {Object} props.settlementStatusCounts - Recuento total de liquidaciones por estado (Aceptada, Cancelada, Pendiente).
 * @param {Object} props.settlementTotals - Total económico por estado de liquidación, en euros.
 *
 * @returns {JSX.Element} Elemento gráfico Doughnut con estadísticas y tooltips personalizados.
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
const SettlementDoughnutChart = ({
  doughnutDataSettlements,
  settlementStatusCounts,
  settlementTotals,
}) => {
  /**
   * Función que genera el texto para el tooltip del gráfico.
   *
   * @param {Object} tooltipItem - Información del punto del gráfico.
   * @returns {string} Texto con el número, porcentaje y total en euros por estado.
   */
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
