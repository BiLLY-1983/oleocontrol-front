import { deleteUser } from "@services/userRequests";
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
 * Modal para eliminar un usuario.
 * 
 * Permite confirmar y eliminar un usuario seleccionado del sistema.
 *
 * @component
 * @param {boolean} open - Indica si el modal está abierto.
 * @param {Function} setOpen - Función para cambiar el estado del modal.
 * @param {boolean} isDarkMode - Indica si el modo oscuro está activado.
 * @param {Function} updateUsuarios - Función para actualizar la lista de usuarios tras la eliminación.
 * @param {Object} usuarioSeleccionado - Datos del usuario seleccionado para eliminar.
 * @returns {JSX.Element} Modal para eliminar un usuario.
 */
const DeleteUserModal = ({
  open,
  setOpen,
  isDarkMode,
  updateUsuarios,
  usuarioSeleccionado,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  const handleDelete = async () => {
    try {
      const result = await deleteUser(usuarioSeleccionado.id);

      if (result.status === "success") {
        success({
          title: t("users.successDeleteTitle"), 
          text: t("users.successDeleteText"), 
          delay: 2000,
        });
        setOpen(false); 

        if (updateUsuarios) {
          updateUsuarios();
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
            {usuarioSeleccionado
              ? t("users.deleteUserTitle", {
                  username: usuarioSeleccionado.username,
                  firstName: usuarioSeleccionado.first_name,
                  lastName: usuarioSeleccionado.last_name,
                }) 
              : t("users.loadingUser")}
          </DialogTitle>
          <DialogDescription>
            {usuarioSeleccionado
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

export default DeleteUserModal;