import React, { useEffect, useState } from "react";
import { getUsers } from "@services/userRequests";
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
import NewUserModal from "@pages/User/NewUserModal";
import EditUserModal from "@pages/User/EditUserModal";
import DeleteUserModal from "@pages/User/DeleteUserModal";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente principal para la gestión de usuarios.
 * 
 * Permite listar, filtrar, agregar, editar y eliminar usuarios. Incluye funcionalidades de paginación,
 * manejo de estado de carga y errores, y gráficos para visualizar datos de usuarios.
 *
 * @component
 * @returns {JSX.Element} Componente de gestión de usuarios.
 *
 * @features
 * - Listar usuarios con paginación y filtrado.
 * - Manejar estado de carga y errores.
 * - Permitir agregar, editar y eliminar usuarios.
 * - Visualizar datos de usuarios mediante gráficos.
 */
const Users = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [modalNewUserOpen, setModalNewUserOpen] = useState(false);
  const [modalEditUserOpen, setModalEditUserOpen] = useState(false);
  const [modalDeleteUserOpen, setModalDeleteUserOpen] = useState(false);

  /**
   * Función para obtener la lista de usuarios desde la API.
   * Maneja el estado de carga y errores durante la solicitud.
   * 
   * @async
   * @function fetchUsuarios
   */
  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      if (response.status === "success") {
        setUsuarios(response.data);
      } else {
        setError("No se pudieron obtener los usuarios.");
      }
    } catch (err) {
      setError("Hubo un error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const activeCount = usuarios.filter((user) => user.status === 1).length;
  const inactiveCount = usuarios.filter((user) => user.status !== 1).length;

  /**
   * Función para actualizar la lista de usuarios después de realizar cambios.
   * Se llama después de agregar, editar o eliminar un usuario.
   * 
   * @async
   * @function updateUsuarios
   */
  const updateUsuarios = async () => {
    await fetchUsuarios(); // Vuelve a cargar la lista de usuarios
  };

  /**
   * Función para filtrar los usuarios según el criterio de búsqueda.
   * Permite buscar por nombre, apellido, email, teléfono y estado.
   * 
   * @function filterUsuarios
   * @param {string} filtro - Criterio de búsqueda.
   */
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.first_name.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.last_name.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.phone.includes(filtro.toLowerCase()) ||
      usuario.roles
        .map((rol) => rol.name.toLowerCase())
        .some((nombreRol) => nombreRol.includes(filtro.toLowerCase())) ||
      (usuario.status === 1 ? "activo" : "inactivo").includes(
        filtro.toLowerCase()
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuariosFiltrados.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(usuariosFiltrados.length / usersPerPage);
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
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button
          className={clsx(
            "cursor-pointer text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalNewUserOpen(true)}
        >
          + {t("users.newUser")}
        </Button>
      </div>

      <NewUserModal
        open={modalNewUserOpen}
        setOpen={setModalNewUserOpen}
        isDarkMode={isDarkMode}
        updateUsuarios={updateUsuarios}
      />

      <EditUserModal
        open={modalEditUserOpen}
        setOpen={setModalEditUserOpen}
        isDarkMode={isDarkMode}
        updateUsuarios={updateUsuarios}
        usuarioSeleccionado={usuarioSeleccionado}
      />

      <DeleteUserModal
        open={modalDeleteUserOpen}
        setOpen={setModalDeleteUserOpen}
        isDarkMode={isDarkMode}
        updateUsuarios={updateUsuarios}
        usuarioSeleccionado={usuarioSeleccionado}
      />

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder={t("users.searchPlaceholder")}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={clsx("w-full md:w-1/2")}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(usersPerPage)}
            onValueChange={(value) => {
              setUsersPerPage(Number(value));
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
            {Array.from({ length: usersPerPage }).map((_, i) => (
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
                  <th className="p-3 text-lg w-1/14">ID</th>
                  <th className="p-3 text-lg w-1/4">
                    {t("userProfile.firstName")}
                  </th>
                  <th className="p-3 text-lg w-1/4">
                    {t("userProfile.email")}
                  </th>
                  <th className="p-3 text-lg w-1/8">
                    {t("userProfile.phone")}
                  </th>
                  <th className="p-3 text-lg w-1/8">{t("userProfile.dni")}</th>
                  <th className="p-3 text-lg w-1/4">Roles</th>
                  <th className="p-3 text-lg w-1/6">{t("common.status")}</th>
                  <th className="p-3 text-center text-lg w-1/6">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className={clsx(
                      "border-b transition-colors",
                      isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                    )}
                  >
                    <td className="p-3">{usuario.id}</td>
                    <td className="p-3 font-medium">
                      {usuario.first_name} {usuario.last_name}
                    </td>
                    <td className="p-3">{usuario.email}</td>
                    <td className="p-3">{usuario.phone}</td>
                    <td className="p-3">{usuario.dni}</td>
                    <td className="p-3">
                      {usuario.roles.map((role) => role.name).join(", ")}
                    </td>
                    <td className="p-3">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          usuario.status === 1
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        )}
                      >
                        {usuario.status === 1 ? " Activo " : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex space-x-2 items-center">
                        {!usuario.roles.some((role) => role.name === 'Administrador') && (
                          <>
                            <SquarePen
                              size={18}
                              className="cursor-pointer text-blue-700 hover:text-blue-400"
                              onClick={() => {
                                setUsuarioSeleccionado(usuario);
                                setModalEditUserOpen(true);
                              }}
                            />
                            <Trash2
                              size={18}
                              className="cursor-pointer text-red-700 hover:text-red-400"
                              onClick={() => {
                                setUsuarioSeleccionado(usuario);
                                setModalDeleteUserOpen(true);
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
        <div className="w-full max-w-sm rounded-2xl shadow-2xl">
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

export default Users;
