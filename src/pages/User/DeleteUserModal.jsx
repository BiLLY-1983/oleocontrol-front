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
 * Componente de modal para eliminar un usuario.
 * Este componente permite al usuario confirmar la eliminación de un usuario seleccionado.
 * Al confirmar, se realiza una solicitud para eliminar el usuario y se muestra un mensaje de éxito o error.
 * 
 * @component
 * 
 * @param {boolean} open - Estado que indica si el modal está abierto o cerrado.
 * @param {function} setOpen - Función para cambiar el estado del modal.
 * @param {boolean} isDarkMode - Estado que indica si el modo oscuro está activado.
 * @param {function} updateUsuarios - Función para actualizar la lista de usuarios después de eliminar uno.
 * @param {object} usuarioSeleccionado - Objeto que contiene la información del usuario seleccionado para eliminar.
 * 
 * @returns {JSX.Element} - Un modal que permite al usuario confirmar la eliminación de un usuario.
 */
const DeleteUserModal = ({
  open,
  setOpen,
  isDarkMode,
  updateUsuarios,
  usuarioSeleccionado,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  /**
   * Función que maneja la eliminación del usuario seleccionado.
   * Realiza una solicitud para eliminar el usuario y muestra un mensaje de éxito o error.
   * 
   * @async
   * @function handleDelete
   */
  const handleDelete = async () => {
    try {
      const result = await deleteUser(usuarioSeleccionado.id);

      if (result.status === "success") {
        success({
          title: t("users.successDeleteTitle"), // Traducción para "Usuario eliminado"
          text: t("users.successDeleteText"), // Traducción para "El usuario ha sido eliminado correctamente."
          delay: 2000,
        });
        setOpen(false); // Cierra el modal

        // Llama a la función de actualización para la lista
        if (updateUsuarios) {
          updateUsuarios();
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
            {usuarioSeleccionado
              ? t("users.deleteUserTitle", {
                  username: usuarioSeleccionado.username,
                  firstName: usuarioSeleccionado.first_name,
                  lastName: usuarioSeleccionado.last_name,
                }) // Traducción para "Eliminar usuario {{username}} ({{firstName}} {{lastName}})"
              : t("users.loadingUser")} {/* Traducción para "Cargando usuario..." */}
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

export default DeleteUserModal;