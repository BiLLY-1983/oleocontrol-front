import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAnalyses } from "@services/analysisRequests";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AnalysisPDF } from "@components/pdf/AnalysisPDF";
import { BiSolidFilePdf } from "react-icons/bi";
import EditAnalysisModal from "@pages/Analysis/EditAnalysisModal";

/**
 * Componente que gestiona el listado y visualización de análisis de aceituna.
 * Permite realizar filtrados, paginación, y la descarga de informes en PDF.
 *
 * @component
 * @example
 * return (
 *   <Analyses />
 * )
 */
const Analyses = () => {
  /**
   * Hook para obtener el tema actual (oscuro o claro).
   * @type {Object}
   * @property {string} theme - El tema actual, puede ser "dark" o "light".
   */
  const { theme } = useTheme();
  
  /**
   * Determina si el modo oscuro está activado.
   * @type {boolean}
   */
  const isDarkMode = theme === "dark";

  /**
   * Hook para gestionar la traducción de textos.
   * @type {Object}
   * @property {function} t - Función de traducción.
   */
  const { t } = useTranslation();

  /**
   * Estado que almacena los análisis obtenidos.
   * @type {Array}
   */
  const [analyses, setAnalyses] = useState([]);

  /**
   * Estado que almacena el análisis seleccionado.
   * @type {Object|null}
   */
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  /**
   * Estado para controlar si los análisis están siendo cargados.
   * @type {boolean}
   */
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  /**
   * Estado para gestionar la página actual en la paginación.
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Estado para gestionar la cantidad de análisis por página en la paginación.
   * @type {number}
   */
  const [analysesPerPage, setAnalysesPerPage] = useState(10);

  /**
   * Estado para gestionar posibles errores al obtener los análisis.
   * @type {string|null}
   */
  const [errorAnalyses, setErrorAnalyses] = useState(null);

  /**
   * Estado para almacenar el texto de filtro de los análisis.
   * @type {string}
   */
  const [filtro, setFiltro] = useState("");

  /**
   * Estado para controlar la visibilidad del modal de edición de análisis.
   * @type {boolean}
   */
  const [modalEditAnalysisOpen, setModalEditAnalysisOpen] = useState(false);

  /**
   * Función que obtiene los análisis de la API.
   * @async
   * @returns {Promise<void>}
   */
  const fetchAnalyses = async () => {
    setLoadingAnalyses(true);
    try {
      const response = await getAnalyses();
      if (response.status === "success") {
        setAnalyses(response.data);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
      setErrorAnalyses("Error al cargar los análisis.");
    } finally {
      setLoadingAnalyses(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  /**
   * Función para actualizar los análisis después de una modificación.
   * @async
   */
  const updateAnalyses = async () => {
    await fetchAnalyses();
  };

  /**
   * Función que filtra los análisis según el texto de filtro.
   * @returns {Array} - Los análisis filtrados.
   */
  const analysesFiltered = analyses.filter(
    (analysis) =>
      analysis.member?.name.toLowerCase().includes(filtro.toLowerCase()) ||
      analysis.oil?.name.toLowerCase().includes(filtro.toLowerCase())
  );

  /**
   * Función que calcula los números de página visibles en la paginación.
   * @returns {Array} - Los números de página visibles.
   */
  const getVisiblePageNumbers = () => {
    const totalPages = pageNumbers.length;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return pageNumbers;
    }

    if (currentPage <= 3) {
      return [...pageNumbers.slice(0, 3), "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", ...pageNumbers.slice(totalPages - 3)];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  /**
   * Calcula los índices de los análisis visibles en la página actual.
   * @type {number}
   */
  const indexOfLastAnalysis = currentPage * analysesPerPage;
  const indexOfFirstAnalysis = indexOfLastAnalysis - analysesPerPage;

  /**
   * Obtiene los análisis que se deben mostrar en la página actual.
   * @type {Array}
   */
  const currentAnalyses = analysesFiltered.slice(
    indexOfFirstAnalysis,
    indexOfLastAnalysis
  );

  /**
   * Función para cambiar la página actual en la paginación.
   * @param {number} pageNumber - El número de la página a establecer.
   */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  /**
   * Calcula el número total de páginas en función del número de análisis filtrados.
   * @type {Array}
   */
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(analysesFiltered.length / analysesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  /**
   * Filtra los análisis que aún no han sido analizados (sin fecha de análisis).
   * @type {Array}
   */
  const pendingAnalyses = analyses.filter((a) => !a.analysis_date);

  /**
   * Filtra los análisis que tienen un rendimiento (yield).
   * @type {Array}
   */
  const analysesWithYield = analyses.filter(
    (a) => a.yield !== null && a.yield !== undefined
  );

  /**
   * Calcula el rendimiento promedio de los análisis con rendimiento.
   * @type {number}
   */
  const averageYield =
    analysesWithYield.length > 0
      ? analysesWithYield.reduce((sum, a) => sum + Number(a.yield), 0) /
        analysesWithYield.length
      : 0;

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("analyses.management")}</h1>
      </div>

      <EditAnalysisModal
        open={modalEditAnalysisOpen}
        setOpen={setModalEditAnalysisOpen}
        updateAnalyses={updateAnalyses}
        selectedAnalysis={selectedAnalysis}
      />

      {/* Cards Kilos / Litros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loadingAnalyses ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-1*2" />
          </div>
        ) : errorAnalyses ? (
          <div className="text-red-600">{errorAnalyses}</div>
        ) : (
          <>
            <Card
              className={clsx(
                "rounded-2xl shadow p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("analysis.pending")}:
                </div>
                <div className="text-3xl font-bold">
                  {pendingAnalyses.length}
                </div>
              </div>
            </Card>
            <Card
              className={clsx(
                "rounded-2xl shadow p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("home.oil_yield")}:
                </div>
                <div className="text-3xl font-bold">
                  {averageYield.toFixed(2)}%
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar análisis..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={clsx("w-full md:w-1/2")}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(analysesPerPage)}
            onValueChange={(value) => {
              setAnalysesPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla o Skeleton */}
      <Card
        className={clsx(
          "rounded-2xl shadow p-4 w-full border overflow-x-auto",
          isDarkMode
            ? "bg-dark-900 border-dark-700 text-dark-50"
            : "bg-olive-50 border-olive-200 text-olive-800"
        )}
      >
        {loadingAnalyses ? (
          <div className="space-y-4">
            {Array.from({ length: analysesPerPage }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b-2">
                  <th className="p-3 text-left w-1/14">ID</th>
                  <th className="p-3 text-left w-1/8">{t("analysis.date")}</th>
                  <th className="p-3 text-left w-1/8">
                    {t("analysis.member")}
                  </th>
                  <th className="p-3 text-left w-1/10">
                    {t("analysis.oliveQuantity")}
                  </th>
                  <th className="p-3 text-left w-1/10">
                    {t("analysis.acidity")}
                  </th>
                  <th className="p-3 text-left w-1/10">
                    {t("analysis.humidity")}
                  </th>
                  <th className="p-3 text-left w-1/8">{t("analysis.yield")}</th>
                  <th className="p-3 text-left w-1/6">
                    {t("analysis.oilType")}
                  </th>
                  <th className="p-3 text-left w-1/6">
                    {t("analysis.oilQuantity")}
                  </th>
                  <th className="p-3 text-center w-1/8">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnalyses.map((analysis) => (
                  <tr
                    key={analysis.id}
                    className={clsx(
                      "border-b transition-colors",
                      isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                    )}
                  >
                    <td className="p-3">{analysis.id}</td>
                    <td className="p-3 font-medium">
                      {analysis.analysis_date
                        ? `${analysis.analysis_date}`
                        : "-"}
                    </td>
                    <td className="p-3">{analysis.member?.name}</td>
                    <td className="p-3">
                      {analysis.entry?.olive_quantity} Kg (ID Ent:{" "}
                      <span className="font-bold">
                        {analysis.entry?.entry_id}
                      </span>
                      )
                    </td>
                    <td className="p-3">
                      {analysis.acidity ? `${analysis.acidity}%` : "-"}
                    </td>
                    <td className="p-3">
                      {analysis.humidity ? `${analysis.humidity}%` : "-"}
                    </td>
                    <td className="p-3">
                      {analysis.yield ? `${analysis.yield}%` : "-"}
                    </td>
                    <td className="p-3">
                      {analysis.oil?.name ? `${analysis.oil?.name}` : "-"}
                    </td>
                    <td className="p-3">
                      {analysis.oil?.name &&
                      analysis.entry?.olive_quantity &&
                      analysis.yield
                        ? `${(
                            (analysis.entry.olive_quantity * analysis.yield) /
                            100
                          ).toFixed(2)} Kg`
                        : "-"}
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex space-x-2 items-center">
                        {analysis.analysis_date === null && (
                          <SquarePen
                            size={18}
                            className="cursor-pointer text-blue-700 hover:text-blue-400"
                            onClick={() => {
                              setSelectedAnalysis(analysis);
                              setModalEditAnalysisOpen(true);
                            }}
                          />
                        )}
                        <PDFDownloadLink
                          document={<AnalysisPDF analysis={analysis} />}
                          fileName={`informe_analisis-${analysis.member?.name}-${analysis.id}.pdf`}
                        >
                          {({ loadingAnalyses }) =>
                            loadingAnalyses ? (
                              <BiSolidFilePdf size={20} />
                            ) : (
                              <BiSolidFilePdf size={20} />
                            )
                          }
                        </PDFDownloadLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Paginación */}
      {pageNumbers.length > 1 && (
        <Pagination>
          <PaginationContent className="overflow-x-auto">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {getVisiblePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(Number(page));
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < pageNumbers.length)
                    setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Analyses;
