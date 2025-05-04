import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateEntry } from "@services/entryRequests";
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

// Validación con Zod
const entrySchema = z.object({
  olive_quantity: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1, { message: "Debe ser mayor que 0" }),
});

/**
 * Modal para editar una entrada de aceite en el sistema.
 * Permite actualizar la cantidad de aceitunas registradas en una entrada.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Estado para controlar la visibilidad del modal.
 * @param {Function} props.setOpen - Función para cambiar el estado de visibilidad del modal.
 * @param {boolean} props.isDarkMode - Determina si el modo oscuro está habilitado.
 * @param {Function} props.updateEntries - Función para actualizar la lista de entradas después de la edición.
 * @param {Object|null} props.selectedEntry - Datos de la entrada seleccionada para editar, o null si aún no está cargada.
 *
 * @returns {JSX.Element} El modal para editar la entrada.
 */
const EditEntryModal = ({
  open,
  setOpen,
  isDarkMode,
  updateEntries,
  selectedEntry,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: selectedEntry,
    mode: "all",
  });

  useEffect(() => {
    if (selectedEntry) {
      reset(selectedEntry);
    }
  }, [selectedEntry, reset]);

  const handleEdit = async (data) => {
    const result = await updateEntry(selectedEntry.id, data);

    if (result.status === "success") {
      success({
        title: t("entries.successEditTitle"),
        text: t("entries.successEditText"),
        delay: 2000,
      });
      reset();
      setOpen(false);

      if (updateEntries) {
        updateEntries();
      }
    } else {
      error({
        title: t("entries.errorEditTitle"),
        text: result.message,
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
            {selectedEntry ? t("entries.editEntry") : t("entries.loadingEntry")}{" "}
          </DialogTitle>
          <DialogDescription>
            {selectedEntry
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de edición de usuario */}
        {!selectedEntry ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div>
              <Label className="mb-1">{t("entries.oliveQuantity")}</Label>
              <Input
                type="number"
                step="0.01"
                {...register("olive_quantity", { valueAsNumber: true })}
              />
              {errors.olive_quantity && (
                <p className="text-red-500 text-sm">
                  {errors.olive_quantity.message}
                </p>
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
                {isSubmitting ? t("users.editing") : t("entries.editEntry")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryModal;
