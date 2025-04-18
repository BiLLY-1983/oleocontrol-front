import React, { useState, useEffect } from "react";
import ChartOils from "@components/ChartsOils";
import StatCard from "@components/StatCard";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getAnalyses } from "@services/analysisRequests";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";

const Oils = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const [analyses, setAnalyses] = useState([]);
  const [oils, setOils] = useState([]);
  const [oilQuantities, setOilQuantities] = useState([]);
  const [totalOil, setTotalOil] = useState(0);
  const [oilData, setOilData] = useState(null);

  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorAnalyses, setErrorAnalyses] = useState(null);
  const [errorOils, setErrorOils] = useState(null);

  const fetchAnalyses = async () => {
    setLoadingAnalyses(true);
    setErrorAnalyses(null);
    try {
      const response = await getAnalyses();
      if (response.status === "success") {
        setAnalyses(response.data);
      } else {
        setErrorAnalyses("No se pudieron obtener los análisis.");
      }
    } catch (error) {
      setErrorAnalyses("Hubo un error al cargar los análisis.");
    } finally {
      setLoadingAnalyses(false);
    }
  };

  const fetchOils = async () => {
    setLoadingOils(true);
    setErrorOils(null);
    try {
      const response = await getOils();
      if (response.status === "success") {
        setOils(response.data);
      } else {
        setErrorOils("Hubo un error al cargar los aceites.");
      }
    } catch (error) {
      setErrorOils("Hubo un error al cargar los aceites.");
    } finally {
      setLoadingOils(false);
    }
  };

  useEffect(() => {
    fetchOils();
    fetchAnalyses();
  }, []);

  useEffect(() => {
    if (!oils || !analyses || oils.length === 0 || analyses.length === 0) {
      return;
    }

    const oilTotals = oils.map((oil) => ({
      name: oil.name,
      quantity: 0,
      price: oil.price,
    }));

    analyses.forEach((analysis) => {
      if (analysis.oil && analysis.oil.name && analysis.yield) {
        const oliveQuantity = analysis.entry?.olive_quantity ?? 0;
        const yieldRate = analysis.yield / 100;
        const oilQuantity = oliveQuantity * yieldRate;

        const oil = oilTotals.find((o) => o.name === analysis.oil.name);
        if (oil) {
          oil.quantity += oilQuantity;
        }
      }
    });

    setOilQuantities(oilTotals);

    const total = oilTotals.reduce((sum, oil) => sum + oil.quantity, 0);
    setTotalOil(total);

    const chartData = {
      labels: oilTotals.map((oil) => oil.name),
      datasets: [
        {
          label: t("analysis.oilQuantity"),
          data: oilTotals.map((oil) => oil.quantity),
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
  }, [analyses, oils, t]);

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1 className="text-2xl font-bold">{t("navigation.oils")}</h1>

      {/* Cards de resumen por tipo de aceite */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loadingAnalyses || loadingOils ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : errorAnalyses || errorOils ? (
          <div className="text-red-600">{errorAnalyses || errorOils}</div>
        ) : (
          <>
            {/* Card de total general */}
            <StatCard
              title={t("analysis.oilQuantity")}
              value={`${(totalOil / 1000).toFixed(2)} Tn`}
            />

            {/* Cards por tipo */}
            {oilQuantities.map((oil) => (
              <StatCard
                key={oil.name}
                title={oil.name}
                value={`${(oil.quantity / 1000).toFixed(2)} Tn`}
                subtext={oil.price ? `${oil.price} €/L` : ""}
              />
            ))}
          </>
        )}
      </div>

      {/* Gráfico */}
      {oilData && (
        <ChartOils oils={oils} analyses={analyses} chartData={oilData} />
      )}
    </div>
  );
};

export default Oils;
