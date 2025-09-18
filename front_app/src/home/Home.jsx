import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (!tokens) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => logout());
  }, []);

const logout = () => {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  if (!tokens?.id_token) {
    localStorage.removeItem("tokens");
    return window.location.href = "/login";
  }

  const idToken = tokens.id_token;
  const redirectUri = encodeURIComponent("http://localhost:3000/login");
  const state = Math.random().toString(36).substring(2, 15); // cadena aleatoria

  const logoutUrl = `https://interle-jy3ptw.us1.zitadel.cloud/oidc/v1/end_session?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}&state=${state}`;

  // Limpiar tokens locales antes de redirigir
  localStorage.removeItem("tokens");
  window.location.href = logoutUrl;
};



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

export default Home;
