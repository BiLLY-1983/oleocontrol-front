import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente de gráfica tipo donut.
 * 
 * Muestra un gráfico Doughnut con la distribución de los aceites obtenidos a partir de los análisis de rendimiento de las aceitunas.
 * También muestra el total de litros de aceite obtenidos.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.oils - Array de aceites disponibles. Cada objeto debe contener:
 *  - `name`: Nombre del aceite.
 *  - `price`: Precio por litro.
 * @param {Array} props.analyses - Array de análisis. Cada objeto debe contener:
 *  - `yield`: Porcentaje de rendimiento del análisis.
 *  - `entry.olive_quantity`: Cantidad de aceituna analizada.
 *  - `oil.name`: Nombre del aceite resultante del análisis.
 * @returns {JSX.Element} Gráfico Doughnut con la distribución de los aceites.
 */
export default function ChartOils({ oils, analyses }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [oilData, setOilData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalOil, setTotalOil] = useState(0);

  useEffect(() => {
    if (!oils || !analyses || oils.length === 0 || analyses.length === 0) {
      return;
    }

    const oilQuantities = oils.map((oil) => ({
      name: oil.name,
      quantity: 0,
      price: oil.price,
    }));

    analyses.forEach((analysis) => {
      if (analysis.oil && analysis.oil.name && analysis.yield) {
        const oliveQuantity = analysis.entry.olive_quantity;
        const yieldRate = analysis.yield / 100; // Convertir el rendimiento a porcentaje
        const oilQuantity = oliveQuantity * yieldRate;

        const oil = oilQuantities.find((oil) => oil.name === analysis.oil.name);
        if (oil) {
          oil.quantity += oilQuantity;
        }
      }
    });

    const total = oilQuantities.reduce((sum, oil) => sum + oil.quantity, 0);
    setTotalOil(total);

    const chartData = {
      labels: oilQuantities.map((oil) => oil.name),
      datasets: [
        {
          label: "Cantidad de Aceite (L)",
          data: oilQuantities.map((oil) => oil.quantity),
          backgroundColor: [
            "#70AD47",
            "#A076C4",
            "#4DCBC4",
            "#ED7D31",
            "#8395A7",
            "#5A9BD5",
          ],
          hoverBackgroundColor: [
            "#609D37",
            "#9066B4",
            "#3DBABA",
            "#DD6D21",
            "#738597",
            "#4A8BC5",
          ],
        },
      ],
    };

    setOilData(chartData);
  }, [analyses, oils]);

  return (
    <div
      className={clsx(
        "rounded-2xl shadow-2xl p-6 mt-6 border",
        isDarkMode
          ? "bg-dark-900 border-dark-700 text-dark-50"
          : "bg-olive-50 border-olive-200 text-olive-800"
      )}
    >
      <h2 className="text-xl font-semibold">{t("home.oil_distribution")}</h2>

      <div className="mt-20 flex justify-center h-100">
        <div className="w-full max-w-sm">
          <Doughnut
            data={oilData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const oil = oils.find(
                        (oil) => oil.name === tooltipItem.label
                      );
                      const quantity = tooltipItem.raw;
                      return `${tooltipItem.label}: ${quantity.toLocaleString(
                        "es-ES",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )} L | Precio: ${oil ? oil.price : 0} €`;
                    },
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-lg font-medium">
          {t("home.total_oil")}:{" "}
          {totalOil.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          L
        </div>
      </div>
    </div>
  );
}
