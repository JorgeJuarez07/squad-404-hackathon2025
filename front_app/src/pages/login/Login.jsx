import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Esta es la URL de ZITADEL a la que rediriges al usuario para iniciar sesión
  const zitadelAuthUrl = `https://interle-jy3ptw.us1.zitadel.cloud/oauth/v2/authorize?client_id=338010317902660978&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/callback`;

  useEffect(() => {
    // Aquí es donde el componente verifica si viene un código en la URL
    // Esto sucede después de que el usuario inicia sesión en ZITADEL y es redirigido de vuelta
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      // Si existe el código, lo intercambia por tokens con tu backend
      axios.post('http://localhost:4000/callback', { code })
        .then(res => {
          // Si el intercambio es exitoso, guarda los tokens
          localStorage.setItem('tokens', JSON.stringify(res.data));
          // Y redirige al usuario a la página de inicio (Home), que mostrará los productos
          navigate('/');
        })
        .catch(err => {
          console.error("Error al obtener tokens:", err.response ? err.response.data : err.message);
          // Opcional: muestra un mensaje de error o redirige a una página de error
          // navigate('/error');
        });
    }
  }, [location, navigate]); // Los hooks son dependencias para que useEffect se ejecute cuando cambien

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
      <a
        href={zitadelAuthUrl}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login con ZITADEL
      </a>
    </div>
  );
};

export default Login;