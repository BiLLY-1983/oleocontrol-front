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

const Logout = () => {
  const { t } = useTranslation();

  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const message = await logoutRequest(userData.token); // Usamos la función logoutRequest

        setUserData(null); // Limpiar el estado del usuario
        localStorage.removeItem("authToken"); // Eliminar el token del almacenamiento local
        localStorage.removeItem("userData");
        localStorage.removeItem("loginType"); // Eliminar el tipo de login

        success({
          title: t("auth.logout_title"), // Usar traducción para el título
          text: t("auth.logout_text_ok"), // Usar traducción para el texto
          delay: 2000,
        });

        navigate("/");
      } catch (err) {
        error({
          title: t("auth.logout_title"), // Usar traducción para el título
          text: t("auth.logout_text_fail"), // Usar traducción para el texto
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
        {t("navigation.logout")} {/* Usar traducción para el texto del botón */}
      </button>
    </>
  );
};

export default Logout;