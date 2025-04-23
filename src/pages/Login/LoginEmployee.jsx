import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "@services/authRequests.js";
import { UserContext } from "@context/UserContext";
import { useTheme } from "@context/ThemeContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

/**
 * Componente de inicio de sesión para el portal de Empleado.
 * Este componente gestiona la autenticación del empleado a través de su nombre de usuario y contraseña.
 * Los usuarios pueden optar por recordar sus credenciales y acceder al sistema si sus datos son correctos.
 *
 * @component
 * @example
 * return (
 *   <LoginEmployee />
 * );
 *
 * @returns {JSX.Element} El componente LoginAdmin con su formulario de inicio de sesión.
 */
const LoginEmployee = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(UserContext);

  const [err, setErr] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  /**
   * Hook para cargar las credenciales guardadas en localStorage si el usuario ha optado por recordarlas
   */
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const remember = localStorage.getItem("rememberMe") === "true";

    if (remember) {
      setUsername(savedUsername || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  /**
   * Función para manejar el envío del formulario de inicio de sesión.
   * Realiza la autenticación del usuario y maneja el almacenamiento de las credenciales si el usuario opta por recordarlas.
   *
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!username || !password) {
      setErr("Por favor, completa todos los campos.");
      return;
    }

    try {
      const data = await loginRequest(username, password);

      if (data.access_token) {
        setUserData({
          token: data.access_token,
          user: data.user,
        });

        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("loginType", "employee");

        if (data.user.roles.some((role) => role.name === "Empleado")) {
          success({
            title: t("auth.login_title_ok") + username,
            text: t("auth.login_text_ok"),
            delay: 2000,
          });

          navigate("/dashboard/employee/home");
        } else {
          error({
            title: t("auth.login_text_fail"),
            text: t("auth.login_text_fail_no_employee"),
            delay: 2000,
          });

          navigate("/");
        }
      }

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
        localStorage.setItem("rememberMe", "false");
      }
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-olive-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg border border-olive-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Login Icon" className="w-48" />
        </div>
        <h2 className="text-2xl font-semibold text-olive-700 text-center mb-6">
          Iniciar sesión
        </h2>
        <h5 className={clsx("text-1xl text-red-500 italic text-center mb-6")}>
          ( Portal para Empleados )
        </h5>

        {err && (
          <div className="text-red-500 text-sm text-center mb-4">{err}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer bg-transparent h-12 w-full rounded-lg text-olive-700 placeholder-transparent ring-2 ring-olive-300 px-4 focus:ring-olive-500 focus:outline-none focus:border-olive-600 transition-all"
              placeholder="Usuario"
            />
            <label
              htmlFor="username"
              className="absolute cursor-text left-4 -top-3 text-sm text-olive-700 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-olive-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-olive-600 peer-focus:text-sm transition-all"
            >
              Usuario
            </label>
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer bg-transparent h-12 w-full rounded-lg text-olive-700 placeholder-transparent ring-2 ring-olive-300 px-4 pr-12 focus:ring-olive-500 focus:outline-none focus:border-olive-600 transition-all"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute cursor-text left-4 -top-3 text-sm text-olive-700 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-olive-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-olive-600 peer-focus:text-sm transition-all"
            >
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-olive-500 hover:text-olive-700 focus:outline-none cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="flex items-center mb-4">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 accent-olive-600 bg-gray-100 border-gray-300 rounded focus:ring-olive-500 focus:ring-2"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-olive-700">
              Recordar contraseña
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-olive-500 text-white font-semibold rounded-md hover:bg-olive-600 focus:outline-none focus:ring-2 focus:ring-olive-400 cursor-pointer"
          >
            Iniciar sesión
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

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className={clsx(
                "text-sm underline cursor-pointer",
                isDarkMode
                  ? "text-dark-300 hover:text-dark-100"
                  : "text-olive-500 hover:text-olive-700"
              )}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginEmployee;
