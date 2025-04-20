import { useForm } from "react-hook-form";
import { createOil } from "@services/oilRequests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog";
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

const NewOilModal = ({ open, setOpen, isDarkMode, updateOils }) => {
  const { t } = useTranslation();

  const oilSchema = z.object({
    name: z
      .string()
      .min(1, { message: t("validation.nameRequired") })
      .max(255, { message: t("validation.nameMax") }),
    description: z
      .string()
      .max(500, { message: t("validation.descriptionMax") })
      .optional(),
    price: z
      .number({ invalid_type_error: t("validation.priceInvalid") })
      .min(0, { message: t("validation.priceMin") }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(oilSchema),
    mode: "all",
  });

  const handleCreate = async (data) => {
    try {
      const result = await createOil(data);

      if (result.status !== "success") {
        throw new Error(result.message || t("oils.newErrorTitle"));
      }

      success({
        title: t("oils.newSuccessTitle"),
        text: t("oils.newSuccessText"),
        delay: 2000,
      });

      reset();
      setOpen(false);
      if (updateOils) updateOils();
    } catch (err) {
      error({
        title: t("oils.newErrorTitle"),
        text: err.message,
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
          <DialogTitle>{t("oils.newTitle")}</DialogTitle>
          <DialogDescription>{t("oils.newDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <Label className="mb-1">{t("oils.name")}</Label>
            <Input type="text" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1">{t("oils.description")}</Label>
            <Input type="text" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1">{t("oils.price")}</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", {
                setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
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
              {isSubmitting ? t("oils.loading") : t("oils.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOilModal;
