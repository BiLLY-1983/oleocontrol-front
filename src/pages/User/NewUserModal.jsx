import { useForm } from "react-hook-form";
import { createUser } from "@services/userRequests";
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

/** Definir el esquema de validación con Zod */
const userSchema = z
  .object({
    /*     username: z
          .string()
          .min(1, { message: "El nombre de usuario es obligatorio" })
          .max(255, { message: "Máximo 255 caracteres" }), */
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
      .regex(/^\d{8}[A-Za-z]$/, {
        message: "El DNI debe tener 8 números seguidos de una letra",
      }),
    email: z
      .string()
      .email({ message: "El email no es válido" })
      .min(1, { message: "El email es obligatorio" })
      .max(255, { message: "Máximo 255 caracteres" }),
    /*     password: z
          .string()
          .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
        password_confirmation: z.string().min(8, {
          message: "La contraseña de confirmación debe tener al menos 8 caracteres",
        }), */
    phone: z
      .string()
      .min(1, { message: "El teléfono es obligatorio" })
      .max(20, { message: "Máximo 20 caracteres" }),
    user_type: z
      .string()
      .min(1, { message: "selección de rol obligatorio" }),
    department_id: z
      .string()
      .optional()
      .refine((val) => val || true, {
        message: "El departamento es obligatorio para empleados",
      }),
  })
  .superRefine((data, ctx) => {
    /* if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        path: ["password_confirmation"],
        message: "Las contraseñas no coinciden",
      });
    } */

    if (data.user_type === "employee" && !data.department_id) {
      ctx.addIssue({
        path: ["department_id"],
        message: "El departamento es obligatorio para empleados",
      });
    }
  });

/**
 * Componente de modal para crear un nuevo usuario.
 * Este componente oermite al usuario ingresar los datos necesarios para crear un nuevo usuario en el sistema.
 * 
 * @component
 * 
 * @param {Object} props - Props del componente.
 * @param {boolean} props.open - Estado de apertura del modal.
 * @param {function} props.setOpen - Función para cambiar el estado de apertura del modal.
 * @param {boolean} props.isDarkMode - Estado del modo oscuro.
 * @param {function} props.updateUsuarios - Función para actualizar la lista de usuarios.
 * 
 * @returns {JSX.Element} - Componente de modal.
 */
const NewUserModal = ({ open, setOpen, isDarkMode, updateUsuarios }) => {
  const { t } = useTranslation(); // Hook para traducciones
  const [userType, setUserType] = useState("");
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

  /**
   * useEffect para obtener los departamentos al cargar el componente.
   * Se ejecuta una vez al montar el componente.
   * 
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetchDepartments = async () => {
      const result = await getDepartments();
      if (result.status === "success") {
        setDepartments(result.data);
      }
    };
    fetchDepartments();
  }, []);

  /**
   * Función para manejar la creación de un nuevo usuario.
   * Se encarga de enviar los datos al backend y manejar la respuesta.
   * 
   * @param {string} data.first_name - Nombre del usuario.
   * @param {string} data.last_name - Apellido del usuario.
   * @param {string} data.dni - DNI del usuario.
   * @param {string} data.email - Email del usuario.
   * @param {string} data.password - Contraseña del usuario.
   * @param {string} data.phone - Teléfono del usuario.
   * @param {string} data.user_type - Tipo de usuario.
   * @param {string} data.department_id - ID del departamento del usuario.
   * 
   * @returns {void}
   * @throws {Error} - Si ocurre un error al crear el usuario.
   */
  const handleCreate = async (data) => {
    try {
      data.status = true; 

      // Enviar todos los datos necesarios al backend
      const userResult = await createUser(data);

      if (userResult.status !== "success") {
        throw new Error(userResult.message || t("users.errorTitle"));
      }

      // Mostrar mensaje de éxito
      success({
        title: t("users.successTitle"),
        text: t("users.successText"),
        delay: 2000,
      });

      reset();        // Limpiar el formulario
      setOpen(false); // Cerrar el modal

      if (updateUsuarios) {
        updateUsuarios(); // Actualizar lista
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
        className={clsx("max-h-[50vh] overflow-y-auto",
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
          {/*           <div name="username">
            <Label className="mb-1">{t("userProfile.username")}</Label>{" "}
            <Input
              type="text"
              {...register("username")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div> */}

          <div name="first_name">
            <Label className="mb-1">{t("userProfile.firstName")}</Label>{" "}
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
            <Input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* <div name="password">
            <Label className="mb-1">{t("userProfile.password")}</Label>{" "}
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
          </div> */}

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

          {/* Selector de tipo de usuario */}
          <div name="user_type">
            <Label className="mb-1">{t("users.userType")}</Label>
            <select
              {...register("user_type")}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">{t("common.select")}</option>
              <option value="Administrador">{t("roles.Administrador")}</option>
              <option value="Invitado">{t("roles.Invitado")}</option>
              <option value="Socio">{t("roles.Socio")}</option>
              <option value="Empleado">{t("roles.Empleado")}</option>
            </select>
            {errors.user_type && (
              <p className="text-red-500 text-sm">{errors.user_type.message}</p>
            )}
          </div>

          {/* Campos adicionales según el tipo de usuario */}
          {userType === "Empleado" && (
            <div name="department_id">
              <Label className="mb-1">{t("departments.management")}</Label>
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
          )}

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
              {isSubmitting ? t("users.creating") : t("users.createUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserModal;
