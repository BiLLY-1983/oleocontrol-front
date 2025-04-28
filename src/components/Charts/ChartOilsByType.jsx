import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

/**
 * Componente que muestra un gráfico de tipo Doughnut (rosquilla) con la distribución de aceite por tipo.
 * Utiliza `react-chartjs-2` junto con `chart.js` para visualizar la proporción de litros por cada tipo de aceite.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object<string, number>} props.oilByType - Objeto con los distintos tipos de aceite como claves y su cantidad en litros como valores.
 *
 * @returns {JSX.Element} Un gráfico de rosquilla con la distribución del aceite por tipo, incluyendo el total acumulado.
 *
 * @example
 * const oilByType = {
 *   "Aceite Virgen": 1200,
 *   "Aceite Extra": 850,
 *   "Lampante": 500,
 * };
 *
 * <ChartOilsByType oilByType={oilByType} />
 */

export default function ChartOilsByType({ oilByType }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [oilData, setOilData] = useState({
    labels: [],
    datasets: [],
  });

  const [totalOil, setTotalOil] = useState(0);

  /**
   * useEffect que actualiza los datos del gráfico y calcula el total de litros
   * cada vez que cambia el objeto `oilByType`.
   */
  useEffect(() => {
    if (!oilByType || Object.keys(oilByType).length === 0) {
      return;
    }

    /**
     * Calcula el total de litros de aceite sumando todos los valores del objeto `oilByType`.
     *
     * @type {number}
     */
    const total = Object.values(oilByType).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setTotalOil(total);

    /**
     * Prepara los datos para el gráfico Doughnut con etiquetas, cantidades y colores personalizados.
     *
     * @type {import("chart.js").ChartData}
     */
    const chartData = {
      labels: Object.keys(oilByType),
      datasets: [
        {
          label: "Cantidad de Aceite (L)",
          data: Object.values(oilByType),
          backgroundColor: [
            "#70AD47",
            "#A076C4",
            "#4DCBC4",
            "#ED7D31",
            "#8395A7",
            "#5A9BD5",
            "#F1C40F",
            "#E74C3C",
            "#9B59B6",
          ],
          hoverBackgroundColor: [
            "#609D37",
            "#9066B4",
            "#3DBABA",
            "#DD6D21",
            "#738597",
            "#4A8BC5",
            "#D4B80B",
            "#C0392B",
            "#8E44AD",
          ],
        },
      ],
    };

    setOilData(chartData);
  }, [oilByType]);

  /**
   * Formatea la etiqueta del tooltip para mostrar cantidad en litros con separador de miles.
   *
   * @param {import("chart.js").TooltipItem<"doughnut">} tooltipItem - Información del punto del gráfico.
   * @returns {string} Texto con la cantidad formateada.
   */
  function formatTooltipLabel(tooltipItem) {
    const quantity = tooltipItem.raw;
    return `${tooltipItem.label}: ${quantity.toLocaleString()} L`;
  }

  return (
    <div
      className={clsx(
        "rounded-2xl p-6 mt-6 border shadow-2xl",
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
                    label: formatTooltipLabel,
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
          {t("home.total_oil")}: {totalOil.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " L"}
        </div>
      </div>
    </div>
  );
}
