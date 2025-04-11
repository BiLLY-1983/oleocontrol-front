import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Users = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers("/users");
      if (response.status === "success" && Array.isArray(response.data)) {
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

  const handleEdit = (id) => {
    console.log("Edición");
  };

  const handleDelete = (id) => {
    console.log("Borrado");
  };

  // Función para actualizar la lista de usuarios
  const updateUsuarios = async () => {
    await fetchUsuarios(); // Vuelve a cargar la lista de usuarios
  };

  // Paginación
  const getVisiblePageNumbers = () => {
    const totalPages = pageNumbers.length;
    const maxVisible = 5;
    const pages = [];

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

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.first_name.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase())
  );

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
            "cursor-pointer bg-olive-500  text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalOpen(true) }
        >
          + Nuevo Usuario
        </Button>
      </div>

      <NewUserModal open={modalOpen} setOpen={setModalOpen} isDarkMode={isDarkMode} updateUsuarios={updateUsuarios} />

      {/* Filtro y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar usuarios..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={clsx(
            "w-full md:w-1/2",
          )}
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
          "rounded-2xl shadow p-4 w-full border overflow-x-auto",
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
                  <th className="p-3 text-lg w-1/4">Nombre</th>
                  <th className="p-3 text-lg w-1/4">Email</th>
                  <th className="p-3 text-lg w-1/5">Roles</th>
                  <th className="p-3 text-lg w-1/5">Estado</th>
                  <th className="p-3 text-center text-lg w-1/5">Acciones</th>
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
                    <td className="p-3 font-medium">
                      {usuario.first_name} {usuario.last_name}
                    </td>
                    <td className="p-3">{usuario.email}</td>
                    <td className="p-3">
                      {usuario.roles.map((role) => role.name).join(", ")}
                    </td>
                    <td className="p-3">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          usuario.status === 1
                            ? "bg-blue-700 text-white"
                            : "bg-red-700 text-white"
                        )}
                      >
                        {usuario.status === 1 ? " Activo " : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex space-x-2 items-center">
                        <SquarePen
                          size={18}
                          className="cursor-pointer text-blue-600"
                          onClick={() => handleEdit(usuario.id)}
                        />
                        <Trash2
                          size={18}
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(usuario.id)}
                        />
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

export default Users;
