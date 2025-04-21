import React, { useEffect, useState } from "react";
import { getMembers } from "@services/memberRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, SquarePen } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@context/ThemeContext";
import clsx from "clsx";
import NewMemberModal from "@pages/Member/NewMemberModal";
import EditMemberModal from "@pages/Member/EditMemberModal";
import DeleteMemberModal from "@pages/Member/DeleteMemberModal";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Members = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [modalNewMemberOpen, setModalNewMemberOpen] = useState(false);
  const [modalEditMemberOpen, setModalEditMemberOpen] = useState(false);
  const [modalDeleteMemberOpen, setModalDeleteMemberOpen] = useState(false);

  // Función para obtener los socios
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMembers();
      if (response.status === "success" && Array.isArray(response.data)) {
        setMembers(response.data);
      } else {
        setError("No se pudieron obtener los socios.");
      }
    } catch (err) {
      setError("Hubo un error al cargar los socios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const activeCount = members.filter(
    (member) => member.user.status === 1
  ).length;
  const inactiveCount = members.filter(
    (member) => member.user.status !== 1
  ).length;

  // Función para actualizar la lista de socios
  const updateMembers = async () => {
    await fetchMembers(); // Vuelve a cargar la lista
  };

  // Filtrar socios
  const filteredMembers = members.filter(
    (member) =>
      member.user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      member.user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
      member.user.email.toLowerCase().includes(filter.toLowerCase()) ||
      member.user.phone.toLowerCase().includes(filter.toLowerCase()) ||
      member.user.dni.toLowerCase().includes(filter.toLowerCase()) ||
      (member.user.status === 1 ? "activo" : "inactivo").includes(
        filter.toLowerCase()
      )
  );

  // Paginación
  const getVisiblePageNumbers = () => {
    const totalPages = pageNumbers.length;
    const maxVisible = 5;
    //const pages = [];

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

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredMembers.length / membersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Preparar datos para el gráfico circular
  const chartData = {
    labels: ["Activos", "Inactivos"],
    datasets: [
      {
        data: [activeCount, inactiveCount],
        backgroundColor: ["#4CAF50", "#F44336"], // verde y rojo
        hoverBackgroundColor: ["#45A049", "#E53935"],
      },
    ],
  };

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Socios</h1>
        <Button
          className={clsx(
            "cursor-pointer text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalNewMemberOpen(true)}
        >
          + {t("members.newMember")}
        </Button>
      </div>

      <NewMemberModal
        open={modalNewMemberOpen}
        setOpen={setModalNewMemberOpen}
        updateMembers={updateMembers}
      />
      <EditMemberModal
        open={modalEditMemberOpen}
        setOpen={setModalEditMemberOpen}
        updateMembers={updateMembers}
        selectedMember={selectedMember}
      />
      <DeleteMemberModal
        open={modalDeleteMemberOpen}
        setOpen={setModalDeleteMemberOpen}
        updateMembers={updateMembers}
        selectedMember={selectedMember}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar socios..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(membersPerPage)}
            onValueChange={(value) => {
              setMembersPerPage(Number(value));
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
            {Array.from({ length: membersPerPage }).map((_, i) => (
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
          <>
            {/* Tabla de socios */}
            <div className="overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b-2">
                    <th className="p-3 text-lg w-1/4">
                      {t("userProfile.firstName")}
                    </th>
                    <th className="p-3 text-lg w-1/4">
                      {t("userProfile.email")}
                    </th>
                    <th className="p-3 text-lg w-1/4 ">
                      {t("userProfile.phone")}
                    </th>
                    <th className="p-3 text-lg w-1/8 ">
                      {t("userProfile.dni")}
                    </th>
                    <th className="p-3 text-lg w-1/6 ">
                      {t("members.memberNumber")}
                    </th>
                    <th className="p-3 text-lg w-1/8">{t("common.status")}</th>
                    <th className="p-3 text-center text-lg w-1/6">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentMembers.map((member) => (
                    <tr
                      key={member.id}
                      className={clsx(
                        "border-b transition-colors",
                        isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                      )}
                    >
                      <td className="p-3">
                        {member.user.first_name} {member.user.last_name}
                      </td>
                      <td className="p-3">{member.user.email}</td>
                      <td className="p-3">{member.user.phone}</td>
                      <td className="p-3">{member.user.dni}</td>
                      <td className="p-3">{member.member_number}</td>
                      <td className="p-3">
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            member.user.status === 1
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          )}
                        >
                          {member.user.status === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex space-x-2 items-center">
                          {!member.user.roles.some(
                            (role) => role.name === "Administrador"
                          ) && (
                            <>
                              <SquarePen
                                size={18}
                                className="cursor-pointer text-blue-700 hover:text-blue-400"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setModalEditMemberOpen(true);
                                }}
                              />
                              <Trash2
                                size={18}
                                className="cursor-pointer text-red-700 hover:text-red-400"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setModalDeleteMemberOpen(true);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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

      {/* Gráfico circular */}
      <div className="mt-20 flex justify-center h-100">
        <div className="w-full max-w-sm">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Members;
