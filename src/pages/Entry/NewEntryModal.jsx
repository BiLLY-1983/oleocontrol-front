import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { createEntry } from "@services/entryRequests";
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
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

// Validación con Zod
const entrySchema = z.object({
  entry_date: z.string().min(1, { message: "La fecha es obligatoria" }),
  olive_quantity: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1, { message: "Debe ser mayor que 0" }),
  member_id: z.number().min(1, { message: "Debe seleccionar un socio" }),
});

const NewEntryModal = ({ open, setOpen, isDarkMode, updateEntries }) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);

  const [query, setQuery] = useState("");

  // Filtrar miembros según el input
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
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(entrySchema),
    mode: "all",
    defaultValues: {
      entry_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await getMembers();
      if (res.status === "success") setMembers(res.data);
    };
    fetchMembers();
  }, []);

  const handleCreate = async (data) => {
    try {
      data.analysis_status = "Pendiente";

      const res = await createEntry(data);
      if (res.status !== "success") {
        throw new Error(res.message || t("entries.errorTitle"));
      }

      success({
        title: t("entries.successTitle"),
        text: t("entries.successText"),
        delay: 2000,
      });

      reset();
      setOpen(false);
      if (updateEntries) updateEntries();
    } catch (err) {
      error({
        title: t("entries.errorTitle"),
        text: err.message,
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
          <DialogTitle>{t("entries.newEntry")}</DialogTitle>
          <DialogDescription>
            {t("entries.allFieldsRequired")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <Label className="mb-1">{t("entries.entryDate")}</Label>
            <Input type="date" {...register("entry_date")} />
            {errors.entry_date && (
              <p className="text-red-500 text-sm">
                {errors.entry_date.message}
              </p>
            )}
          </div>

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
              {isSubmitting ? t("users.creating") : t("entries.createEntry")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryModal;
