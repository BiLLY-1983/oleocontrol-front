import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@context/UserContext";
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
import {
  getVisiblePageNumbers,
  getPageNumbers,
  getPaginatedData,
} from "@utils/paginationUtils";
import { getSettlements } from "@services/settlementRequests";
import { SquarePen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import NewSettlementModal from "@pages/Settlement/NewSettlementModal";
import EditSettlementModal from "@pages/Settlement/EditSettlementModal";
import DeleteSettlementModal from "@pages/Settlement/DeleteSettlementModal";
import ChartSettlements from "@components/Charts/ChartSettlements";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SettlementPDF } from "@components/pdf/SettlementPDF";
import { BiSolidFilePdf } from "react-icons/bi";

/**
 * Página para la gestión de liquidaciones.
 *
 * Permite a los administradores y empleados visualizar, filtrar, crear, editar y eliminar liquidaciones.
 * También incluye gráficos y opciones de exportación en PDF.
 *
 * @component
 * @returns {JSX.Element} Página de gestión de liquidaciones.
 */
const Settlements = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation();

  const { userData } = useContext(UserContext);
  const employeeId = userData?.user?.employee?.id;
  const roles = userData.user.roles.map((rol) => rol.name);

  const [settlements, setSettlements] = useState([]);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [loadingSettlement, setLoadingSettlement] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [settlementsPerPage, setSettlementsPerPage] = useState(10);
  const [errorSettlement, setErrorSettlement] = useState(null);
  const [filter, setFilter] = useState("");
  const [modalNewSettlementOpen, setModalNewSettlementOpen] = useState(false);
  const [modalEditSettlementOpen, setModalEditSettlementOpen] = useState(false);
  const [modalDeleteSettlementOpen, setModalDeleteSettlementOpen] =
    useState(false);

  const fetchSettlements = async () => {
    setLoadingSettlement(true);
    try {
      const response = await getSettlements();
      if (response.status === "success") {
        setSettlements(response.data);
      }
    } catch (error) {
      console.error("Error fetching settlements:", error);
      setErrorSettlement("Error al cargar las liquidaciones.");
    } finally {
      setLoadingSettlement(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const updateSettlements = async () => {
    await fetchSettlements();
  };

  const settlementsFiltered = settlements.filter(
    (settlement) =>
      settlement.member?.name.toLowerCase().includes(filter.toLowerCase()) ||
      settlement.employee?.name.toLowerCase().includes(filter.toLowerCase()) ||
      settlement.settlement_status
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      settlement.oil?.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Cálculos
  const pageNumbers = getPageNumbers(
    settlementsFiltered.length,
    settlementsPerPage
  );
  const currentSettlements = getPaginatedData(
    settlementsFiltered,
    currentPage,
    settlementsPerPage
  );
  const visiblePageNumbers = getVisiblePageNumbers(pageNumbers, currentPage);

  // Cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Contadores globales de liquidaciones por estado
  const pendingSettlements = settlements.filter(
    (s) => s.settlement_status === "Pendiente"
  ).length;

  const acceptedSettlements = settlements.filter(
    (s) => s.settlement_status === "Aceptada"
  ).length;

  const cancelledSettlements = settlements.filter(
    (s) => s.settlement_status === "Cancelada"
  ).length;

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("settlements.management")}</h1>
        {roles.includes("Administrador") && (
          <Button
            className={clsx(
              "cursor-pointer text-white",
              isDarkMode
                ? "bg-dark-600 hover:bg-dark-500"
                : "bg-olive-500 hover:bg-olive-600"
            )}
            onClick={() => setModalNewSettlementOpen(true)}
          >
            + {t("settlements.newSettlement")}
          </Button>
        )}
      </div>

      <NewSettlementModal
        open={modalNewSettlementOpen}
        setOpen={setModalNewSettlementOpen}
        updateSettlements={updateSettlements}
      />
      <EditSettlementModal
        open={modalEditSettlementOpen}
        setOpen={setModalEditSettlementOpen}
        updateSettlements={updateSettlements}
        selectedSettlement={selectedSettlement}
      />
      <DeleteSettlementModal
        open={modalDeleteSettlementOpen}
        setOpen={setModalDeleteSettlementOpen}
        updateSettlements={updateSettlements}
        selectedSettlement={selectedSettlement}
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loadingSettlement ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-1*2" />
          </div>
        ) : errorSettlement ? (
          <div className="text-red-600">{errorSettlement}</div>
        ) : (
          <>
            <Card
              className={clsx(
                "rounded-2xl shadow-xl p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("settlements.pending")}:
                </div>
                <div className="text-3xl font-bold">{pendingSettlements}</div>
              </div>
            </Card>
            <Card
              className={clsx(
                "rounded-2xl shadow-xl p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("settlements.accept")}:
                </div>
                <div className="text-3xl font-bold">{acceptedSettlements}</div>
              </div>
            </Card>
            <Card
              className={clsx(
                "rounded-2xl shadow-xl p-4 w-full border",
                isDarkMode
                  ? "bg-dark-900 border-dark-700 text-dark-50"
                  : "bg-olive-100 border-olive-300 text-olive-800"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-lg font-semibold">
                  {t("settlements.cancelled")}:
                </div>
                <div className="text-3xl font-bold">{cancelledSettlements}</div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder={t("settlements.searchPlaceholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(settlementsPerPage)}
            onValueChange={(value) => {
              setSettlementsPerPage(Number(value));
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
        {loadingSettlement ? (
          <div className="space-y-4">
            {Array.from({ length: settlementsPerPage }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b-2">
                  <th className="p-3 text-left w-1/14">ID</th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.member")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.date")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.oil_type")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.amount")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.price")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.status")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.date_res")}
                  </th>
                  <th className="p-3 text-left w-1/8">
                    {t("settlements.employee")}
                  </th>
                  <th className="p-3 text-center w-1/14">
                    {t("settlements.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSettlements.map((settlement) => (
                  <tr
                    key={settlement.id}
                    className={clsx(
                      "border-b transition-colors",
                      isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                    )}
                  >
                    <td className="p-3">{settlement.id}</td>
                    <td className="p-3">{settlement.member?.name}</td>
                    <td className="p-3">{settlement.settlement_date}</td>
                    <td className="p-3">{settlement.oil?.name}</td>
                    <td className="p-3">{settlement.amount}</td>
                    <td className="p-3">{settlement.price}</td>
                    <td
                      className={`p-3 ${
                        settlement.settlement_status === "Aceptada"
                          ? "text-green-500"
                          : settlement.settlement_status === "Cancelada"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {settlement.settlement_status}
                    </td>
                    <td className="p-3">
                      {settlement.settlement_date_res
                        ? settlement.settlement_date_res
                        : "-"}
                    </td>
                    <td className="p-3">
                      {settlement.employee?.name
                        ? settlement.employee?.name
                        : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex space-x-2 items-center">
                        <SquarePen
                          size={18}
                          className="cursor-pointer text-blue-700 hover:text-blue-400"
                          onClick={() => {
                            setSelectedSettlement(settlement);
                            setModalEditSettlementOpen(true);
                          }}
                        />
                        {settlement.settlement_status === "Pendiente" && (
                          <Trash2
                            size={18}
                            className="cursor-pointer text-red-700 hover:text-red-400"
                            onClick={() => {
                              setSelectedSettlement(settlement);
                              setModalDeleteSettlementOpen(true);
                            }}
                          />
                        )}
                        <PDFDownloadLink
                          document={<SettlementPDF settlement={settlement} />}
                          fileName={`informe_liquidacion-${settlement.member?.name}-${settlement.id}.pdf`}
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

      <ChartSettlements settlements={settlements} />
    </div>
  );
};

export default Settlements;
