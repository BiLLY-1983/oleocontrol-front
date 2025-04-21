import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "@context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { getOils } from "@services/oilRequests";
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

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import { createSettlementAvailable } from "@services/settlementRequests";
import { getSettlementsByMember } from "@services/settlementRequests";

// Schema
const settlementSchema = z.object({
  settlement_date: z.string().min(1, "La fecha es obligatoria"),
  amount: z.number().min(0, "Debe ser mayor o igual a 0"),
  price: z.number().min(0, "Debe ser mayor o igual a 0").optional(),
  settlement_status: z.enum(["Pendiente", "Aceptada", "Cancelada"]),
  oil_id: z.string().min(1, "Debe seleccionar un tipo de aceite"),
});

const NewSettlementAvailableModal = ({
  memberId,
  open,
  setOpen,
  isDarkMode,
  updateSettlements,
}) => {
  const { t } = useTranslation();
  const [oils, setOils] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [errorSettlement, setErrorerrorSettlement] = useState(true);
  const [errorOils, setErrorOils] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settlementSchema),
    mode: "all",
    defaultValues: {
      settlement_date: new Date().toISOString().split("T")[0],
      settlement_status: "Pendiente",
      member_id: memberId,
    },
  });

  const fetchOils = async () => {
    setLoadingOils(true);
    try {
      const response = await getOils();
      if (response.status === "success") {
        setOils(response.data);
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      setErrorOils("Error al cargar el socio.");
    } finally {
      setLoadingOils(false);
    }
  };

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const response = await getSettlementsByMember(memberId);
      if (response.status === "success") {
        setSettlements(response.data);
      } 
    } catch (error) {
      console.error("Error fetching settlements:", error);
      setErrorerrorSettlement("Error al cargar liquidaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOils();
    fetchSettlements();
  }, []);

  const handleCreate = async (data) => {
    try {
      data.member_id = memberId;

      const alreadyExists = settlements.some(
        (s) => s.settlement_status == "Pendiente" && s.oil?.oil_id == data.oil_id
      );

      if (alreadyExists) {
        error({
          title: "Ya existe una liquidación pendiente",
          text: "No puedes crear otra liquidación del mismo tipo de aceite hasta que se resuelva la anterior.",
          delay: 3000,
        });
        return;
      }

      const res = await createSettlementAvailable(data);
      if (res.status !== "success") throw new Error(res.message);

      success({ title: "Liquidación creada", delay: 2000 });
      reset();
      setOpen(false);
      if (updateSettlements) updateSettlements();
    } catch (err) {
      error({ title: "Error al crear", text: err.message, delay: 2000 });
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
          <DialogTitle>Nueva liquidación</DialogTitle>
          <DialogDescription>
            Todos los campos son obligatorios
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <Label className="mb-1">Cantidad de aceite (Kg)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1">Precio (€ por kg)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1">Tipo de aceite</Label>
            <select
              {...register("oil_id")}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un tipo de aceite</option>
              {oils.map((oil) => (
                <option key={oil.id} value={oil.id}>
                  {oil.name}
                </option>
              ))}
            </select>
            {errors.oil_id && (
              <p className="text-red-500 text-sm">{errors.oil_id.message}</p>
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
                ? t("users.creating")
                : t("settlements.createSettlement")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSettlementAvailableModal;
