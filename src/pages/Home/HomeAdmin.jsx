import React, { useState, useEffect } from "react";
import ChartEntries from "@components/Charts/ChartEntries";
import ChartOils from "@components/Charts/ChartsOils";
import ChartSettlementsHome from "@components/Charts/ChartSettlementsHome";
import StatCard from "@components/StatCard";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getMembers } from "@services/memberRequests";
import { getEntries } from "@services/entryRequests";
import { getAnalyses } from "@services/analysisRequests";
import { getOils } from "@services/oilRequests";
import { getSettlements } from "@services/settlementRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEuro } from "@/utils/formatEuro";

/**
 * Componente HomeAdmin
 * 
 * Página de inicio del Dashboard.
 * 
 * Muestra estadísticas y gráficas relevantes para el administrador del sistema: 
 * socios activos, entradas de aceituna, producción de aceite, rendimiento medio y liquidaciones pendientes.
 * 
 * @component
 * @returns {JSX.Element} El componente HomeAdmin renderizado.
 */
const HomeAdmin = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const [members, setMembers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [oils, setOils] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [loadingSettlements, setLoadingSettlements] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorMembers, setErrorMembers] = useState(null);
  const [errorEntries, setErrorEntries] = useState(null);
  const [errorAnalyses, setErrorAnalyses] = useState(null);
  const [errorSettlements, setErrorSettlements] = useState(null);
  const [errorOils, setErrorOils] = useState(null);

  /**
   * useEffect que obtiene la lista de socios.
   * 
   * @async
   * @function fetchMembers
   */
  const fetchMembers = async () => {
    setLoadingMembers(true);
    setErrorMembers(null);
    try {
      const response = await getMembers();
      if (response.status === "success" && Array.isArray(response.data)) {
        setMembers(response.data);
      } else {
        setErrorMembers("No se pudieron obtener los socios.");
      }
    } catch (err) {
      setErrorMembers("Hubo un error al cargar los socios.");
    } finally {
      setLoadingMembers(false);
    }
  };

  /**
   * useEffect que obtiene la lista de entradas.
   * 
   * @async
   * @function fetchEntries
   */
  const fetchEntries = async () => {
    setLoadingEntries(true);
    setErrorEntries(null);
    try {
      const response = await getEntries();
      if (response.status === "success") {
        setEntries(response.data);
      } else {
        setErrorEntries("No se pudieron obtener las entradas.");
      }
    } catch (error) {
      setErrorEntries("Hubo un error al cargar las entradas.");
    } finally {
      setLoadingEntries(false);
    }
  };

  /**
   * useEffect que obtiene la lista de análisis.
   * 
   * @async
   * @function fetchAnalyses
   */
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

  /**
   * useEffect que obtiene la lista de aceites.
   * 
   * @async
   * @function fetchOils
   */
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

  /**
   * useEffect que obtiene la lista de liquidaciones.
   * 
   * @async
   * @function fetchSettlements
   */
  const fetchSettlements = async () => {
    setLoadingSettlements(true);
    setErrorSettlements(null);
    try {
      const response = await getSettlements();
      if (response.status === "success") {
        setSettlements(response.data);
      } else {
        setErrorSettlements("Hubo un error al cargar las liquidaciones.");
      }
    } catch (error) {
      setErrorSettlements("Hubo un error al cargar las liquidacioness.");
    } finally {
      setLoadingSettlements(false);
    }
  };

  /**
   * Hook quue carga todas los dstos necesarios (socios, entradas, análisis, liquidaciones y aceites) al cargar el componente.
   */
  useEffect(() => {
    fetchMembers();
    fetchEntries();
    fetchOils();
    fetchAnalyses();
    fetchSettlements();
  }, []);

  const activeCount = members.filter(
    (member) => member.user.status === 1
  ).length;

  // Total de kilos
  const totalKilos = entries.reduce(
    (sum, e) => sum + Number(e.olive_quantity ?? 0),
    0
  );
  const kgTn = totalKilos / 1000;

  // Total de litros
  const totalLitros = entries.reduce(
    (sum, e) => sum + Number(e.oil_quantity ?? 0),
    0
  );

  const analysesWithYield = analyses.filter(
    (a) => a.yield !== null && a.yield !== undefined
  );

  const averageYield =
    analysesWithYield.length > 0
      ? analysesWithYield.reduce((sum, a) => sum + Number(a.yield), 0) /
      analysesWithYield.length
      : 0;

  const pendingSettlements = settlements.filter(
    (settlement) => settlement.settlement_status === "Pendiente"
  );

  const totalPendingSettlements = pendingSettlements.length;

  const totalPendingAmount = pendingSettlements.reduce(
    (sum, settlement) => sum + Number(settlement.amount * settlement.price || 0),
    0
  );

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1 className="text-2xl font-bold">{t("navigation.home")}</h1>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loadingMembers ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-1*4" />
            <Skeleton className="h-11 w-1*4" />
          </div>
        ) : errorMembers ? (
          <div className="text-red-600">{errorMembers}</div>
        ) : (
          <StatCard
            title="home.active_members"
            value={activeCount}
            subtext="notifications.statusActive"
          />
        )}

        {loadingEntries ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-1*4" />
            <Skeleton className="h-11 w-1*4" />
          </div>
        ) : errorEntries ? (
          <div className="text-red-600">{errorEntries}</div>
        ) : (
          <>
            <StatCard
              title="navigation.olive_entries"
              value={kgTn.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Tn"}

            />
            <StatCard
              title="home.oil_production"
              value={totalLitros.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " L"}
              subtext={
                t("home.oil_yield") + ": " + averageYield.toFixed(2) + " %"
              }
            />
          </>
        )}

        {loadingSettlements ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-1*4" />
            <Skeleton className="h-11 w-1*4" />
          </div>
        ) : errorSettlements ? (
          <div className="text-red-600">{errorSettlements}</div>
        ) : (
          <StatCard
            title="home.pending_settlements"
            value={totalPendingSettlements}
            subtext={formatEuro(totalPendingAmount)}
          />
        )}
      </div>
      {loadingEntries ? (
        <div className="space-y-4">
          <Skeleton className="h-25 w-1*4" />
          <Skeleton className="h-10 w-1*4" />
          <Skeleton className="h-25 w-1*4" />
          <Skeleton className="h-25 w-1*4" />
          <Skeleton className="h-25 w-1*4" />
          <Skeleton className="h-25 w-1*4" />
        </div>
      ) : errorEntries ? (
        <div className="text-red-600">{errorEntries}</div>
      ) : (
        <>
          <ChartEntries entries={entries} />

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <ChartOils oils={oils} analyses={analyses} />
            </div>
            <div className="w-full md:w-1/2">
              <ChartSettlementsHome settlements={settlements} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeAdmin;
