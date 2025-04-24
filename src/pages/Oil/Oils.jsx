import React, { useState, useEffect } from "react";
import ChartOils from "@components/Charts/ChartsOils";
import clsx from "clsx";
import { Trash2, SquarePen } from "lucide-react";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getAnalyses } from "@services/analysisRequests";
import { getOils } from "@services/oilRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NewOilModal from "@pages/Oil/NewOilModal";
import EditOilModal from "@pages/Oil/EditOilModal";
import DeleteOilModal from "@pages/Oil/DeleteOilModal";
import { Card } from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

/**
 * 
 * Componente `Oils` para la gestión de aceites en el sistema.
 * 
 * Este componente muestra una lista de aceites con funciones de búsqueda,
 * filtrado, paginación, y gráficos para visualizar la distribución por tipo de aceite.
 * También permite crear, editar y eliminar aceites mediante modales.
 * 
 * @component
 * 
 * @returns {JSX.Element} Interfaz de usuario para la gestión de aceites.
 * @description Este componente permite a los usuarios gestionar aceites, mostrando
 * los precios y detalles de cada aceite disponible en el sistema.
 * 
 * @example
 * <Oils />
 * 
 * @features
 * - Carga asíncrona de aceites desde la API.
 * - Filtro por nombre, precio y descripción.
 * - Paginación configurable por cantidad de aceites por página.
 * - Visualización con gráficos (donut y de barras) del número de aceites por tipo.
 * - Modales para agregar, editar y eliminar aceites.
 * - Soporte para tema claro/oscuro.
 */
const Oils = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDarkMode = theme === "dark";

  const [analyses, setAnalyses] = useState([]);
  const [oils, setOils] = useState([]);
  const [oilQuantities, setOilQuantities] = useState([]);
  const [totalOil, setTotalOil] = useState(0);
  const [oilData, setOilData] = useState(null);
  const [selectedOil, setSelectedOil] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);
  const [errorAnalyses, setErrorAnalyses] = useState(null);
  const [errorOils, setErrorOils] = useState(null);
  const [modalNewOilOpen, setModalNewOilOpen] = useState(false);
  const [modalEditOilOpen, setModalEditOilOpen] = useState(false);
  const [modalDeleteOilOpen, setModalDeleteOilOpen] = useState(false);

  /**
   * Función para obtener los análisis de aceites desde la API.
   * Actualiza el estado de `analyses` con los datos obtenidos.
   * 
   * @returns {void} No retorna ningún valor.
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
   * Función para obtener los aceites desde la API.
   * Actualiza el estado de `oils` con los datos obtenidos.
   * 
   * @returns {void} No retorna ningún valor.
   */
  useEffect(() => {
    fetchOils();
    fetchAnalyses();
  }, []);

  /**
   * Función para procesar los datos de aceites y análisis.
   * Actualiza el estado de `oilQuantities` y `totalOil` con los datos procesados.
   * 
   * @returns {void} No retorna ningún valor.
   */
  useEffect(() => {
    if (!oils || !analyses || oils.length === 0 || analyses.length === 0) {
      return;
    }

    const oilTotals = oils.map((oil) => ({
      id: oil.id,
      name: oil.name,
      quantity: 0,
      price: oil.price,
      description: oil.description,
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

  /**
   * Función para actualizar los aceites después de realizar una acción
   * (crear, editar o eliminar).
   */
  const updateOils = async () => {
    fetchOils();
  };

  /**
   * Función para manejar el clic en una tarjeta de aceite.
   */
  const handleCardClick = (oil) => {
    setSelectedOil(oil);
    setIsDialogOpen(true);
  };

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("navigation.oils")}</h1>

        <Button
          className={clsx(
            "cursor-pointer text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalNewOilOpen(true)}
        >
          + {t("oils.newOil")}
        </Button>
      </div>

      <NewOilModal
        open={modalNewOilOpen}
        setOpen={setModalNewOilOpen}
        isDarkMode={isDarkMode}
        updateOils={updateOils}
      />

      <EditOilModal
        open={modalEditOilOpen}
        setOpen={setModalEditOilOpen}
        isDarkMode={isDarkMode}
        updateOils={updateOils}
        selectedOil={selectedOil}
      />

      <DeleteOilModal
        open={modalDeleteOilOpen}
        setOpen={setModalDeleteOilOpen}
        isDarkMode={isDarkMode}
        updateOils={updateOils}
        selectedOil={selectedOil}
      />

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
            {/*             <Card
              className={clsx(
                "p-6 rounded-lg shadow",
                isDarkMode ? "bg-dark-700" : "bg-olive-100"
              )}
            >
              <h2 className="text-xl font-semibold">
                {t("analysis.oilQuantity")}
              </h2>
              <p className="text-3xl font-bold">{`${(totalOil / 1000).toFixed(
                2
              )} Tn`}</p>
            </Card> */}
            {/* Cards por tipo */}
            {oilQuantities.map((oil) => (
              <Card
                key={oil.id}
                onClick={() => handleCardClick(oil)}
                className={clsx(
                  "p-4 rounded-lg shadow transition-transform transform relative cursor-pointer",
                  isDarkMode
                    ? "bg-dark-700 text-dark-50"
                    : "bg-olive-100 text-olive-800"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{oil.name}</h2>
                    <p className="text-3xl font-bold">
                      {(oil.quantity / 1000).toFixed(2)} Tn
                    </p>
                    {oil.price && (
                      <p className="text-sm mt-5">{oil.price} €/L</p>
                    )}
                  </div>

                  <div className="flex space-x-2 absolute bottom-2 right-2">
                    <SquarePen
                      size={18}
                      className="cursor-pointer text-blue-700 hover:text-blue-400 hover:scale-120 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOil(oils.find((o) => o.id === oil.id));
                        setModalEditOilOpen(true);
                      }}
                    />
                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-700 hover:text-red-400 hover:scale-120 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOil(oils.find((o) => o.id === oil.id));
                        setModalDeleteOilOpen(true);
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Gráfico */}
      {oilData && (
        <ChartOils oils={oils} analyses={analyses} chartData={oilData} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={clsx(
            "max-h-[50vh] overflow-y-auto",
            isDarkMode
              ? "bg-dark-700 text-dark-50"
              : "bg-olive-50 text-olive-800"
          )}
        >
          <DialogHeader>
            <DialogTitle>{selectedOil?.name}</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm">{selectedOil?.description}</p>
          {selectedOil?.price && (
            <p className="mt-4 text-sm">
              <strong>Precio:</strong> {selectedOil.price} €/L
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Oils;
