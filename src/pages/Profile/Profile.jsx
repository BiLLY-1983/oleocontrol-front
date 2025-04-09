import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "@context/UserContext";

const UserProfile = () => {
  const { t } = useTranslation();

  // Obtenemos los datos del usuario desde el contexto
  const { userData, setUserData } = useContext(UserContext);

  if (!userData?.token) {
    return <div>No estás autenticado</div>;
  }

  const { user } = userData;

  // Controlamos el estado de los campos editables
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setUserData({ ...userData, user: editedUser }); // Actualiza el contexto con los datos modificados
    alert("Datos guardados con éxito!");
  };

  const initials = `${user.first_name.charAt(0).toUpperCase()}${user.last_name
    .charAt(0)
    .toUpperCase()}`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-olive-50 rounded-lg shadow-lg p-8 w-full max-w-2xl">

        {/* Avatar */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-olive-700 text-white flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">
              {editedUser.first_name} {editedUser.last_name}
            </h2>
            <p className="text-gray-500 text-sm">{editedUser.username}</p>
          </div>
          <button
            className="ml-auto text-white bg-olive-500 px-4 py-2 rounded-md hover:bg-olive-700 cursor-pointer"
            onClick={handleSave}
          >
            {t("userProfile.edit")}
          </button>
        </div>

        {/* Información Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.firstName")}
            </label>
            <input
              name="first_name"
              value={editedUser.first_name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md focus:bg-olive-100  focus:outline-2 focus:outline-olive-300"
            />
          </div>
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.lastName")}
            </label>
            <input
              name="last_name"
              value={editedUser.last_name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md focus:bg-olive-100  focus:outline-2 focus:outline-olive-300"
            />
          </div>
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.email")}
            </label>
            <input
              name="email"
              type="email"
              value={editedUser.email}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md focus:bg-olive-100  focus:outline-2 focus:outline-olive-300"
            />
          </div>
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.phone")}
            </label>
            <input
              name="phone"
              value={editedUser.phone}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md focus:bg-olive-100  focus:outline-2 focus:outline-olive-300"
            />
          </div>
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.dni")}
            </label>
            <input
              name="dni"
              value={editedUser.dni}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded-md focus:bg-olive-100  focus:outline-2 focus:outline-olive-300"
            />
          </div>
          <div>
            <label className="block text-olive-900 font-semibold">
              {t("userProfile.status")}
            </label>
            <input
              name="status"
              type="checkbox"
              checked={editedUser.status}
              onChange={handleChange}
              className="w-4 h-4 accent-olive-600 bg-gray-100 border-gray-300 rounded focus:ring-olive-500 focus:ring-2 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
