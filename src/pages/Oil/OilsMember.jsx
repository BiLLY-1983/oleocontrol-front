import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@context/UserContext";
import StatCard from "@components/StatCard";
import ChartOilInventory from "@components/Charts/ChartOilInventory";
import { getOilInventoriesForMember } from "@services/oilInventoryRequests";
import { getOilSettlementsForMember } from "@services/oilSettlementRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

/**
 * Página del Dashboard de aceites para socios.
 * 
 * Muestra estadísticas y gráficas relevantes para los socios, como inventarios de aceite,
 * liquidaciones y la cantidad de aceite almacenado.
 *
 * @component
 * @returns {JSX.Element} Página de aceites para socios.
 */
const OilMember = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation();
  const { userData } = useContext(UserContext);

  const memberId = userData?.user?.member?.id;

  const [oilsInventories, setOilsInventories] = useState([]);
  const [oilSettlements, setOilSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  const oilTypesOrder = [
    "Aceite de Oliva Virgen Extra",
    "Aceite de Oliva Virgen",
    "Aceite de Oliva Lampante",
  ];

  /**
   * useEffect que se ejecuta al montarse el componente o cuando cambia el `memberId`.
   * Realiza las solicitudes para obtener los datos de los inventarios de aceite y liquidaciones.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [oilsInventoriesRes, oilSettlementsRes] = await Promise.all([
          getOilInventoriesForMember(memberId),
          getOilSettlementsForMember(memberId),
        ]);
        setOilsInventories(oilsInventoriesRes.data || []);
        setOilSettlements(oilSettlementsRes.data || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchData();
  }, [memberId]);

  // Agrupar los datos por tipo de aceite
  const oilInventoryByType = oilsInventories.reduce((acc, oilInventory) => {
    const { oil_name, total_quantity } = oilInventory;
    acc[oil_name] = (acc[oil_name] || 0) + total_quantity;
    return acc;
  }, {});

  const oilSettlementByType = oilSettlements.reduce((acc, oilSettlement) => {
    const { oil_name, total_amount } = oilSettlement;
    acc[oil_name] = (acc[oil_name] || 0) + total_amount;
    return acc;
  }, {});

  // Calcular el aceite disponible (inventario - liquidación)
  const calculateAvailableOil = (oilName) => {
    const inventory = oilInventoryByType[oilName] || 0;
    const settlement = oilSettlementByType[oilName] || 0;
    return inventory - settlement;
  };

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1 className="text-2xl font-bold">{t("navigation.oils")}</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-a gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <>
          {/* DISPONIBILIDAD */}
          <div className={clsx(
            "card p-4 shadow-2xl rounded-lg",
            isDarkMode ? "text-dark-200 bg-dark-900" : "text-olive-600 bg-olive-100"
          )} >
            <h2 className="text-xl font-semibold mb-4">
              {t("home.available_oil")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {oilTypesOrder.map((oilKey) => {
                const availableOil = calculateAvailableOil(oilKey);
                return (
                  <StatCard
                    key={`available-${oilKey}`}
                    title={t(`oilTypes.${oilKey}`)}
                    subtext={t("home.available_oil")}
                    value={t("home.liters", {
                      value: availableOil.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                    })}
                  />
                );
              })}
            </div>
          </div>

          {/* PRODUCCIÓN */}
          <div className="card p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {t("home.oil_production")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {oilTypesOrder.map((oilKey) => (
                <StatCard
                  key={`inventory-${oilKey}`}
                  title={t(`oilTypes.${oilKey}`)}
                  subtext={t("home.oil_production")}
                  value={t("home.liters", {
                    value:
                      oilInventoryByType[oilKey]?.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "0,00",
                  })}
                />
              ))}
            </div>
          </div>

          {/* LIQUIDACIONES */}
          <div className="card p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {t("home.oilSettlements")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {oilTypesOrder.map((oilKey) => (
                <StatCard
                  key={`settlement-${oilKey}`}
                  title={t(`oilTypes.${oilKey}`)}
                  subtext={t("home.oilSettlements")}
                  value={t("home.liters", {
                    value:
                      oilSettlementByType[oilKey]?.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "0,00",
                  })}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Gráfico de Inventario de Aceites */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-olive-800 dark:text-white mb-4">
            {t("home.oilInventory")}
          </h2>
          <ChartOilInventory
            oils={Object.entries(oilInventoryByType).map(
              ([name, quantity]) => ({
                oil_name: name,
                total_quantity: quantity,
              })
            )}
          />
        </div>

        {/* Gráfico de Liquidaciones de Aceites */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-olive-800 dark:text-white mb-4">
            {t("home.oilSettlements")}
          </h2>
          <ChartOilInventory
            oils={Object.entries(oilSettlementByType).map(([name, amount]) => ({
              oil_name: name,
              total_amount: amount,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default OilMember;
