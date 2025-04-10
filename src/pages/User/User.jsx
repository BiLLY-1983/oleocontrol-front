import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '@services/userRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [usersPerPage] = useState(10); // Número de usuarios por página

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers('/users');
      if (response.status === "success" && Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        setError('No se pudieron obtener los usuarios.');
      }
    } catch (err) {
      setError('Hubo un error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await deleteUser(id);
      fetchUsuarios();
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.first_name.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email.toLowerCase().includes(filtro.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuariosFiltrados.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcular el total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuariosFiltrados.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
        <Button className="bg-green-700 hover:bg-green-800 text-white">
          + Nuevo Usuario
        </Button>
      </div>
      <Input
        placeholder="Buscar usuarios..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 w-full"
      />
      <Card className="overflow-x-auto">
        <div className="table-container max-h-96 overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((usuario) => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{usuario.first_name} {usuario.last_name}</td>
                  <td className="p-3">{usuario.email}</td>
                  <td className="p-3">{usuario.roles.map(role => role.name).join(', ')}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        usuario.status === 'Activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {usuario.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex space-x-2 items-center">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => alert('Editar usuario ' + usuario.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        Eliminar
                      </button>
                      <MoreVertical size={16} className="text-gray-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  number === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600'
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Usuarios;
