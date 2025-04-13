import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { getRoles } from "@services/roleRequests";
import { getUsers } from "@services/userRequests";
import { Pie } from "react-chartjs-2"; // Importar el gráfico circular
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Roles = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Obtener roles y conteo de usuarios por rol
  const fetchRolesAndCounts = async () => {
    setLoadingRoles(true);
    try {
      const [rolesResult, usersResult] = await Promise.all([
        getRoles(),
        getUsers(),
      ]);

      if (
        rolesResult.status === "success" &&
        usersResult.status === "success"
      ) {
        const userCountMap = {};
        usersResult.data.forEach((user) => {
          if (Array.isArray(user.roles)) {
            user.roles.forEach((role) => {
              const roleId = role.id;
              userCountMap[roleId] = (userCountMap[roleId] || 0) + 1;
            });
          }
        });

        const transformedRoles = rolesResult.data.map((role) => ({
          id: role.id,
          name: role.name,
          label: t(`roles.${role.name}`),
          userCount: userCountMap[role.id] || 0,
        }));

        setRoles(transformedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles and counts:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Obtener usuarios por rol
  const fetchUsersByRole = async (roleId) => {
    setLoadingUsers(true);
    try {
      const response = await getUsers(`/users`);
      if (response.status === "success") {
        const filteredUsers = response.data.filter((user) =>
          user.roles.some((role) => role.id === roleId)
        );
        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users by role:", error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchRolesAndCounts();
  }, []);

  const handleCardClick = async (role) => {
    setSelectedRole(role);
    await fetchUsersByRole(role.id);
    setDialogOpen(true);
  };

  // Preparar datos para el gráfico circular
  const chartData = {
    labels: roles.map((role) => role.label),
    datasets: [
      {
        data: roles.map((role) => role.userCount),
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
        <h1 className="text-2xl font-bold">{t("roles.management")}</h1>
      </div>

      {/* Mostrar Skeleton mientras se cargan los roles */}
      {loadingRoles ? (
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
            {roles.map((role) => (
              <Card
                key={role.id}
                className={clsx(
                  "p-4 rounded-lg shadow cursor-pointer transition-transform transform hover:scale-105 hover:bg-olive-200",
                  isDarkMode
                    ? "bg-dark-700 text-dark-50"
                    : "bg-olive-100 text-olive-800"
                )}
                onClick={() => handleCardClick(role)}
              >
                <h2 className="text-xl font-semibold">{role.label}</h2>
                <p className="text-3xl font-bold">{role.userCount}</p>
           
              </Card>
            ))}
          </div>

          {/* Gráfico circular */}
          <div className="mt-20 flex justify-center h-100">
            <div className="w-full max-w-sm">
              <Pie
                data={chartData}
                options={{
                  responsive: true, // Hacer el gráfico responsivo
                  maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
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

      {/* Dialog para mostrar usuarios del rol seleccionado */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={clsx(
            "max-h-[50vh] overflow-y-auto",
            isDarkMode
              ? "bg-dark-700 text-dark-50"
              : "bg-olive-50 text-olive-800"
          )}
        >
          <DialogHeader>
            <DialogTitle>
              {t("roles.usersWithRole", { role: selectedRole?.label })}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            {loadingUsers ? (
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
                      {t("userProfile.username")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className={clsx(
                          "border-b transition-colors",
                          isDarkMode
                            ? "hover:bg-dark-700"
                            : "hover:bg-olive-100"
                        )}
                      >
                        <td className="p-3">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="p-3">{user.username}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-3 text-center">
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

export default Roles;
