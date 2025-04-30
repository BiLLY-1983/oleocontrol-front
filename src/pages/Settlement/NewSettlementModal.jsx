import { useEffect, useState, useContext, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { Combobox, Transition } from "@headlessui/react";
import { UserContext } from "@context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { getOils } from "@services/oilRequests";
import { getMembers } from "@services/memberRequests";
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
import {
  getSettlements,
  createSettlement,
  createSettlementAvailable,
} from "@services/settlementRequests";

// Schema
const settlementSchema = z.object({
  settlement_date: z.string().min(1, "La fecha es obligatoria"),
  amount: z.number().min(0, "Debe ser mayor o igual a 0"),
  price: z.number().min(0, "Debe ser mayor o igual a 0").optional(),
  settlement_status: z.enum(["Pendiente", "Aceptada", "Cancelada"]),
  oil_id: z.string().min(1, "Debe seleccionar un tipo de aceite"),
  member_id: z.number().min(1, "Debe seleccionar un socio"),
});

/**
 * Modal para crear una nueva liquidación.
 * 
 * Permite a los administradores o empleados ingresar los detalles de una nueva liquidación,
 * como cantidad, precio, tipo de aceite y socio asociado.
 *
 * @component
 * @param {boolean} open - Indica si el modal está abierto.
 * @param {Function} setOpen - Función para cambiar el estado del modal.
 * @param {boolean} isDarkMode - Indica si el modo oscuro está activado.
 * @param {Function} updateSettlements - Función para actualizar la lista de liquidaciones.
 * @returns {JSX.Element} Modal para crear una nueva liquidación.
 */
const NewSettlementModal = ({
  open,
  setOpen,
  isDarkMode,
  updateSettlements,
}) => {
  const { t } = useTranslation();
  const { userData } = useContext(UserContext);
  const [employees, setEmployees] = useState([]);
  const [oils, setOils] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [errorMember, setErrorMember] = useState(true);
  const [errorOils, setErrorOils] = useState(true);
  const [loadingMember, setLoadingMember] = useState(true);
  const [loadingOils, setLoadingOils] = useState(true);
  const [query, setQuery] = useState("");
  const [queryEmployee, setQueryEmployee] = useState("");
  const [members, setMembers] = useState([]);

  const filteredMembers =
    query === ""
      ? members
      : members.filter((member) => {
          const fullName =
            `${member.user?.first_name} ${member.user?.last_name}`.toLowerCase();
          return fullName.includes(query.toLowerCase());
        });

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
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await getMembers();
      if (res.status === "success") setMembers(res.data);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchOils();
    fetchSettlements();
  }, []);

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
    const response = await getSettlements();
    if (response.status === "success") {
      return response.data;
    }
    return [];
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleCreate = async (data) => {
    try {
      const response = await getSettlements();
      const currentSettlements = response.data;

      const alreadyExists = currentSettlements.some(
        (s) =>
          s.settlement_status === "Pendiente" &&
          Number(s.member.member_id) === Number(data.member_id) &&
          Number(s.oil.oil_id) === Number(data.oil_id)
      );

      if (alreadyExists) {
        error({
          title: "Ya existe una liquidación pendiente para este socio",
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
        className={clsx(
          "max-h-[50vh] overflow-y-auto",
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

          <div>
            <Label className="mb-1">{t("entries.member")}</Label>
            <Controller
              control={control}
              name="member_id"
              render={({ field }) => (
                <Combobox
                  value={members.find((m) => m.id === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.id)}
                >
                  <div className="relative mt-1">
                    <div className="relative w-full rounded-md bg-white text-left border">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm"
                        displayValue={(m) =>
                          m
                            ? `(${m.member_number}) ${m.user?.first_name} ${m.user?.last_name}`
                            : ""
                        }
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        ▼
                      </Combobox.Button>
                    </div>
                    <Transition as={Fragment}>
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg">
                        {filteredMembers.length === 0 ? (
                          <div className="px-4 py-2 text-gray-700">
                            Sin resultados
                          </div>
                        ) : (
                          filteredMembers.map((member) => (
                            <Combobox.Option
                              key={member.id}
                              value={member}
                              className={({ active }) =>
                                `cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-olive-100 text-olive-900"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  ({member.member_number}){" "}
                                  {member.user?.first_name}{" "}
                                  {member.user?.last_name}
                                </span>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              )}
            />
            {errors.member_id && (
              <p className="text-red-500 text-sm">{errors.member_id.message}</p>
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

export default NewSettlementModal;
