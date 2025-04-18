import React, { useEffect, useState } from "react";
import { getEmployees } from "@services/EmployeeRequests";
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
import NewEmployeeModal from "@pages/Employee/NewEmployeeModal";
import EditEmployeeModal from "@pages/Employee/EditEmployeeModal";
import DeleteEmployeeModal from "@pages/Employee/DeleteEmployeeModal";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Employees = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [modalNewEmployeeOpen, setModalNewEmployeeOpen] = useState(false);
  const [modalEditEmployeeOpen, setModalEditEmployeeOpen] = useState(false);
  const [modalDeleteEmployeeOpen, setModalDeleteEmployeeOpen] = useState(false);

  // Función para obtener los socios
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployees();
      if (response.status === "success" && Array.isArray(response.data)) {
        setEmployees(response.data);
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
    fetchEmployees();
  }, []);

  // Función para actualizar la lista de socios
  const updateEmployees = async () => {
    await fetchEmployees(); // Vuelve a cargar la lista
  };

  // Filtrar socios
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      employee.user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(filter.toLowerCase()) ||
      employee.user.phone.toLowerCase().includes(filter.toLowerCase()) ||
      employee.user.dni.toLowerCase().includes(filter.toLowerCase()) ||
      employee.department.name.toLowerCase().includes(filter.toLowerCase()) ||
      (employee.user.status === 1 ? "activo" : "inactivo").includes(
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

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredEmployees.length / employeesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Preparar datos para el gráfico circular
  const [hoveredDepartment, setHoveredDepartment] = useState(null);

  // Preparar datos para el gráfico circular
  const departmentCounts = employees.reduce((acc, emp) => {
    const deptName = emp.department.name;
    if (!acc[deptName]) {
      acc[deptName] = { active: 0, inactive: 0 };
    }
    if (emp.user.status === 1) {
      acc[deptName].active += 1;
    } else {
      acc[deptName].inactive += 1;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        data: Object.values(departmentCounts).map(
          (count) => count.active + count.inactive
        ),
        backgroundColor: [
          "#5A9BD5",
          "#70AD47",
          "#A076C4",
          "#4DCBC4",
          "#ED7D31",
          "#8395A7",
        ],
        hoverBackgroundColor: [
          "#4A8BC5",
          "#609D37",
          "#9066B4",
          "#3DBABA",
          "#DD6D21",
          "#738597",
        ],
        onHover: (event, chartElement) => {
          if (chartElement.length > 0) {
            const departmentName = chartData.labels[chartElement[0].index];
            setHoveredDepartment(departmentName);
          } else {
            setHoveredDepartment(null);
          }
        },
      },
    ],
  };

  // Mostrar información al pasar el cursor
  const renderHoveredInfo = () => {
    if (!hoveredDepartment) return null;

    const { active, inactive } = departmentCounts[hoveredDepartment];
    return (
      <div className="mt-4">
        <p>{`Departamento: ${hoveredDepartment}`}</p>
        <p>{`Empleados activos: ${active}`}</p>
        <p>{`Empleados inactivos: ${inactive}`}</p>
      </div>
    );
  };

  const barChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Número de empleados",
        data: Object.values(departmentCounts),
        backgroundColor: isDarkMode ? "#A076C4" : "#556339",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Empleados por Departamento",
      },
    },
  };

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
        <Button
          className={clsx(
            "cursor-pointer text-white",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => setModalNewEmployeeOpen(true)}
        >
          + {t("employees.newEmployee")}
        </Button>
      </div>

      <NewEmployeeModal
        open={modalNewEmployeeOpen}
        setOpen={setModalNewEmployeeOpen}
        updateEmployees={updateEmployees}
      />
      <EditEmployeeModal
        open={modalEditEmployeeOpen}
        setOpen={setModalEditEmployeeOpen}
        updateEmployees={updateEmployees}
        selectedEmployee={selectedEmployee}
      />
      <DeleteEmployeeModal
        open={modalDeleteEmployeeOpen}
        setOpen={setModalDeleteEmployeeOpen}
        updateEmployees={updateEmployees}
        selectedEmployee={selectedEmployee}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar empleados..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(employeesPerPage)}
            onValueChange={(value) => {
              setEmployeesPerPage(Number(value));
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
            {Array.from({ length: employeesPerPage }).map((_, i) => (
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
                      {t("departments.department")}
                    </th>
                    <th className="p-3 text-lg w-1/8">{t("common.status")}</th>
                    <th className="p-3 text-center text-lg w-1/6">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className={clsx(
                        "border-b transition-colors",
                        isDarkMode ? "hover:bg-dark-700" : "hover:bg-olive-100"
                      )}
                    >
                      <td className="p-3">
                        {employee.user.first_name} {employee.user.last_name}
                      </td>
                      <td className="p-3">{employee.user.email}</td>
                      <td className="p-3">{employee.user.phone}</td>
                      <td className="p-3">{employee.user.dni}</td>
                      <td className="p-3">{employee.department.name}</td>
                      <td className="p-3">
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            employee.user.status === 1
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          )}
                        >
                          {employee.user.status === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex space-x-2 items-center">
                          <SquarePen
                            size={18}
                            className="cursor-pointer text-blue-700 hover:text-blue-400"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setModalEditEmployeeOpen(true);
                            }}
                          />
                          <Trash2
                            size={18}
                            className="cursor-pointer text-red-700 hover:text-red-400"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setModalDeleteEmployeeOpen(true);
                            }}
                          />
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
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const departmentName = tooltipItem.label;
                      const { active, inactive } =
                        departmentCounts[departmentName];
                      return `${departmentName}: ${
                        active + inactive
                      } empleados (Activos: ${active}, Inactivos: ${inactive})`;
                    },
                  },
                },
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

export default Employees;
