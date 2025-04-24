import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateUser } from "@services/userRequests";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

// Definir el esquema de validación con Zod
const userSchema = z
  .object({
    username: z.string().max(255, { message: "Máximo 255 caracteres" }),
    first_name: z.string().max(255, { message: "Máximo 255 caracteres" }),
    last_name: z.string().max(255, { message: "Máximo 255 caracteres" }),
    dni: z
      .string()
      .regex(/^\d{8}[A-Za-z]$/, {
        message: "El DNI debe tener 8 números seguidos de una letra",
      }),
    email: z
      .string()
      .email({ message: "El email no es válido" })
      .max(255, { message: "Máximo 255 caracteres" }),
    phone: z.string().max(20, { message: "Máximo 20 caracteres" }),
  });

/**
 * Componente de modal para editar un usuario.
 * Este componente permite editar los detalles de un usuario seleccionado.
 * 
 * @component
 * 
 * @param {boolean} open - Estado que indica si el modal está abierto o cerrado.
 * @param {function} setOpen - Función para cambiar el estado del modal.
 * @param {boolean} isDarkMode - Estado que indica si el modo oscuro está activado.
 * @param {function} updateUsuarios - Función para actualizar la lista de usuarios.
 * @param {object} usuarioSeleccionado - Usuario seleccionado para editar.
 * 
 * @returns {JSX.Element} - El componente del modal de edición de usuario.
 */
const EditUserModal = ({
  open,
  setOpen,
  isDarkMode,
  updateUsuarios,
  usuarioSeleccionado,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  /**
   * useForm hook para manejar el formulario de edición de usuario.
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: usuarioSeleccionado,
    mode: "all",
  });

  /**
   * useEffect hook para actualizar el formulario cuando cambia el usuario seleccionado.
   * Si hay un usuario seleccionado, se actualizan los valores del formulario con los datos del usuario.
   * 
   * @param {object} usuarioSeleccionado - Usuario seleccionado para editar.
   * @param {function} reset - Función para restablecer los valores del formulario.
   */
  useEffect(() => {
    if (usuarioSeleccionado) {
      reset(usuarioSeleccionado); // Actualiza los valores del formulario
    }
  }, [usuarioSeleccionado, reset]);

  /**
   * Función para manejar la edición del usuario.
   * Se llama cuando se envía el formulario.
   * 
   * @param {object} data - Datos del formulario.
   * @returns {void} - Promesa que se resuelve cuando se completa la edición.
   * 
   * @async
   * @throws {Error} - Si ocurre un error al actualizar el usuario.
   */
  const handleEdit = async (data) => {
    const result = await updateUser(usuarioSeleccionado.id, data);

    if (result.status === "success") {
      success({
        title: t("users.successEditTitle"), // Traducción para "Usuario actualizado con éxito"
        text: t("users.successEditText"), // Traducción para "El usuario ha sido actualizado correctamente."
        delay: 2000,
      });
      reset(); // Limpiar formulario
      setOpen(false); // Cerrar modal

      // Llama a la función de actualización para la lista
      if (updateUsuarios) {
        updateUsuarios();
      }
    } else {
      error({
        title: t("users.errorEditTitle"), // Traducción para "Error al actualizar usuario"
        text: result.message,
        delay: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx("max-h-[50vh] overflow-y-auto",
          isDarkMode
            ? "accent-dark-400 bg-dark-700 border-dark-600 text-dark-50"
            : "accent-olive-600 bg-olive-50 border-gray-300 text-olive-800"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {usuarioSeleccionado
              ? t("users.editUserTitle", {
                  username: usuarioSeleccionado.username,
                  firstName: usuarioSeleccionado.first_name,
                  lastName: usuarioSeleccionado.last_name,
                }) // Traducción para "Editar usuario"
              : t("users.loadingUser")} {/* Traducción para "Cargando usuario..." */}
          </DialogTitle>
          <DialogDescription>
            {usuarioSeleccionado
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")} 
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de edición de usuario */}
        {!usuarioSeleccionado ? (
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
              <Label className="mb-1">{t("userProfile.username")}</Label> {/* Traducción para "Usuario" */}
              <Input
                type="text"
                {...register("username")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div name="first_name">
              <Label className="mb-1">{t("userProfile.firstName")}</Label> {/* Traducción para "Nombre" */}
              <Input
                type="text"
                {...register("first_name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div name="last_name">
              <Label className="mb-1">{t("userProfile.lastName")}</Label> {/* Traducción para "Apellidos" */}
              <Input
                type="text"
                {...register("last_name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div name="dni">
              <Label className="mb-1">{t("userProfile.dni")}</Label> {/* Traducción para "DNI" */}
              <Input
                type="text"
                {...register("dni")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.dni && (
                <p className="text-red-500 text-sm">{errors.dni.message}</p>
              )}
            </div>

            <div name="email">
              <Label className="mb-1">{t("userProfile.email")}</Label> {/* Traducción para "Email" */}
              <Input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div name="phone">
              <Label className="mb-1">{t("userProfile.phone")}</Label> {/* Traducción para "Teléfono" */}
              <Input
                type="text"
                {...register("phone")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div name="status">
              <Label className="mb-1">{t("userProfile.status")}</Label>
              <Input
                type="checkbox"
                {...register("status")}
                className={clsx(
                  "w-4 h-4 rounded mt-2 focus:ring-2",
                  isDarkMode
                    ? "accent-dark-500 bg-dark-700 border-dark-600 focus:ring-dark-400"
                    : "accent-olive-600 bg-gray-100 border-gray-300 focus:ring-olive-500"
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer"
                >
                  {t("common.cancel")} {/* Traducción para "Cancelar" */}
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
                {isSubmitting
                  ? t("users.editing") 
                  : t("users.editUser")} 
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;