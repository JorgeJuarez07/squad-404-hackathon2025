import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './singup.css'; 

const SingupPage  = () => {
      const navigate = useNavigate();
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    userName: '',
    email: '',
    phone: '',
    password: '',
  });

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generar el objeto JSON con los datos del formulario
    const userData = JSON.stringify(formData);

    // Log para ver el JSON generado
    console.log('User Data:', userData);

    // Aquí puedes enviar el JSON al backend
    try {
      const response = await fetch('https://your-backend-endpoint.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData,
      });

      if (response.ok) {
        alert('Usuario creado con éxito');
        // Redirigir a otra página o hacer algo con la respuesta
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Hubo un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div id="signup-form" className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} id="userSignupForm" className="space-y-4">
        <div>
          <label htmlFor="givenName" className="block text-white font-semibold mb-2 text-sm">Nombre</label>
          <input
            type="text"
            id="givenName"
            name="givenName"
            required
            value={formData.givenName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="familyName" className="block text-white font-semibold mb-2 text-sm">Apellido</label>
          <input
            type="text"
            id="familyName"
            name="familyName"
            required
            value={formData.familyName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="userName" className="block text-white font-semibold mb-2 text-sm">Nombre de Usuario</label>
          <input
            type="text"
            id="userName"
            name="userName"
            required
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-white font-semibold mb-2 text-sm">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-white font-semibold mb-2 text-sm">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-white font-semibold mb-2 text-sm">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>

        <div id="signupStatusMessage" className="text-center text-sm font-bold mt-4 hidden"></div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 text-sm"
        >
          Crear Usuario
        </button>
      </form>

      <p className="text-center text-white mt-4 text-xs sm:text-sm">
        ¿Ya tienes una cuenta? 
        <button 
          onClick={() => window.location.href = "https://interle-jy3ptw.us1.zitadel.cloud/oauth/v2/authorize?client_id=338010317902660978&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/callback"}
          className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75"
        >
          Login
        </button>
      </p>

      <button
        id="backFromSignupButton"
        onClick={() => navigate('/login')} 
        className="w-full mt-4 bg-transparent text-white font-bold py-3 px-6 rounded-full border-2 border-white hover:bg-white hover:text-green-600 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-sm"
      >
        Volver
      </button>
    </div>
  );
};

export default SingupPage;
