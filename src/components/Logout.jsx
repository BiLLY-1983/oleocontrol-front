import React from "react";
import { useContext } from "react";
import { UserContext } from "@context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutRequest } from "@services/authRequests";
import { LogOut } from "lucide-react";

import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

/**
 * Componente de cierre de sesión.
 * Permite al usuario cerrar sesión, elimina los datos del usuario
 * del almacenamiento local, y redirige a la página de inicio.
 * Muestra notificaciones de éxito o error según el resultado del cierre de sesión.
 *
 * @returns {JSX.Element} Un icono de cierre de sesión y un botón para cerrar sesión.
 */
const Logout = () => {
  const { t } = useTranslation();

  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  /**
   * Función que maneja el proceso de cierre de sesión.
   * Elimina el token de autenticación y los datos del usuario del almacenamiento local,
   * realiza una solicitud de cierre de sesión al backend, y redirige al usuario a la página principal.
   * Si la operación es exitosa, muestra una notificación de éxito. En caso de error, muestra una notificación de error.
   *
   * @returns {void}
   */
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const message = await logoutRequest(userData.token);

        setUserData(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("loginType");

        success({
          title: t("auth.logout_title"),
          text: t("auth.logout_text_ok"),
          delay: 2000,
        });

        navigate("/");
      } catch (err) {
        error({
          title: t("auth.logout_title"),
          text: t("auth.logout_text_fail"),
          delay: 2000,
        });
      }
    }
  };

  return (
    <>
      <LogOut size={16} />
      <button
        onClick={handleLogout}
        className="w-full text-left cursor-pointer"
      >
        {t("navigation.logout")}
      </button>
    </>
  );
};

export default Logout;
