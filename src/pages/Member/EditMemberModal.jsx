import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateMember } from "@services/memberRequests";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

//Definir el esquema de validación con Zod
const userSchema = z.object({
  user: z.object({
    dni: z.string().regex(/^\d{8}[A-Za-z]$/, {
      message: "El DNI debe tener 8 números seguidos de una letra",
    }),
  }),
});

/**
 * Modal para editar los datos de un socio.
 * Muestra un formulario prellenado con los datos del socio seleccionado y permite editarlos.
 * Incluye campos como nombre, apellidos, email, DNI, teléfono y estado.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Indica si el modal está abierto.
 * @param {Function} props.setOpen - Función para abrir/cerrar el modal.
 * @param {boolean} props.isDarkMode - Indica si se está utilizando el modo oscuro.
 * @param {Function} props.updateMembers - Función para actualizar la lista de socios después de editar.
 * @param {Object} props.selectedMember - Datos del socio seleccionado para editar.
 *
 * @returns {JSX.Element} Modal con formulario para editar un socio.
 */
const EditMemberModal = ({
  open,
  setOpen,
  isDarkMode,
  updateMembers,
  selectedMember,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: selectedMember,
    mode: "all",
  });

  useEffect(() => {
    if (selectedMember) {
      reset(selectedMember); 
    }
  }, [selectedMember, reset]);

  const handleEdit = async (data) => {
    const result = await updateMember(selectedMember.id, data);

    if (result.status === "success") {
      success({
        title: t("users.successEditTitle"),
        text: t("users.successEditText"),
        delay: 2000,
      });
      reset();
      setOpen(false);

      if (updateMembers) {
        updateMembers();
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
            {selectedMember
              ? t("members.editMemberTitle", {
                  username: selectedMember.user.username,
                  firstName: selectedMember.user.first_name,
                  lastName: selectedMember.user.last_name,
                })
              : t("users.loadingUser")}
          </DialogTitle>
          <DialogDescription>
            {selectedMember
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de edición de usuario */}
        {!selectedMember ? (
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
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
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
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div name="last_name">
              <Label className="mb-1">{t("userProfile.lastName")}</Label>{" "}
              {/* Traducción para "Apellidos" */}
              <Input
                type="text"
                {...register("user.last_name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div name="dni">
              <Label className="mb-1">{t("userProfile.dni")}</Label>{" "}
              {/* Traducción para "DNI" */}
              <Input
                type="text"
                {...register("user.dni")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.dni && (
                <p className="text-red-500 text-sm">{errors.dni.message}</p>
              )}
            </div>

            <div name="email">
              <Label className="mb-1">{t("userProfile.email")}</Label>{" "}
              {/* Traducción para "Email" */}
              <Input
                type="email"
                {...register("user.email")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div name="phone">
              <Label className="mb-1">{t("userProfile.phone")}</Label>{" "}
              {/* Traducción para "Teléfono" */}
              <Input
                type="text"
                {...register("user.phone")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div name="member_number">
              <Label className="mb-1">{t("members.memberNumber")}</Label>{" "}
              {/* Traducción para "Número de socio" */}
              <Input
                type="text"
                {...register("member_number")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">
                  {errors.member_number.message}
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
                {isSubmitting ? t("users.editing") : t("members.editMember")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModal;
