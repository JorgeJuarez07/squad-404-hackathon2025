import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const Profile = ({ logout, onProfileClick }) => {
  const navigate = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-xl text-gray-600">No se encontró información del usuario.</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavigationBar logout={logout} onProfileClick={onProfileClick} />
      
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
          
          <div className="flex flex-col items-center">
            <img
              className="w-24 h-24 mb-4 rounded-full shadow-lg"
              src={user.avatarUrl || 'https://via.placeholder.com/150'}
              alt="Foto de perfil"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenido, {user.name}!
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <hr />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">Tus Datos</h2>
            <div className="text-gray-600">
              <p><strong>ID de Usuario:</strong> {user.sub || 'No disponible'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/profile-edit')}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Editar datos
            </button>
            <button
              onClick={logout}
              className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;