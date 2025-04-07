// src/pages/LoginEmpleado.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginEmployee = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.data.role === 'empleado') {
        navigate('/empleado-dashboard');
      } else {
        alert('Acceso denegado');
      }
    } catch (error) {
      console.error(error);
      alert('Error de inicio de sesión');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-olive-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-olive-700 mb-6">Login Empleado</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-olive-700 font-medium">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-olive-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-olive-700 font-medium">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-olive-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-olive-600 text-white py-3 rounded-lg hover:bg-olive-700 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginEmployee;
