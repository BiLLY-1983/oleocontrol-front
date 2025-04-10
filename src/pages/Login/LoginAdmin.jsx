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

const LoginAdmin = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        localStorage.setItem("loginType", "admin");

        if (data.user.roles.some((role) => role.name === "Administrador")) {
          success({
            title: t("Login_title_ok") + username,
            text: t("Login_text_ok"),
            delay: 2000,
          });

          navigate("/dashboard/admin/home");
        } else {
          error({
            title: t("Login_text_fail"),
            text: t("Login_text_fail_no_admin"),
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
          <img src="/logo.png" alt="Login Icon" className="w-48" />
        </div>
        <h2
          className={clsx(
            "text-2xl font-semibold text-center mb-6",
            isDarkMode ? "text-dark-100" : "text-olive-700"
          )}
        >
          Iniciar sesión
        </h2>

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
              className={clsx(
                "peer bg-transparent h-12 w-full rounded-lg placeholder-transparent ring-2 px-4 focus:outline-none transition-all",
                isDarkMode
                  ? " text-dark-50 ring-dark-600 focus:ring-dark-400 focus:border-dark-700"
                  : " text-olive-700 ring-olive-300 focus:ring-olive-500 focus:border-olive-600"
              )}
              placeholder="Usuario"
            />
            <label
              htmlFor="username"
              className={clsx(
                "absolute cursor-text left-4 -top-3 text-sm px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3",
                isDarkMode
                  ? "text-dark-300 bg-dark-900 peer-placeholder-shown:text-dark-400 peer-placeholder-shown:top-3 peer-focus:text-dark-200"
                  : "text-olive-700 bg-white peer-placeholder-shown:text-olive-500 peer-placeholder-shown:top-3 peer-focus:text-olive-600"
              )}
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
              className={clsx(
                "peer bg-transparent h-12 w-full rounded-lg placeholder-transparent ring-2 px-4 focus:outline-none transition-all",
                isDarkMode
                  ? "bg-dark-800 text-dark-50 ring-dark-600 focus:ring-dark-400"
                  : "bg-transparent text-olive-700 ring-olive-300 focus:ring-olive-500"
              )}
              placeholder="Contraseña"
            />
            <label
              htmlFor="password"
              className={clsx(
                "absolute cursor-text left-4 -top-3 text-sm px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3",
                isDarkMode
                  ? "text-dark-300 bg-dark-900 peer-placeholder-shown:text-dark-400 peer-placeholder-shown:top-3 peer-focus:text-dark-200"
                  : "text-olive-700 bg-white peer-placeholder-shown:text-olive-500 peer-placeholder-shown:top-3 peer-focus:text-olive-600"
              )}
            >
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none",
                isDarkMode
                  ? "text-dark-400 hover:text-dark-200"
                  : "text-olive-500 hover:text-olive-700"
              )}
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
              className={clsx(
                "w-4 h-4 rounded focus:ring-2",
                isDarkMode
                  ? "accent-dark-400 bg-dark-700 border-dark-600 focus:ring-dark-300"
                  : "accent-olive-600 bg-gray-100 border-gray-300 focus:ring-olive-500"
              )}
            />
            <label
              htmlFor="rememberMe"
              className={clsx(
                "ml-2 text-sm",
                isDarkMode ? "text-dark-200" : "text-olive-700"
              )}
            >
              Recordar credenciales
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
            Iniciar sesión
          </button>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={clsx(
                "text-sm underline cursor-pointer",
                isDarkMode ? "text-dark-300 hover:text-dark-100" : "text-olive-500 hover:text-olive-700"
              )}
            >
              Volver al inicio
            </button>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className={clsx(
                "text-sm",
                isDarkMode ? "text-dark-300 hover:text-dark-100" : "text-olive-500 hover:text-olive-700"
              )}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
