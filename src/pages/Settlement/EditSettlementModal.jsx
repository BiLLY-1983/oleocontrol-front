import { useForm } from "react-hook-form";
import { useEffect, useContext, useState } from "react";
import { updateSettlement } from "@services/settlementRequests";
import { UserContext } from "@context/UserContext";
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
const settlementSchema = z.object({
  settlement_status: z.enum(["Aceptada", "Cancelada"], {
    message: "El estado de la liquidación debe ser 'Aceptada' o 'Cancelada'",
  }),
});

const EditSettlementModal = ({
  open,
  setOpen,
  isDarkMode,
  updateSettlements,
  selectedSettlement,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  const { userData } = useContext(UserContext);
  const employeeId = userData?.user?.employee?.id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(settlementSchema),
    mode: "all",
    defaultValues: {
      employee_id: employeeId,
      settlement_date_res: new Date().toISOString().split("T")[0],
    },
  });
  
  useEffect(() => {
    if (selectedSettlement) {
      reset(selectedSettlement);
    }
  }, [selectedSettlement, reset]);

  const handleEdit = async (data) => {
    data.employee_id = employeeId;
    data.settlement_date_res = new Date().toISOString().split("T")[0];
    const result = await updateSettlement(selectedSettlement.id, data);

    if (result.status === "success") {
      success({
        title: t("settlements.successEditTitle"),
        text: t("settlements.successEditText"),
        delay: 2000,
      });
      reset(); // Limpiar formulario
      setOpen(false); // Cerrar modal

      // Llama a la función de actualización para la lista
      if (updateSettlements) {
        updateSettlements();
      }
    } else {
      error({
        title: t("settlements.errorEditTitle"),
        text: result.message,
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
            {selectedSettlement
              ? t("settlements.editSettlement")
              : t("settlements.loadingSettlement")}{" "}
            {/* Traducción para "Cargando usuario..." */}
          </DialogTitle>
          <DialogDescription>
            {selectedSettlement
              ? t("users.editUserDescription")
              : t("users.loadingUserDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de edición de usuario */}
        {!selectedSettlement ? (
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
              <Label className="mb-1">Estado de la liquidación</Label>
              <select
                {...register("settlement_status")}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione estado de la liquidación</option>
                <option value={"Aceptada"}>
                  Aceptada
                </option>
                <option value={"Cancelada"}>
                  Cancelada
                </option>
              </select>
              {errors.settlement_status && (
                <p className="text-red-500 text-sm">{errors.settlement_status.message}</p>
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
                {isSubmitting ? t("users.editing") : t("settlements.editSettlement")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditSettlementModal;
