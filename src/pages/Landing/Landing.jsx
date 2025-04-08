import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'; // Importar useContext
import { UserContext } from '@context/UserContext';

const LandingPage = () => {
  // Usar useContext para obtener el valor del contexto
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.token && userData.user?.role) {
      switch (userData.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'empleado':
          navigate('/empleado');
          break;
        case 'socio':
          navigate('/socio');
          break;
        default:
          break;
      }
    }
  }, [userData, navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-olive-50 px-4 text-center">
      <div className="flex justify-center mb-6">
        <img
          src="/logo.png"
          alt="Login Icon"
          className="w-48"
        />
      </div>
      <h1 className="text-3xl font-bold text-olive-800 mb-6">Bienvenido a la plataforma</h1>
      <p className="text-olive-700 mb-8">Selecciona cómo deseas iniciar sesión:</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/login/admin')}
          className="bg-olive-500 hover:bg-olive-600 text-white py-2 px-4 rounded-md transition cursor-pointer"
        >
          Administrador
        </button>
        <button
          onClick={() => navigate('/login/empleado')}
          className="bg-olive-500 hover:bg-olive-600 text-white py-2 px-2 rounded-md transition cursor-pointer"
        >
          Empleado
        </button>
        <button
          onClick={() => navigate('/login/socio')}
          className="bg-olive-500 hover:bg-olive-600 text-white py-2 px-4 rounded-md transition cursor-pointer"
        >
          Socio
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
