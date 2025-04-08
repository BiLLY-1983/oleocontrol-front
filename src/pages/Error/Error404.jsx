import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-olive-50">
      <h1 className="text-6xl font-bold text-olive-700 mb-4">404</h1>
      <p className="text-xl text-olive-600 mb-6">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-olive-500 text-white font-semibold rounded-md hover:bg-olive-600 transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default Error404;