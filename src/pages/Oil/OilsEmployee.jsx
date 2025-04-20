import React, { useState, useEffect } from "react";
import ChartOilPricesBar from "@components/Charts/ChartOilPricesBar";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

const OilsEmployee = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const [oils, setOils] = useState([]);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorOils, setErrorOils] = useState(null);

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
