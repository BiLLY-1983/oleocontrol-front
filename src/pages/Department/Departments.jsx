import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { SquarePen, Trash2 } from "lucide-react";
import { getDepartments } from "@services/departmentRequests";
import { getEmployees } from "@services/employeeRequests.js";

// Registrar elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Departments = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Obtener departamentos y conteo de empleados por departamento
  const fetchDepartmentsAndCounts = async () => {
    setLoadingDepartments(true);
    try {
      const [departmentsResult, employeesResult] = await Promise.all([
        getDepartments("/departments"),
        getEmployees("/employees")
      ]);

      if (
        departmentsResult.status === "success" &&
        employeesResult.status === "success"
      ) {
        const employeeCountMap = {};
        employeesResult.data.forEach((employee) => {
          const departmentId = employee.department?.id;
          if (departmentId) {
            employeeCountMap[departmentId] =
              (employeeCountMap[departmentId] || 0) + 1;
          }
        });

        const transformedDepartments = departmentsResult.data.map(
          (department) => ({
            id: department.id,
            name: department.name,
            label: t(`departments.${department.name}`),
            employeeCount: employeeCountMap[department.id] || 0,
          })
        );

        setDepartments(transformedDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments and counts:", error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Obtener empleados por departamento
  const fetchEmployeesByDepartment = async (departmentId) => {
    setLoadingEmployees(true);
    try {
      const response = await getEmployees(`/employees`);
      if (response.status === "success") {
        const filteredEmployees = response.data.filter(
          (employee) => employee.department?.id === departmentId
        );
        setEmployees(filteredEmployees);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsAndCounts();
  }, []);

  const handleCardClick = async (department) => {
    setSelectedDepartment(department);
    await fetchEmployeesByDepartment(department.id);
    setDialogOpen(true);
  };

  // Preparar datos para el gráfico circular
  const chartData = {
    labels: departments.map((department) => department.name),
    datasets: [
      {
        data: departments.map((department) => department.employeeCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
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
        <h1 className="text-2xl font-bold">{t("departments.management")}</h1>
        {/* Botón de Nuevo Departamento */}
        <button
          className={clsx(
            "py-2 px-4 rounded-md shadow cursor-pointer text-white text-sm",
            isDarkMode
              ? "bg-dark-600 hover:bg-dark-500"
              : "bg-olive-500 hover:bg-olive-600"
          )}
          onClick={() => console.log("Nuevo Rol")}
        >
          + {t("departments.newDepartment")}
        </button>
      </div>

      {/* Mostrar Skeleton mientras se cargan los departamentos */}
      {loadingDepartments ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {departments.map((department) => (
              <Card
                key={department.id}
                className={clsx(
                  "p-4 rounded-lg shadow cursor-pointer transition-transform transform hover:scale-105",
                  isDarkMode
                    ? "bg-dark-700 text-dark-50"
                    : "bg-olive-100 text-olive-800"
                )}
                onClick={() => handleCardClick(department)}
              >
                <h2 className="text-xl font-semibold">{department.name}</h2>
                <p className="text-3xl font-bold">{department.employeeCount}</p>

                {/* Botones de Editar y Eliminar */}
                <div className="mt-4 flex justify-end gap-2">
                  <SquarePen
                    size={18}
                    className="cursor-pointer text-blue-700 hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Editar departamento: ${department.id}`);
                    }}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-700 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Eliminar departamento: ${department.id}`);
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>

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
        </>
      )}

      {/* Dialog para mostrar empleados del departamento seleccionado */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={clsx(
            "max-h-[50vh] overflow-y-auto",
            isDarkMode ? "bg-dark-700 text-dark-50" : "bg-white text-olive-800"
          )}
        >
          <DialogHeader>
            <DialogTitle>
              {t("departments.employeesWithDepartment", {
                department: selectedDepartment?.label,
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            {loadingEmployees ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center space-x-4"
                  >
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-8 w-1/6" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-left">
                      {t("userProfile.firstName")}
                    </th>
                    <th className="p-3 text-left">
                      {t("userProfile.lastName")}
                    </th>
                    <th className="p-3 text-left">{t("userProfile.email")}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className={clsx(
                          "border-b transition-colors",
                          isDarkMode
                            ? "hover:bg-dark-700"
                            : "hover:bg-olive-100"
                        )}
                      >
                        <td className="p-3">{employee.first_name}</td>
                        <td className="p-3">{employee.last_name}</td>
                        <td className="p-3">{employee.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-center">
                        {t("common.noData")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departments;
