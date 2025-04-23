import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { updateEmployee } from "@services/employeeRequests";
import { getDepartments } from "@services/departmentRequests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

/**
 * Componente modal para editar los datos de un empleado.
 *
 * Este modal muestra un formulario prellenado con los datos del empleado seleccionado y permite editarlos.
 * Incluye campos como nombre, apellidos, usuario, email, teléfono, departamento y estado.
 * Utiliza `react-hook-form` para la gestión del formulario y validaciones.
 * Muestra esqueleto de carga mientras los datos del empleado no están disponibles.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Indica si el modal está abierto.
 * @param {Function} props.setOpen - Función para abrir/cerrar el modal.
 * @param {boolean} props.isDarkMode - Indica si se está utilizando el modo oscuro.
 * @param {Function} props.updateEmployees - Función para actualizar la lista de empleados después de editar.
 * @param {Object} props.selectedEmployee - Datos del empleado seleccionado para editar.
 *
 * @returns {JSX.Element} El modal con el formulario para editar un empleado.
 *
 * @example
 * <EditEmployeeModal
 *   open={modalOpen}
 *   setOpen={setModalOpen}
 *   isDarkMode={true}
 *   updateEmployees={loadEmployees}
 *   selectedEmployee={employeeData}
 * />
 */
const EditEmployeeModal = ({
  open,
  setOpen,
  isDarkMode,
  updateEmployees,
  selectedEmployee,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: selectedEmployee,
    mode: "all",
  });

  /**
   * useEffect para obtener los departamentos al montar el componente
   */
  useEffect(() => {
    const fetchDepartments = async () => {
      const result = await getDepartments();
      if (result.status === "success") {
        setDepartments(result.data);
      }
    };
    fetchDepartments();
  }, []);

  /**
   * useEffect para actualizar los valores del formulario cuando empleado cambie
   * */
  useEffect(() => {
    if (selectedEmployee) {
      reset(selectedEmployee); // Actualiza los valores del formulario
    }
  }, [selectedEmployee, reset]);

  /**
   * Maneja el envío del formulario de edición de empleado
   *
   * @async
   * @function
   * @param {Object} data - Datos del formulario validados
   */
  const handleEdit = async (data) => {
    const result = await updateEmployee(selectedEmployee.id, data);

    if (result.status === "success") {
      success({
        title: t("users.successEditTitle"), // Traducción para "Usuario actualizado con éxito"
        text: t("users.successEditText"), // Traducción para "El usuario ha sido actualizado correctamente."
        delay: 2000,
      });
      reset(); // Limpiar formulario
      setOpen(false); // Cerrar modal

      // Llama a la función de actualización para la lista
      if (updateEmployees) {
        updateEmployees();
      }
    } else {
      error({
        title: t("users.errorEditTitle"),
        text: t("users.errorEditText"),
        delay: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx(
          "max-h-[50vh] overflow-y-auto",
          isDarkMode
            ? "accent-dark-400 bg-dark-700 border-dark-600 text-dark-50"
            : "accent-olive-600 bg-olive-50 border-gray-300 text-olive-800"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedEmployee
              ? t("employees.editEmployeeTitle", {
                  username: selectedEmployee.user.username,
                  firstName: selectedEmployee.user.first_name,
                  lastName: selectedEmployee.user.last_name,
                })
              : t("users.loadingUser")}
          </DialogTitle>
          <DialogDescription>
            {selectedEmployee
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de edición de usuario */}
        {!selectedEmployee ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div name="username">
              <Label className="mb-1">{t("userProfile.username")}</Label>
              <Input
                type="text"
                {...register("user.username")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.username && (
                <p className="text-red-500 text-sm">
                  {errors.user.username.message}
                </p>
              )}
            </div>

            <div name="first_name">
              <Label className="mb-1">{t("userProfile.firstName")}</Label>
              <Input
                type="text"
                {...register("user.first_name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.user.first_name.message}
                </p>
              )}
            </div>

            <div name="last_name">
              <Label className="mb-1">{t("userProfile.lastName")}</Label>
              <Input
                type="text"
                {...register("user.last_name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.user.last_name.message}
                </p>
              )}
            </div>

            <div name="dni">
              <Label className="mb-1">{t("userProfile.dni")}</Label>
              <Input
                type="text"
                {...register("user.dni")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.dni && (
                <p className="text-red-500 text-sm">
                  {errors.user.dni.message}
                </p>
              )}
            </div>

            <div name="email">
              <Label className="mb-1">{t("userProfile.email")}</Label>
              <Input
                type="email"
                {...register("user.email")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.email && (
                <p className="text-red-500 text-sm">
                  {errors.user.email.message}
                </p>
              )}
            </div>

            <div name="phone">
              <Label className="mb-1">{t("userProfile.phone")}</Label>
              <Input
                type="text"
                {...register("user.phone")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.user?.phone && (
                <p className="text-red-500 text-sm">
                  {errors.user.phone.message}
                </p>
              )}
            </div>

            <div name="department">
              <Label className="mb-1">{t("departments.management")}</Label>
              <select
                {...register("department.id")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">{t("common.select")}</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.department?.id && (
                <p className="text-red-500 text-sm">
                  {errors.department.id.message}
                </p>
              )}
            </div>

            <div name="status">
              <Label className="mb-1">{t("userProfile.status")}</Label>
              <Input
                type="checkbox"
                {...register("user.status")}
                className={clsx(
                  "w-4 h-4 rounded mt-2 focus:ring-2",
                  isDarkMode
                    ? "accent-dark-500 bg-dark-700 border-dark-600 focus:ring-dark-400"
                    : "accent-olive-600 bg-gray-100 border-gray-300 focus:ring-olive-500"
                )}
              />
              {errors.user?.status && (
                <p className="text-red-500 text-sm">
                  {errors.user.status.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer"
                >
                  {t("common.cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer",
                  isDarkMode
                    ? "bg-dark-600 text-dark-50 hover:bg-dark-500 focus:ring-dark-300"
                    : "bg-olive-500 text-white hover:bg-olive-600 focus:ring-olive-400"
                )}
              >
                {isSubmitting ? t("users.editing") : t("users.editUser")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
