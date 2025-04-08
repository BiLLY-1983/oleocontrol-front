import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutRequest } from "@services/authRequests";
import { LogOut } from "lucide-react";

import { success } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

const Logout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await logoutRequest(token);

        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        success({
            title: t("Logout_title"),
            text: t("Logout_text"),
            delay: 2000,
          });

        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
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
        {t("logout")}
      </button>
    </>
  );
};

export default Logout;
