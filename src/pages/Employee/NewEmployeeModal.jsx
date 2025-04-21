import { useForm } from "react-hook-form";
import { createEmployee } from "@services/employeeRequests";
import { getDepartments } from "@services/departmentRequests";
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
import { useState, useEffect } from "react";
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
    username: z
      .string()
      .min(1, { message: "El nombre de usuario es obligatorio" })
      .max(255, { message: "Máximo 255 caracteres" }),
    first_name: z
      .string()
      .min(1, { message: "El nombre es obligatorio" })
      .max(255, { message: "Máximo 255 caracteres" }),
    last_name: z
      .string()
      .min(1, { message: "Los apellidos son obligatorios" })
      .max(255, { message: "Máximo 255 caracteres" }),
    dni: z
      .string()
      .min(1, { message: "El DNI es obligatorio" })
      .max(20, { message: "Máximo 20 caracteres" }),
    email: z
      .string()
      .email({ message: "El email no es válido" })
      .min(1, { message: "El email es obligatorio" })
      .max(255, { message: "Máximo 255 caracteres" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    password_confirmation: z.string().min(8, {
      message: "La contraseña de confirmación debe tener al menos 8 caracteres",
    }),
    phone: z
      .string()
      .min(1, { message: "El teléfono es obligatorio" })
      .max(20, { message: "Máximo 20 caracteres" }),
    department_id: z
      .string()
      .min(1 , { message: "El departamento es obligatorio" })
      .refine((val) => val || true, {
        message: "El departamento es obligatorio",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        path: ["password_confirmation"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

const NewEmployeeModal = ({ open, setOpen, isDarkMode, updateEmployees }) => {
  const { t } = useTranslation(); // Hook para traducciones
  const [departments, setDepartments] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: "all",
  });

  // Obtener departamentos al cargar el modal
  useEffect(() => {
    const fetchDepartments = async () => {
      const result = await getDepartments();
      if (result.status === "success") {
        setDepartments(result.data);
      }
    };
    fetchDepartments();
  }, []);

  // Función para manejar el envío del formulario
  const handleCreate = async (data) => {
    try {
      data.status = true;

      // Enviar todos los datos necesarios al backend
      const employeeResult = await createEmployee(data);

      if (employeeResult.status !== "success") {
        throw new Error(employeeResult.message || t("users.errorTitle"));
      }

      // Mostrar mensaje de éxito
      success({
        title: t("users.successTitle"),
        text: t("users.successText"),
        delay: 2000,
      });

      reset();        // Limpiar el formulario
      setOpen(false); // Cerrar el modal

      if (updateEmployees) {
        updateEmployees(); // Actualizar lista
      }

    } catch (err) {
      // Mostrar mensaje de error
      error({
        title: t("users.errorTitle"),
        text: err.message,
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
          <DialogTitle>{t("users.newUser")}</DialogTitle>{" "}
          {/* Traducción para "Crear nuevo usuario" */}
          <DialogDescription>
            {t("users.allFieldsRequired")}{" "}
            {/* Traducción para "Todos los campos son obligatorios." */}
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de creación de usuario */}
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div name="username">
            <Label className="mb-1">{t("userProfile.username")}</Label>{" "}
            {/* Traducción para "Usuario" */}
            <Input
              type="text"
              {...register("username")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div name="first_name">
            <Label className="mb-1">{t("userProfile.firstName")}</Label>{" "}
            {/* Traducción para "Nombre" */}
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
            <Label className="mb-1">{t("userProfile.lastName")}</Label>{" "}
            {/* Traducción para "Apellidos" */}
            <Input
              type="text"
              {...register("last_name")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div name="dni">
            <Label className="mb-1">{t("userProfile.dni")}</Label>{" "}
            {/* Traducción para "DNI" */}
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
            <Label className="mb-1">{t("userProfile.email")}</Label>{" "}
            {/* Traducción para "Email" */}
            <Input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div name="password">
            <Label className="mb-1">{t("userProfile.password")}</Label>{" "}
            {/* Traducción para "Contraseña" */}
            <Input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div name="password_confirmation">
            <Label className="mb-1">
              {t("userProfile.passwordConfirmation")}
            </Label>{" "}
            {/* Traducción para "Confirmar Contraseña" */}
            <Input
              type="password"
              {...register("password_confirmation")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div name="phone">
            <Label className="mb-1">{t("userProfile.phone")}</Label>{" "}
            {/* Traducción para "Teléfono" */}
            <Input
              type="text"
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div name="department_id">
            <Label className="mb-1">{t("departments.department")}</Label>
            <select
              {...register("department_id")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">{t("common.select")}</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <p className="text-red-500 text-sm">
                {errors.department_id.message}
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
              {isSubmitting ? t("users.creating") : t("employees.createEmployee")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEmployeeModal;
