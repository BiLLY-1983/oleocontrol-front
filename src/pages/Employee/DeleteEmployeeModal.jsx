import { deleteEmployee } from "@services/employeeRequests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

/**
 * Modal para eliminar un empleado.
 * Muestra una confirmación antes de eliminar al empleado seleccionado.
 * Llama a la API para eliminar al empleado y actualiza la lista tras la operación.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Indica si el modal está abierto.
 * @param {Function} props.setOpen - Función para abrir/cerrar el modal.
 * @param {boolean} props.isDarkMode - Indica si se está utilizando el modo oscuro.
 * @param {Function} props.updateEmployees - Función para actualizar la lista de empleados tras eliminar uno.
 * @param {Object} props.selectedEmployee - Datos del empleado seleccionado para eliminar.
 * @returns {JSX.Element} Modal para confirmar la eliminación de un empleado.
 */
const DeleteEmployeeModal = ({ open, setOpen, isDarkMode, updateEmployees, selectedEmployee }) => {
  const { t } = useTranslation(); // Hook para traducciones

  /**
   * Función para manejar la eliminación del empleado seleccionado.
   * Realiza la llamada a la API para eliminar el empleado y muestra una notificación.
   * Si la eliminación es exitosa, se cierra el modal y se actualiza la lista de empleados.
   *
   * @async
   * @function handleDelete
   * @returns {void}
   */
  const handleDelete = async () => {
    try {
      const result = await deleteEmployee(selectedEmployee.user.id);

      if (result.status === "success") {
        success({
          title: t("users.successDeleteTitle"),
          text: t("users.successDeleteText"),
          delay: 2000,
        });
        setOpen(false); // Cierra el modal

        // Llama a la función de actualización para la lista
        if (updateEmployees) {
          updateEmployees();
        }
      } else {
        error({
          title: t("users.errorDeleteTitle"),
          text: result.message,
          delay: 2000,
        });
      }
    } catch (err) {
      error({
        title: t("common.error"),
        text: t("users.errorDeleteText"),
        delay: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx(
          isDarkMode
            ? "accent-dark-400 bg-dark-700 border-dark-600 text-dark-50"
            : "accent-olive-600 bg-olive-50 border-gray-300 text-olive-800"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedEmployee
              ? t("employees.deleteEmployeeTitle", {
                  username: selectedEmployee.user.username,
                  firstName: selectedEmployee.user.first_name,
                  lastName: selectedEmployee.user.last_name,
                })
              : t("users.loadingUser")}
          </DialogTitle>
          <DialogDescription>
            {selectedEmployee
              ? t("users.deleteUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="py-2 font-semibold rounded-md cursor-pointer"
            >
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className={clsx(
              "py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer bg-red-700 text-white hover:bg-red-500"
            )}
          >
            {t("users.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeModal;
