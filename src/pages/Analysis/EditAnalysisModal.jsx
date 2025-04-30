import { useForm } from "react-hook-form";
import { UserContext } from "@context/UserContext";
import { useEffect, useContext, useState } from "react";
import { updateAnalysis } from "@services/analysisRequests";
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
const analysisSchema = z.object({
  analysis_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  humidity: z.number().min(0, { message: "La humedad no puede ser negativa" }),
  acidity: z.number().min(0, { message: "La acidez no puede ser negativa" }),
  yield: z.number().min(0, { message: "El rendimiento no puede ser negativo" }),
});

const calculateOilId = (acidity) => {
  if (acidity <= 0.8) return 1; // Virgen Extra
  if (acidity <= 2) return 2; // Virgen
  return 3; // Lampante
};

/**
 * Modal para editar un análisis de aceituna.
 *
 * @page
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.open - Indica si el modal está abierto.
 * @param {Function} props.setOpen - Función para cambiar el estado del modal.
 * @param {boolean} props.isDarkMode - Indica si el tema oscuro está activado.
 * @param {Function} props.updateAnalyses - Función para actualizar la lista de análisis.
 * @param {Object} props.selectedAnalysis - Análisis seleccionado para editar.
 * @returns {JSX.Element} Modal de edición.
 */
const EditAnalysisModal = ({
  open,
  setOpen,
  isDarkMode,
  updateAnalyses,
  selectedAnalysis,
}) => {
  const { userData } = useContext(UserContext);
  const employeeId = userData?.user?.employee?.id;

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      ...selectedAnalysis,
      analysis_date:
        selectedAnalysis?.analysis_date ??
        new Date().toISOString().split("T")[0],
    },
    mode: "all",
  });

  useEffect(() => {
    if (selectedAnalysis) {
      reset({
        ...selectedAnalysis,
        analysis_date:
          selectedAnalysis.analysis_date ??
          new Date().toISOString().split("T")[0],
      });
    }
  }, [selectedAnalysis, reset]);

  const handleEdit = async (data) => {
    const oilType = calculateOilId(data.acidity);
    const oilQuantity =
      (selectedAnalysis.entry?.olive_quantity * data.yield) / 100;

    const payload = {
      ...data,
      employee_id: employeeId,
      oil_id: oilType,
      oil_quantity: oilQuantity,
    };

    const result = await updateAnalysis(selectedAnalysis.id, payload);

    if (result.status === "success") {
      success({
        title: t("analyses.successEditTitle"),
        text: t("analyses.successEditText"),
        delay: 2000,
      });
      reset();
      setOpen(false);
      updateAnalyses?.();
    } else {
      error({
        title: t("analyses.errorEditTitle"),
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
            {selectedAnalysis
              ? t("analyses.editAnalysis")
              : t("analyses.editAnalysis")}
          </DialogTitle>
          <DialogDescription>
            {selectedAnalysis
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        {!selectedAnalysis ? (
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
              <Label htmlFor="analysis_date" className="mb-1">
                Fecha de análisis
              </Label>
              <Input
                id="analysis_date"
                type="date"
                {...register("analysis_date")}
              />
              {errors.analysis_date && (
                <span className="text-red-500">
                  {errors.analysis_date.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="humidity" className="mb-1">
                Humedad (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                step="0.01"
                {...register("humidity", { valueAsNumber: true })}
              />
              {errors.humidity && (
                <span className="text-red-500">{errors.humidity.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="acidity" className="mb-1">
                Acidez (%)
              </Label>
              <Input
                id="acidity"
                type="number"
                step="0.01"
                {...register("acidity", { valueAsNumber: true })}
              />
              {errors.acidity && (
                <span className="text-red-500">{errors.acidity.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="yield" className="mb-1">
                Rendimiento (%)
              </Label>
              <Input
                id="yield"
                type="number"
                step="0.01"
                {...register("yield", { valueAsNumber: true })}
              />
              {errors.yield && (
                <span className="text-red-500">{errors.yield.message}</span>
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
                {isSubmitting ? t("users.editing") : t("analyses.editAnalysis")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAnalysisModal;
