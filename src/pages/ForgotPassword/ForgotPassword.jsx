import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { requestPasswordReset } from "@/services/userRequests";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

/**
 * Componente para recuperar la contraseña de un usuario.
 *
 * Este componente permite a los usuarios solicitar el restablecimiento de su contraseña
 * a través de su nombre de usuario y correo electrónico. Si la solicitud es exitosa,
 * se envía un mensaje de éxito; si falla, se muestra un mensaje de error.
 *
 * @component
 * @example
 * return (
 *   <ForgotPassword />
 * )
 *
 * @returns {JSX.Element} La página de recuperación de contraseña.
 */
const ForgotPassword = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  /**
   * Maneja la acción de enviar el formulario de recuperación de contraseña.
   * Realiza una solicitud para restablecer la contraseña y muestra mensajes de éxito o error.
   *
   * @param {Event} e El evento del formulario al ser enviado.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await requestPasswordReset(email, username);

      if (response.status === "success") {
        success({
          title: "Contraseña restablecida",
          text: "La nueva contraseña ha sido enviada su correo electrónico",
          delay: 2000,
        });
        setNewPassword(response.data);
      } else {
        error({
          title: "Error al restablecer la contraseña",
          text: "Ha ocurrido un error y no se ha podido restblecer su contraseña",
          delay: 2000,
        });
        setNewPassword("");
      }
    } catch (error) {
      setMessage(error?.message || "Error al restablecer la contraseña");
      setNewPassword("");
    }
  };

  return (
    <div
      className={clsx(
        "h-screen flex justify-center items-center transition-colors duration-300",
        isDarkMode ? "bg-dark-800" : "bg-olive-50"
      )}
    >
      <div
        className={clsx(
          "w-full max-w-sm p-8 rounded-lg shadow-lg border transition-colors duration-300",
          isDarkMode
            ? "bg-dark-900 border-dark-700 text-dark-50"
            : "bg-white border-olive-200 text-olive-800"
        )}
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-48" />
        </div>
        <h2
          className={clsx(
            "text-2xl font-semibold text-center mb-6",
            isDarkMode ? "text-dark-100" : "text-olive-700"
          )}
        >
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={clsx(
                "peer bg-transparent h-12 w-full rounded-lg placeholder-transparent ring-2 px-4 focus:outline-none transition-all",
                isDarkMode
                  ? " text-dark-50 ring-dark-600 focus:ring-dark-400"
                  : " text-olive-700 ring-olive-300 focus:ring-olive-500"
              )}
              placeholder="Usuario"
              required
            />
            <label
              htmlFor="username"
              className={clsx(
                "absolute cursor-text left-4 -top-3 text-sm px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3",
                isDarkMode
                  ? "text-dark-300 bg-dark-900 peer-placeholder-shown:text-dark-400 peer-focus:text-dark-200"
                  : "text-olive-700 bg-white peer-placeholder-shown:text-olive-500 peer-focus:text-olive-600"
              )}
            >
              Usuario
            </label>
          </div>

          <div className="mb-6 relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(
                "peer bg-transparent h-12 w-full rounded-lg placeholder-transparent ring-2 px-4 focus:outline-none transition-all",
                isDarkMode
                  ? " text-dark-50 ring-dark-600 focus:ring-dark-400"
                  : " text-olive-700 ring-olive-300 focus:ring-olive-500"
              )}
              placeholder="Correo electrónico"
              required
            />
            <label
              htmlFor="email"
              className={clsx(
                "absolute cursor-text left-4 -top-3 text-sm px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3",
                isDarkMode
                  ? "text-dark-300 bg-dark-900 peer-placeholder-shown:text-dark-400 peer-focus:text-dark-200"
                  : "text-olive-700 bg-white peer-placeholder-shown:text-olive-500 peer-focus:text-olive-600"
              )}
            >
              Correo electrónico
            </label>
          </div>

          <button
            type="submit"
            className={clsx(
              "w-full py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer",
              isDarkMode
                ? "bg-dark-600 text-dark-50 hover:bg-dark-500 focus:ring-dark-300"
                : "bg-olive-500 text-white hover:bg-olive-600 focus:ring-olive-400"
            )}
          >
            Generar nueva contraseña
          </button>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={clsx(
                "text-sm underline cursor-pointer",
                isDarkMode
                  ? "text-dark-300 hover:text-dark-100"
                  : "text-olive-500 hover:text-olive-700"
              )}
            >
              Volver al inicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
