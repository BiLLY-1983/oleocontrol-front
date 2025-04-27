import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@components/ui/card";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";

const OilPrices = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [oils, setOils] = useState([]);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorOils, setErrorOils] = useState(null);

  /**
   * Función para obtener los aceites desde la API.
   * Actualiza el estado de `oils` con los datos obtenidos.
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
   * Obtener los aceites cuando el componente se monte.
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
      <h1 className="text-2xl font-bold">{t("navigation.prices")}</h1>

      {/* Cards de tipos de aceite */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingOils ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : errorOils ? (
          <div className="text-red-600">{errorOils}</div>
        ) : (
          oils.map((oil) => (
            <Card
              key={oil.id}
              className={clsx(
                "p-6 rounded-lg shadow-xl transition-transform transform relative",
                isDarkMode
                  ? "bg-dark-700 text-dark-50"
                  : "bg-olive-50 text-olive-800"
              )}
            >
              <div className="flex flex-col items-center">
                {/* Cabecera con el nombre del aceite */}
                <h2 className="text-3xl font-semibold">{oil.name}</h2>

                {/* Imagen del aceite */}
                {oil.photo_url && (
                  <img
                    src={oil.photo_url}
                    alt={oil.name}
                    className="w-full max-w-xs mt-4 rounded-lg"
                  />
                )}

                {/* Precio del aceite */}
                {oil.price && (
                  <p className="text-xl mt-4 font-medium"> {t('navigation.price')}: {oil.price} €/L</p>
                )}

                {/* Descripción del aceite */}
                {oil.description && (
                  <p className="mt-4 text-sm text-center">{oil.description}</p>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OilPrices;
