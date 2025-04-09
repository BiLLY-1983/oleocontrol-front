import React, { useContext, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { UserContext } from "@context/UserContext";
import { useTheme } from "@context/ThemeContext";

const UserProfile = () => {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(UserContext);
  const { theme } = useTheme(); // Usar el contexto del tema

  if (!userData?.token) {
    return <div>No estás autenticado</div>;
  }

  const { user } = userData;
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setUserData({ ...userData, user: editedUser });
    alert("Datos guardados con éxito!");
  };

  const initials = `${user.first_name.charAt(0).toUpperCase()}${user.last_name
    .charAt(0)
    .toUpperCase()}`;

  const isDarkMode = theme === "dark";

  return (
    <div
      className={clsx(
        "flex justify-center items-center min-h-screen",
        isDarkMode ? "bg-dark-800" : "bg-white"
      )}
    >
      <div
        className={clsx(
          "rounded-lg shadow-lg p-8 w-full max-w-2xl",
          isDarkMode ? "bg-dark-900" : "bg-olive-50"
        )}
      >
        {/* Avatar */}
        <div className="flex items-center mb-6">
          <div
            className={clsx(
              "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold",
              isDarkMode ? "bg-dark-700 text-dark-50" : "bg-olive-700 text-white"
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
                : "bg-olive-500 text-white hover:bg-olive-600"
            )}
            onClick={handleSave}
          >
            {t("userProfile.edit")}
          </button>
        </div>

        {/* Información Personal */}
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
                value={editedUser[name]}
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
