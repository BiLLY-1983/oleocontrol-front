import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import { updateOil } from "@services/oilRequests";

// Esquema de validación
const oilSchema = z.object({
  name: z
    .string()
    .max(255, "Máximo 255 caracteres")
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, "Máximo 500 caracteres")
    .nullable()
    .or(z.literal("")),
  price: z.coerce
    .number({
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "Debe ser mayor o igual a 0")
    .nullable(),
});

const EditOilModal = ({
  open,
  setOpen,
  isDarkMode,
  selectedOil,
  updateOils,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(oilSchema),
    mode: "all",
    defaultValues: selectedOil,
  });

  useEffect(() => {
    if (selectedOil) {
      reset(selectedOil);
    }
  }, [selectedOil, reset]);

  const handleEdit = async (data) => {
    const result = await updateOil(selectedOil.id, data);

    if (result?.status === "success") {
      success({
        title: t("oils.editSuccessTitle"),
        text:
          t("oils.editSuccessText"),
        delay: 2000,
      });
      reset();
      setOpen(false);
      updateOils?.();
    } else {
      error({
        title: t("oils.editErrorTitle"),
        text: result?.message,
        delay: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx("overflow-y-auto",
          isDarkMode
            ? "accent-dark-400 bg-dark-700 border-dark-600 text-dark-50"
            : "accent-olive-600 bg-olive-50 border-gray-300 text-olive-800"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedOil
              ? t("oils.editTitle", { name: selectedOil.name })
              : t("oils.loading")}
          </DialogTitle>
          <DialogDescription>
            {t("oils.editDescription")}
          </DialogDescription>
        </DialogHeader>

        {!selectedOil ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div>
              <Label className="mb-1">{t("oils.name")}</Label>
              <Input type="text" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-1">
                {t("oils.description")}
              </Label>
              <Input type="text" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1">{t("oils.price")}</Label>
              <Input type="number" step="0.01" {...register("price")} />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">
                  {t("common.cancel") || "Cancelar"}
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
                  ? t("oils.editing")
                  : t("oils.edit")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditOilModal;
