import React, { useEffect, useState } from "react";
import ChartEntries from "@components/Charts/ChartEntries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getEntries } from "@services/entryRequests";
import { SquarePen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import NewEntryModal from "@pages/Entry/NewEntryModal";
import EditEntryModal from "@pages/Entry/EditEntryModal";
import DeleteEntryModal from "@pages/Entry/DeleteEntryModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EntryPDF } from "@components/pdf/EntryPDF";
import { EntryWithOilPDF } from "@components/pdf/EntryWithOilPDF";
import { BiSolidFilePdf } from "react-icons/bi";

/**
 * Componente que maneja la visualización y gestión de las entradas de aceituna y aceite.
 * Permite la visualización de datos, la filtración, la paginación, y las acciones sobre las entradas (editar, eliminar, generar informes).
 *
 * @component
 * @example
 * return (
 *   <Entries />
 * )
 */
const Entries = () => {
  /**
   * Estado que almacena el tema actual de la aplicación (oscuro o claro).
   * @type {Object}
   */
  const { theme } = useTheme();

  /**
   * Estado que indica si el modo oscuro está activado o no.
   * @type {boolean}
   */
  const isDarkMode = theme === "dark";

  /**
   * Hook para la traducción de textos.
   * @type {function}
   */
  const { t } = useTranslation();

  /**
   * Estado que almacena las entradas de aceituna.
   * @type {Array<Object>}
   */
  const [entries, setEntries] = useState([]);

  /**
   * Estado que almacena la entrada seleccionada para edición o eliminación.
   * @type {Object|null}
   */
  const [selectedEntry, setSelectedEntry] = useState(null);

  /**
   * Estado que indica si las entradas se están cargando.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Estado que almacena la página actual de la paginación.
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Estado que almacena la cantidad de entradas por página.
   * @type {number}
   */
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  /**
   * Estado que almacena un error en caso de que ocurra al obtener las entradas.
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * Estado que almacena el texto de filtrado.
   * @type {string}
   */
  const [filtro, setFiltro] = useState("");

  /**
   * Estado que indica si el modal de nueva entrada está abierto.
   * @type {boolean}
   */
  const [modalNewEntryOpen, setModalNewEntryOpen] = useState(false);

  /**
   * Estado que indica si el modal de edición de entrada está abierto.
   * @type {boolean}
   */
  const [modalEditEntryOpen, setModalEditEntryOpen] = useState(false);

  /**
   * Estado que indica si el modal de eliminación de entrada está abierto.
   * @type {boolean}
   */
  const [modalDeleteEntryOpen, setModalDeleteEntryOpen] = useState(false);

  /**
   * Función para obtener las entradas desde la API.
   * @async
   * @function
   */
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await getEntries();
      if (response.status === "success") {
        setEntries(response.data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("Error al obtener las entradas.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto que se ejecuta al montar el componente y obtiene las entradas.
   * 
   */
  useEffect(() => {
    fetchEntries();
  }, []);

  /**
   * Actualiza las entradas después de alguna acción como crear, editar o eliminar.
   * @function
   */
  const updateEntries = async () => {
    await fetchEntries();
  };

  /**
   * Filtra las entradas en base al texto introducido en el campo de búsqueda.
   * @type {Array<Object>}
   */
  const entriesFiltered = entries.filter((entry) =>
    entry.member?.name.toLowerCase().includes(filtro.toLowerCase())
  );

  /**
   * Calcula y devuelve los números de página visibles en la paginación.
   * @returns {Array<number|string>} Números de página visibles o elípticos ("...").
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

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entriesFiltered.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(entriesFiltered.length / entriesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  /**
   * Calcula el total de kilos de aceituna de todas las entradas.
   * @type {number}
   */
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
        <Button
          className={clsx(
            "cursor-pointer text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalNewEntryOpen(true)}
        >
          + {t("entries.newEntry")}
        </Button>
      </div>

      <NewEntryModal
        open={modalNewEntryOpen}
        setOpen={setModalNewEntryOpen}
        updateEntries={updateEntries}
      />
      <EditEntryModal
        open={modalEditEntryOpen}
        setOpen={setModalEditEntryOpen}
        updateEntries={updateEntries}
        selectedEntry={selectedEntry}
      />
      <DeleteEntryModal
        open={modalDeleteEntryOpen}
        setOpen={setModalDeleteEntryOpen}
        updateEntries={updateEntries}
        selectedEntry={selectedEntry}
      />

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
                "rounded-2xl shadow p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("entries.totalTn")}:
                </div>
                <div className="text-3xl font-bold">
                  {kgTn.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  Tn
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
                  {t("entries.totalLt")}:
                </div>
                <div className="text-3xl font-bold">
                  {totalLitros.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  L
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder={t("entries.searchPlaceholder")}
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
          "rounded-2xl shadow p-4 w-full border overflow-x-auto",
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
                          <SquarePen
                            size={18}
                            className="cursor-pointer text-blue-700 hover:text-blue-400"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setModalEditEntryOpen(true);
                            }}
                          />
                        )}
                        {entry.oil_quantity === null && (
                          <Trash2
                            size={18}
                            className="cursor-pointer text-red-700 hover:text-red-400"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setModalDeleteEntryOpen(true);
                            }}
                          />
                        )}
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

      <ChartEntries entries={entries} />
    </div>
  );
};

export default Entries;
