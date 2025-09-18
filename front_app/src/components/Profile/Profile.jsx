// src/components/Profile/Profile.jsx
import React from 'react';

const Profile = ({ user, logout }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="text-2xl mb-4">Bienvenido {user.name}</h1>
          <pre className="bg-gray-200 p-4 rounded mb-4">{JSON.stringify(user, null, 2)}</pre>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <h1>Cargando usuario...</h1>
      )}
    </div>
  );
};

export default Profile;