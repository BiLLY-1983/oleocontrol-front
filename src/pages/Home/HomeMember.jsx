import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@context/UserContext";
import ChartEntries from "@components/Charts/ChartEntries";
import ChartOilsByType from "@components/Charts/ChartOilsByType";
import ChartSettlementsHome from "@components/Charts/ChartSettlementsHome";
import ChartOilPricesBar from "@components/Charts/ChartOilPricesBar";
import StatCard from "@components/StatCard";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getEntriesForMember } from "@services/entryRequests";
import { getAnalysesForMember } from "@services/analysisRequests";
import { getSettlementsByMember } from "@services/settlementRequests";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

/**
 * Componente HomeMember
 * 
 * Página de inicio del Dashboard.
 * 
 * Muestra estadísticas y gráficas relevantes para el socios del sistema: 
 * entradas de aceituna, producción de aceite, rendimiento medio y liquidaciones pendientes.
 * 
 * @component
 * @returns {JSX.Element} El componente HomeAdmin renderizado.
 */
const HomeMember = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation();
  const { userData } = useContext(UserContext);

  const memberId = userData?.user?.member?.id;

  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [oils, setOils] = useState([]);

  const [loading, setLoading] = useState(true);

  
  /**
   * useEffect que se ejecuta al montarse el componente o cuando cambia el `memberId`.
   * Realiza las solicitudes para obtener los datos de las entradas, análisis, liquidaciones y aceites.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [entriesRes, analysesRes, settlementsRes, oilsRes] =
          await Promise.all([
            getEntriesForMember(memberId),
            getAnalysesForMember(memberId),
            getSettlementsByMember(memberId),
            getOils(),
          ]);
        setEntries(entriesRes.data || []);
        setAnalyses(analysesRes.data || []);
        setSettlements(settlementsRes.data || []);
        setOils(oilsRes.data || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchData();
  }, [memberId]);

  const totalKilos = entries.reduce(
    (sum, e) => sum + Number(e.olive_quantity || 0),
    0
  );

  const totalLitros = entries.reduce(
    (sum, e) => sum + Number(e.oil_quantity ?? 0),
    0
  );

  const now = new Date();
  const last12Months = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      label: date.toLocaleString("es-ES", { month: "short" }),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      total: 0,
    };
  });

  entries.forEach((entry) => {
    const entryDate = new Date(entry.entry_date);
    const entryMonth = entryDate.getMonth() + 1;
    const entryYear = entryDate.getFullYear();

    const monthData = last12Months.find(
      (m) => m.year === entryYear && m.month === entryMonth
    );
    if (monthData) {
      monthData.total += Number(entry.olive_quantity || 0);
    }
  });

  const oilByType = analyses.reduce((acc, analysis) => {
    const oilName = analysis.oil?.name || "Otros";
    const entryId = analysis.entry?.entry_id;

    const matchingEntry = entries.find((entry) => entry.id === entryId);
    const oilQuantity = matchingEntry
      ? Number(matchingEntry.oil_quantity || 0)
      : 0;

    acc[oilName] = (acc[oilName] || 0) + oilQuantity;
    return acc;
  }, {});

  const pendingSettlements = settlements.filter(
    (s) => s.settlement_status === "Pendiente"
  );
  const totalPending = pendingSettlements.length;
  const totalPendingAmount = pendingSettlements.reduce(
    (sum, s) => sum + (s.amount * s.price || 0),
    0
  );

  const barData = {
    labels: oils.map((o) => o.name),
    datasets: [
      {
        label: "Precio por litro (€)",
        data: oils.map((o) => o.price),
        backgroundColor: "#10b981",
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-olive-800 dark:text-white">
        {t("navigation.home")}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title={t("home.entries")}
              value={t("home.tons", {
                value: (totalKilos / 1000).toFixed(2),
              })}
            />
            <StatCard
              title={t("home.oilProduced")}
              value={t("home.liters", {
                value: totalLitros.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
              })}
              subtext={t("home.byType")}
            />
            <StatCard
              title={t("home.pendingSettlements")}
              value={totalPending}
              subtext={t("home.euros", {
                value: totalPendingAmount.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
              })}
            />
          </div>

          <ChartEntries entries={entries} />

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/3">
              <ChartOilsByType oils={oils} oilByType={oilByType} />
            </div>
            <div className="w-full md:w-1/3">
              <ChartSettlementsHome settlements={settlements} />
            </div>
            <div className="w-full md:w-1/3">
              <ChartOilPricesBar oils={oils} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeMember;
