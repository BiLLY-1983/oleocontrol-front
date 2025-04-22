import React, { useContext, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { UserContext } from "@context/UserContext";
import { useTheme } from "@context/ThemeContext";
import { success, error as notifyError } from "@pnotify/core";
import { updateProfileRequest } from "@services/authRequests";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

const UserProfile = () => {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(UserContext);
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Para la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Para la confirmación de contraseña
  const [showPasswordField, setShowPasswordField] = useState(false);

  if (!userData?.token) {
    return <div>No estás autenticado</div>;
  }

  const { user } = userData;
  const [editedUser, setEditedUser] = useState({
    ...user,
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userToSend = { ...editedUser };
      if (!userToSend.password) {
        delete userToSend.password;
      }

      const updated = await updateProfileRequest(userToSend, userData.token);
      setUserData({ ...userData, user: updated.data });

      success({
        title: "Perfil actualizado",
        text: "El perfil ha sido actualizado correctamente",
        delay: 2000,
      });

      setEditedUser((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }));
      setShowPassword(false);
      setShowConfirmPassword(false); // Restablecer la visibilidad de la confirmación de la contraseña
      setShowPasswordField(false);
    } catch (err) {
      notifyError({
        title: "Error",
        text: err.message || "No se pudo actualizar el perfil",
        delay: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user.first_name?.charAt(0).toUpperCase() || ""}${
    user.last_name?.charAt(0).toUpperCase() || ""
  }`;
  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "p-6 space-y-6",
        isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
      )}
    >
      <h1 className="text-2xl font-bold">Perfil</h1>
      <div
        className={clsx(
          "rounded-lg shadow-lg p-8 w-full max-w-2xl m-auto",
          isDarkMode ? "bg-dark-900" : "bg-olive-50"
        )}
      >
        {/* Avatar + botón */}
        <div className="flex items-center mb-6">
          <div
            className={clsx(
              "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold",
              isDarkMode
                ? "bg-dark-700 text-dark-50"
                : "bg-olive-700 text-white"
            )}
          >
            {initials}
          </div>
          <div className="ml-4">
            <h2
              className={clsx(
                "text-xl font-bold",
                isDarkMode ? "text-dark-50" : "text-olive-800"
              )}
            >
              {editedUser.first_name} {editedUser.last_name}
            </h2>
            <p
              className={clsx(
                "text-sm",
                isDarkMode ? "text-dark-200" : "text-gray-500"
              )}
            >
              {editedUser.username}
            </p>
          </div>
          <button
            className={clsx(
              "ml-auto px-4 py-2 rounded-md font-semibold cursor-pointer transition",
              isDarkMode
                ? "bg-dark-700 text-dark-50 hover:bg-dark-500"
                : "bg-olive-500 text-white hover:bg-olive-600",
              loading && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? t("userProfile.saving") || "Guardando..."
              : t("userProfile.edit") || "Guardar cambios"}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: t("userProfile.firstName"), name: "first_name" },
            { label: t("userProfile.lastName"), name: "last_name" },
            { label: t("userProfile.email"), name: "email", type: "email" },
            { label: t("userProfile.phone"), name: "phone" },
            { label: t("userProfile.dni"), name: "dni" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label
                className={clsx(
                  "block font-semibold",
                  isDarkMode ? "text-dark-50" : "text-olive-900"
                )}
              >
                {label}
              </label>
              <input
                name={name}
                type={type}
                value={editedUser[name] || ""}
                onChange={handleChange}
                className={clsx(
                  "mt-2 p-2 w-full border rounded-md focus:outline-2 transition",
                  isDarkMode
                    ? "bg-dark-700 text-dark-50 border-dark-600 focus:bg-dark-600 focus:outline-dark-500"
                    : "bg-olive-100 text-olive-900 border-olive-300 focus:bg-olive-50 focus:outline-olive-300"
                )}
              />
            </div>
          ))}

          {/* Status */}
          {user.roles.some((role) => role.name === "Administrador") && (
            <div>
              <label
                className={clsx(
                  "block font-semibold",
                  isDarkMode ? "text-dark-50" : "text-olive-900"
                )}
              >
                {t("userProfile.status")}
              </label>
              <input
                name="status"
                type="checkbox"
                checked={editedUser.status}
                onChange={handleChange}
                className={clsx(
                  "w-4 h-4 rounded mt-2 focus:ring-2",
                  isDarkMode
                    ? "accent-dark-500 bg-dark-700 border-dark-600 focus:ring-dark-400"
                    : "accent-olive-600 bg-gray-100 border-gray-300 focus:ring-olive-500"
                )}
              />
            </div>
          )}

          {/* Contraseña */}
          <div className="md:col-span-2">
            {!showPasswordField ? (
              <button
                type="button"
                onClick={() => setShowPasswordField(true)}
                className={clsx(
                  "text-sm font-medium underline",
                  isDarkMode ? "text-dark-200" : "text-olive-800"
                )}
              >
                Cambiar contraseña
              </button>
            ) : (
              <div>
                <label
                  className={clsx(
                    "block font-semibold",
                    isDarkMode ? "text-dark-50" : "text-olive-900"
                  )}
                >
                  {t("userProfile.password")}
                </label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={editedUser.password}
                    onChange={handleChange}
                    className={clsx(
                      "p-2 w-full border rounded-md pr-10 focus:outline-2 transition",
                      isDarkMode
                        ? "bg-dark-700 text-dark-50 border-dark-600 focus:bg-dark-600 focus:outline-dark-500"
                        : "bg-olive-100 text-olive-900 border-olive-300 focus:bg-olive-50 focus:outline-olive-300"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Confirmación de Contraseña */}
          {showPasswordField && (
            <div className="md:col-span-2">
              <label
                className={clsx(
                  "block font-semibold",
                  isDarkMode ? "text-dark-50" : "text-olive-900"
                )}
              >
                {t("userProfile.confirmPassword")}
              </label>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={editedUser.password_confirmation}
                  onChange={handleChange}
                  className={clsx(
                    "p-2 w-full border rounded-md pr-10 focus:outline-2 transition",
                    isDarkMode
                      ? "bg-dark-700 text-dark-50 border-dark-600 focus:bg-dark-600 focus:outline-dark-500"
                      : "bg-olive-100 text-olive-900 border-olive-300 focus:bg-olive-50 focus:outline-olive-300"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}
          {/* Botón cancelar */}
          {showPasswordField && (
            <button
              type="button"
              onClick={() => {
                setShowPasswordField(false);
                setEditedUser((prev) => ({ ...prev, password: "" }));
                setShowPassword(false);
              }}
              className={clsx(
                "mt-2 text-xs underline",
                isDarkMode ? "text-dark-300" : "text-olive-600"
              )}
            >
              Cancelar cambio de contraseña
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
