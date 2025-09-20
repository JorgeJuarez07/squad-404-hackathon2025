import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logoAgroMarket from '../../resources/Untitled-removebg-preview.png'; 
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post('http://localhost:4000/callback', { code })
        .then(res => {
          localStorage.setItem('tokens', JSON.stringify(res.data));
          navigate('/');
        })
        .catch(err => {
          console.error("Error al obtener tokens:", err.response ? err.response.data : err.message);
        });
    }
  }, [location, navigate]);

  return (
    <div id="welcome-screen" className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center w-full transform transition-all duration-500 hover:scale-105">
      <div className="flex items-center justify-center mb-4">
        <img
          src={logoAgroMarket} 
          alt="Logo de AgroMarket"      
          className="w-12 h-12 mr-3 transform rotate-12 animate-pulse" 
        />
      </div>
      <p className="text-lg sm:text-xl text-white mb-8">Bienvenido a la plataforma que conecta la cosecha con tu comunidad.</p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => window.location.href = "https://interle-jy3ptw.us1.zitadel.cloud/oauth/v2/authorize?client_id=338010317902660978&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/callback"}
          className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/singup')}
          className="w-full bg-transparent text-white font-bold py-3 px-6 rounded-full border-2 border-white hover:bg-white hover:text-green-600 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
        >
          Registrarse
        </button>
      </div>
    </div>
    </div>
  );
}
  

export default Login;