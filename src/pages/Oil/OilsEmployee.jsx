import React, { useState, useEffect } from "react";
import ChartOilPricesBar from "@components/Charts/ChartOilPricesBar";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

/**
 * Página para mostrar los precios de los aceites en la sección de empleados.
 * 
 * Utiliza un gráfico de barras para visualizar los precios de los aceites disponibles.
 *
 * @component
 * @returns {JSX.Element} Página de precios de aceites para empleados.
 */
const OilsEmployee = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const [oils, setOils] = useState([]);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorOils, setErrorOils] = useState(null);

  /**
   * Función para obtener los aceites desde la API.
   * Se actualiza el estado de loadingOils y errorOils según la respuesta de la API.
   * También maneja la lógica de actualización del estado de los aceites.
   * 
   * @returns {void} No retorna ningún valor.
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
   * Efecto para cargar los aceites al montar el componente.
   * Se ejecuta una vez cuando el componente se monta.
   */
  useEffect(() => {
    fetchOils();
  }, []);

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1 className="text-2xl font-bold">{t("navigation.oils")}</h1>

      {loadingOils ? (
        <Skeleton className="h-150 w-full rounded-xl" />
      ) : errorOils ? (
        <div className="text-red-600">{errorOils}</div>
      ) : (
        oils.length > 0 && <ChartOilPricesBar oils={oils} />
      )}
    </div>
  );
};

export default OilsEmployee;
