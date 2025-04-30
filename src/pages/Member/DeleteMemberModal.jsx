import { deleteMember } from "@services/memberRequests";
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
 * Modal para eliminar un socio.
 * Muestra una confirmación antes de eliminar al socio seleccionado.
 * Llama a la API para eliminar al socio y actualiza la lista tras la operación.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Indica si el modal está abierto.
 * @param {Function} props.setOpen - Función para abrir/cerrar el modal.
 * @param {boolean} props.isDarkMode - Indica si se está utilizando el modo oscuro.
 * @param {Function} props.updateMembers - Función para actualizar la lista de socios tras eliminar uno.
 * @param {Object} props.selectedMember - Datos del socio seleccionado para eliminar.
 *
 * @returns {JSX.Element} Modal para confirmar la eliminación de un socio.
 */
const DeleteMemberModal = ({
  open,
  setOpen,
  isDarkMode,
  updateMembers,
  selectedMember,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  /**
   * Función para manejar la eliminación del socio seleccionado.
   * Realiza la llamada a la API para eliminar el socio y muestra una notificación.
   * Si la eliminación es exitosa, se cierra el modal y se actualiza la lista de socios.
   *
   * @async
   * @function handleDelete
   * @returns {void}
   */
  const handleDelete = async () => {
    try {
      const result = await deleteMember(selectedMember.user.id);

      if (result.status === "success") {
        success({
          title: t("users.successDeleteTitle"), // Traducción para "Usuario eliminado"
          text: t("users.successDeleteText"), // Traducción para "El usuario ha sido eliminado correctamente."
          delay: 2000,
        });
        setOpen(false); // Cierra el modal

        // Llama a la función de actualización para la lista
        if (updateMembers) {
          updateMembers();
        }
      } else {
        error({
          title: t("users.errorDeleteTitle"), // Traducción para "Error al eliminar usuario"
          text: result.message,
          delay: 2000,
        });
      }
    } catch (err) {
      error({
        title: t("common.error"), // Traducción para "Error"
        text: t("users.errorDeleteText"), // Traducción para "Hubo un problema al eliminar el usuario."
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
            {selectedMember
              ? t("members.deleteMemberTitle", {
                  username: selectedMember.user.username,
                  firstName: selectedMember.user.first_name,
                  lastName: selectedMember.user.last_name,
                }) // Traducción para "Eliminar socio {{username}} ({{firstName}} {{lastName}})"
              : t("users.loadingUser")} {/* Traducción para "Cargando usuario..." */}
          </DialogTitle>
          <DialogDescription>
            {selectedMember
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
              {t("common.cancel")} {/* Traducción para "Cancelar" */}
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className={clsx(
              "py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer bg-red-700 text-white hover:bg-red-500"
            )}
          >
            {t("users.delete")} {/* Traducción para "Eliminar" */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberModal;