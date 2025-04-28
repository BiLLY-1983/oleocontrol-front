import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@context/UserContext";
import ChartEntries from "@components/Charts/ChartEntries";
import ChartOilPricesBar from "@components/Charts/ChartOilPricesBar";
import StatCard from "@components/StatCard";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getMembers } from "@services/memberRequests";
import { getEntries } from "@services/entryRequests";
import { getAnalyses } from "@services/analysisRequests";
import { getSettlements } from "@services/settlementRequests";
import { formatEuro } from "@/utils/formatEuro";

import { getEmployees } from "@services/employeeRequests";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import NewEntryModal from "@pages/Entry/NewEntryModal";
import NewMemberModal from "@pages/Member/NewMemberModal";

import MembersDoughnutChart from "@components/Charts/HomeEmployee/MembersDoughnutChart";
import EmployeesDoughnutChart from "@components/Charts/HomeEmployee/EmployeesDoughnutChart";
import AnalysisDoughnutChart from "@components/Charts/HomeEmployee/AnalysisDoughnutChart";
import SettlementDoughnutChart from "@components/Charts/HomeEmployee/SettlementDoughnutChart";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente HomeEmployee
 * 
 * Página de inicio del Dashboard.
 * 
 * Muestra estadísticas y gráficas relevantes para los empleados del sistema: 
 * socios activos, entradas de aceituna, producción de aceite, rendimiento medio y liquidaciones pendientes.
 * 
 * @component
 * @returns {JSX.Element} El componente HomeAdmin renderizado.
 */
const HomeEmployee = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const { userData } = useContext(UserContext);
  const departmentName = userData.user.employee?.department?.name;

  const [members, setMembers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [oils, setOils] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [loadingSettlements, setLoadingSettlements] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorMembers, setErrorMembers] = useState(null);
  const [errorEntries, setErrorEntries] = useState(null);
  const [errorAnalyses, setErrorAnalyses] = useState(null);
  const [errorSettlements, setErrorSettlements] = useState(null);
  const [errorOils, setErrorOils] = useState(null);
  const [errorEmployees, setErrorEmployees] = useState(null);
  const [newEntryModalOpen, setNewEntryModalOpen] = useState(false);
  const [newMemberModalOpen, setNewMemberModalOpen] = useState(false);

  /**
   * useEffect que obtiene la lista de aceites.
   */
  const fetchOils = async () => {
    setLoadingOils(true);
    setErrorOils(null);
    try {
      const response = await getOils();
      if (response.status === "success") {
        setOils(response.data);
      } else {
        setErrorOils("No se pudieron obtener los aceites.");
      }
    } catch (err) {
      setErrorOils("Hubo un error al cargar los aceites.");
    } finally {
      setLoadingOils(false);
    }
  };

  /**
   * useEffect que obtiene la lista de socios.
   */
  const fetchMembers = async () => {
    setLoadingMembers(true);
    setErrorMembers(null);
    try {
      const response = await getMembers();
      if (response.status === "success") {
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
   * useEffect que obtiene la lista de liquidaciones.
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
      setErrorSettlements("Hubo un error al cargar las liquidaciones.");
    } finally {
      setLoadingSettlements(false);
    }
  };

  /**
   * useEffect que obtiene la lista de empleados.
   */
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setErrorEmployees(null);
    try {
      const response = await getEmployees();
      if (response.status === "success") {
        setEmployees(response.data);
      } else {
        setErrorEmployees("No se pudieron obtener los empleados.");
      }
    } catch (error) {
      setErrorEmployees("Hubo un error al cargar los empleados.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  /**
   * useEffect que se ejecuta cuando el nombre del departamento cambia.
   * Llama a la función correspondiente para obtener los datos según el departamento del usuario.
   */
  useEffect(() => {
    if (!departmentName) return;

    fetchOils();

    switch (departmentName) {
      case "Administración":
        fetchMembers();
        break;
      case "Control de entradas":
        fetchEntries();
        break;
      case "Laboratorio":
        fetchAnalyses();
        break;
      case "RRHH":
        fetchEmployees();
        break;
      case "Contabilidad":
        fetchSettlements();
        break;
      default:
        break;
    }
  }, [departmentName]);

  const renderDepartmentContent = () => {
    switch (departmentName) {
      case "Control de entradas":
        const totalKilos = entries.reduce(
          (sum, e) => sum + Number(e.olive_quantity ?? 0),
          0
        );

        const kgTn = totalKilos / 1000;

        const totalLitros = entries.reduce(
          (sum, e) => sum + Number(e.oil_quantity ?? 0),
          0
        );

        const litrosTn = totalLitros / 1000;

        if (loadingEntries) {
          return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
              <Skeleton className="h-150 w-full col-span-full rounded-xl" />
            </div>
          );
        }

        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <StatCard title="Total Entradas" value={entries.length} />
              <StatCard
                title={t("entries.totalTn")}
                value={`${kgTn.toFixed(2)} Tn`}
              />
              <StatCard
                title={t("entries.totalLt")}
                value={`${litrosTn.toFixed(2)} Tn`}
              />
              <StatCard
                title="Promedio por entrada"
                value={`${(kgTn / entries.length || 0).toFixed(2)} Tn`}
              />
            </div>
            <ChartEntries entries={entries} />
          </>
        );

      case "Administración":
        const activeMembers = members.filter(
          (member) => member.user.status === 1
        );
        const inactiveMembers = members.filter(
          (member) => member.user.status !== 1
        );

        const doughnutDataMembers = {
          labels: ["Activos", "Inactivos"],
          datasets: [
            {
              data: [activeMembers.length, inactiveMembers.length],
              backgroundColor: ["#4CAF50", "#F44336"],
              hoverBackgroundColor: ["#45A049", "#E53935"],
            },
          ],
        };

        if (loadingMembers) {
          return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}

              <div className="flex justify-center col-span-full">
                <Skeleton className="h-150 w-full md:w-1/3 rounded-2xl" />
              </div>
            </div>
          );
        }

        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
              <StatCard title="Socios Activos" value={activeMembers.length} />
              <StatCard
                title="Socios Inactivos"
                value={inactiveMembers.length}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              {/* Gráfico de la relación de socios */}
              <MembersDoughnutChart
                doughnutData={doughnutDataMembers}
                title="Relación de Socios"
                isDarkMode={isDarkMode}
              />
            </div>
          </>
        );

      case "RRHH":
        const activeEmployees = employees.filter(
          (employee) => employee.user.status === 1
        );
        const inactiveEmployees = employees.filter(
          (employee) => employee.user.status !== 1
        );
        const departmentCounts = employees.reduce((acc, employee) => {
          const dept = employee.department.name || "Sin departamento";
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        const doughnutDataDepartments = {
          labels: Object.keys(departmentCounts),
          datasets: [
            {
              data: Object.values(departmentCounts),
              backgroundColor: [
                "#5A9BD5", // Azul Desaturado
                "#70AD47", // Verde Desaturado
                "#A076C4", // Púrpura Desaturado
                "#4DCBC4", // Teal Desaturado
                "#ED7D31", // Naranja Desaturado (como contraste)
                "#8395A7", // Gris Azulado
              ],
              hoverBackgroundColor: [
                "#4A8BC5", // Azul un poco más intenso
                "#609D37", // Verde un poco más intenso
                "#9066B4", // Púrpura un poco más intenso
                "#3DBABA", // Teal un poco más intenso
                "#DD6D21", // Naranja un poco más intenso
                "#738597", // Gris Azulado un poco más intenso
              ],
            },
          ],
        };

        const doughnutDataEmployees = {
          labels: ["Activos", "Inactivos"],
          datasets: [
            {
              data: [activeEmployees.length, inactiveEmployees.length],
              backgroundColor: ["#4CAF50", "#F44336"],
              hoverBackgroundColor: ["#45A049", "#E53935"],
            },
          ],
        };

        if (loadingEmployees) {
          return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}

              <div className="flex justify-center col-span-full">
                <Skeleton className="h-150 w-full md:w-1/3 rounded-2xl" />
              </div>
            </div>
          );
        }

        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
              <StatCard
                title="Empleados Activos"
                value={activeEmployees.length}
              />
              <StatCard
                title="Empleados Inactivos"
                value={inactiveEmployees.length}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              {/* Gráfico 1: Activos/Inactivos */}
              <div className="w-full md:w-1/3">
                <EmployeesDoughnutChart
                  data={doughnutDataEmployees}
                  title="Relación de Empleados"
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Gráfico 2: Por departamento */}
              <div className="w-full md:w-1/3">
                <EmployeesDoughnutChart
                  data={doughnutDataDepartments}
                  title="Empleados por Departamento"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </>
        );

      case "Laboratorio":
        const pendingAnalyses = analyses.filter((a) => !a.analysis_date);
        const completedAnalyses = analyses.filter((a) => !!a.analysis_date);

        const validYields = completedAnalyses
          .map((a) => parseFloat(a.yield))
          .filter((y) => Number.isFinite(y));
        const averageYield =
          validYields.reduce((acc, y) => acc + y, 0) /
          (validYields.length || 1);

        const oilCounts = completedAnalyses.reduce((acc, a) => {
          const name = a.oil?.name || "Sin clasificar";
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});

        const doughnutOilData = {
          labels: Object.keys(oilCounts),
          datasets: [
            {
              data: Object.values(oilCounts),
              backgroundColor: [
                "#5A9BD5", // Azul Desaturado
                "#70AD47", // Verde Desaturado
                "#A076C4", // Púrpura Desaturado
                "#4DCBC4", // Teal Desaturado
                "#ED7D31", // Naranja Desaturado (como contraste)
                "#8395A7", // Gris Azulado
              ],
              hoverBackgroundColor: [
                "#4A8BC5", // Azul un poco más intenso
                "#609D37", // Verde un poco más intenso
                "#9066B4", // Púrpura un poco más intenso
                "#3DBABA", // Teal un poco más intenso
                "#DD6D21", // Naranja un poco más intenso
                "#738597", // Gris Azulado un poco más intenso
              ],
            },
          ],
        };

        if (loadingAnalyses) {
          return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}

              <div className="flex justify-center col-span-full">
                <Skeleton className="h-150 w-full md:w-1/3 rounded-2xl" />
              </div>
            </div>
          );
        }

        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <StatCard title="Análisis totales" value={analyses.length} />
              <StatCard
                title="Análisis pendientes"
                value={pendingAnalyses.length}
              />
              <StatCard
                title="Rendimiento medio"
                value={averageYield.toFixed(2) + " %"}
              />
            </div>

            <div className="w-full md:w-1/3 mx-auto">
              <div
                className={clsx(
                  "rounded-2xl shadow-2xl p-6 mt-6 border",
                  isDarkMode
                    ? "bg-dark-900 border-dark-700 text-dark-50"
                    : "bg-olive-50 border-olive-200 text-olive-800"
                )}
              >
                <h2 className="text-lg font-semibold text-center mb-4">
                  Tipos de aceite resultantes
                </h2>
                <AnalysisDoughnutChart oilCounts={oilCounts} />{" "}
                {/* Aquí pasamos los datos al gráfico */}
              </div>
            </div>
          </>
        );

      case "Contabilidad":
        const pendingSettlements = settlements.filter(
          (s) => s.settlement_status === "Pendiente"
        );

        const aceptSettlements = settlements.filter(
          (s) => s.settlement_status === "Aceptada"
        );

        const cancelSettlements = settlements.filter(
          (s) => s.settlement_status === "Cancelada"
        );

        const settlementStatusCounts = {
          Aceptada: aceptSettlements.length,
          Cancelada: cancelSettlements.length,
          Pendiente: pendingSettlements.length,
        };

        const settlementTotals = {
          Aceptada: aceptSettlements.reduce(
            (acc, s) => acc + s.amount * s.price,
            0
          ),
          Cancelada: cancelSettlements.reduce(
            (acc, s) => acc + s.amount * s.price,
            0
          ),
          Pendiente: pendingSettlements.reduce(
            (acc, s) => acc + s.amount * s.price,
            0
          ),
        };

        const doughnutDataSettlements = {
          labels: ["Aceptadas", "Canceladas", "Pendientes"],
          datasets: [
            {
              data: [
                settlementStatusCounts.Aceptada,
                settlementStatusCounts.Cancelada,
                settlementStatusCounts.Pendiente,
              ],
              backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
              hoverBackgroundColor: ["#45A049", "#E53935", "#FB8C00"],
            },
          ],
        };

        if (loadingSettlements) {
          return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}

              <div className="flex justify-center col-span-full">
                <Skeleton className="h-150 w-full md:w-1/3 rounded-2xl" />
              </div>
            </div>
          );
        }

        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <StatCard
                title="Total de liquidaciones"
                value={settlements.length}
              />
              <StatCard
                title="Liquidaciones Aceptadas"
                value={aceptSettlements.length}
                subtext={formatEuro(settlementTotals.Aceptada)}
              />
              <StatCard
                title="Liquidaciones Pendientes"
                value={pendingSettlements.length}
                subtext={formatEuro(settlementTotals.Pendiente)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <div className="w-full md:w-1/3">
                <div
                  className={clsx(
                    "rounded-2xl shadow-2xl p-6 mt-6 border",
                    isDarkMode
                      ? "bg-dark-900 border-dark-700 text-dark-50"
                      : "bg-olive-50 border-olive-200 text-olive-800"
                  )}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-center">
                      Estado de Liquidaciones
                    </h2>
                  </div>

                  {/* Aquí pasamos los datos al componente del gráfico */}
                  <SettlementDoughnutChart
                    doughnutDataSettlements={doughnutDataSettlements}
                    settlementStatusCounts={settlementStatusCounts}
                    settlementTotals={settlementTotals}
                  />
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <p className="text-center text-gray-500">
            No hay contenido disponible para el departamento{" "}
            <strong>{departmentName}</strong>.
          </p>
        );
    }
  };

  return (
    <div className={clsx("p-4", isDarkMode && "bg-gray-900 text-white")}>
      <h1 className="text-2xl font-semibold mb-4">{t("navigation.home")}</h1>
      {renderDepartmentContent()}

      {loadingOils ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <div className="flex justify-center col-span-full">
            <Skeleton className="h-150 w-full md:w-1/3 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <div className="w-full md:w-1/3">
            <ChartOilPricesBar oils={oils} />
          </div>
        </div>
      )}

      {/* Modales */}
      <NewEntryModal
        isOpen={newEntryModalOpen}
        onClose={() => setNewEntryModalOpen(false)}
        onEntryAdded={fetchEntries}
      />
      <NewMemberModal
        isOpen={newMemberModalOpen}
        onClose={() => setNewMemberModalOpen(false)}
        onMemberAdded={fetchMembers}
      />
    </div>
  );
};

export default HomeEmployee;
