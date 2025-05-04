import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@context/UserContext";
import ChartEntries from "@components/Charts/ChartEntries";
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
import {
  getVisiblePageNumbers,
  getPageNumbers,
  getPaginatedData,
} from "@utils/paginationUtils";
import { getEntriesForMember } from "@services/entryRequests";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EntryPDF } from "@components/pdf/EntryPDF";
import { EntryWithOilPDF } from "@components/pdf/EntryWithOilPDF";
import { BiSolidFilePdf } from "react-icons/bi";

/**
 * Página para que los socios visualicen sus entradas de aceituna.
 * Permite filtrar, paginar y generar informes en PDF sobre las entradas.
 *
 * @component
 * @returns {JSX.Element} Página de entradas para socios.
 */
const EntriesMember = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation();
  const { userData } = useContext(UserContext);
  const memberId = userData?.user?.member?.id;

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  const fetchEntries = async () => {
    setLoading(true);
    try {
      if (!memberId) return; // Evitar llamadas si no hay id

      const response = await getEntriesForMember(memberId);
      if (response.status === "success") {
        setEntries(response.data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("No se pudieron obtener las entradas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const entriesFiltered = entries.filter((entry) => {
    const cantidad = Number(filtro);
    if (isNaN(cantidad)) return false;
    return entry.olive_quantity >= cantidad;
  });

  // Cálculos
  const pageNumbers = getPageNumbers(entriesFiltered.length, entriesPerPage);
  const currentEntries = getPaginatedData(
    entriesFiltered,
    currentPage,
    entriesPerPage
  );
  const visiblePageNumbers = getVisiblePageNumbers(pageNumbers, currentPage);

  // Cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalKilos = entries.reduce(
    (sum, e) => sum + Number(e.olive_quantity ?? 0),
    0
  );
  const kgTn = totalKilos / 1000;

  const totalLitros = entries.reduce(
    (sum, e) => sum + Number(e.oil_quantity ?? 0),
    0
  );

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("entries.management")}</h1>
      </div>

      {/* Cards Kilos / Litros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-15 w-1*2" />
            <Skeleton className="h-15 w-1*2" />
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            <Card
              className={clsx(
                "p-6 rounded-lg shadow-xl",
                isDarkMode ? "bg-dark-700" : "bg-olive-100"
              )}
            >
              <h2 className="text-xl font-semibold">{t("entries.totalTn")}</h2>
              <p className="text-3xl font-bold">{kgTn.toFixed(2)} Tn</p>
            </Card>

            <Card
              className={clsx(
                "p-6 rounded-lg shadow-xl",
                isDarkMode ? "bg-dark-700" : "bg-olive-100"
              )}
            >
              <h2 className="text-xl font-semibold">{t("entries.totalLt")}</h2>
              <p className="text-3xl font-bold">{totalLitros.toFixed(2)} L</p>
            </Card>
          </>
        )}
      </div>

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar entradas..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={clsx("w-full md:w-1/2")}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(entriesPerPage)}
            onValueChange={(value) => {
              setEntriesPerPage(Number(value));
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
          "rounded-2xl shadow-2xl p-4 w-full border overflow-x-auto",
          isDarkMode
            ? "bg-dark-900 border-dark-700 text-dark-50"
            : "bg-olive-50 border-olive-200 text-olive-800"
        )}
      >
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: entriesPerPage }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center space-x-4"
              >
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-10 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b-2">
                  <th className="p-3 text-left w-1/14">ID</th>
                  <th className="p-3 text-left w-1/4">{t("entries.date")}</th>
                  <th className="p-3 text-left w-1/4">{t("entries.member")}</th>
                  <th className="p-3 text-left w-1/4">{t("entries.weight")}</th>
                  <th className="p-3 text-left w-1/4">
                    {t("entries.oliQuantity")}
                  </th>
                  <th className="p-3 text-center w-1/8">
                    {t("entries.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={clsx(
                      "border-b transition-colors",
                      isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                    )}
                  >
                    <td className="p-3 font-medium">{entry.id}</td>
                    <td className="p-3 font-medium">{entry.entry_date}</td>
                    <td className="p-3">{entry.member.name}</td>
                    <td className="p-3">
                      {entry.olive_quantity
                        ? `${entry.olive_quantity} Kg`
                        : "-"}
                    </td>
                    <td className="p-3">
                      {entry.oil_quantity ? `${entry.oil_quantity} L` : "-"}
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex space-x-2 items-center">
                        {entry.oil_quantity === null && (
                          <PDFDownloadLink
                            document={<EntryPDF entry={entry} />}
                            fileName={`informe_entrada-${entry.member?.name}-${entry.id}.pdf`}
                          >
                            {({ loading }) =>
                              loading ? (
                                <BiSolidFilePdf size={20} />
                              ) : (
                                <BiSolidFilePdf size={20} />
                              )
                            }
                          </PDFDownloadLink>
                        )}
                        {entry.oil_quantity !== null && (
                          <PDFDownloadLink
                            document={<EntryWithOilPDF entry={entry} />}
                            fileName={`informe_entrada-${entry.member?.name}-${entry.id}.pdf`}
                          >
                            {({ loading }) =>
                              loading ? (
                                <BiSolidFilePdf size={20} />
                              ) : (
                                <BiSolidFilePdf size={20} />
                              )
                            }
                          </PDFDownloadLink>
                        )}
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

            {visiblePageNumbers.map((page, index) => (
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

      <ChartEntries entries={entries} />
    </div>
  );
};

export default EntriesMember;
