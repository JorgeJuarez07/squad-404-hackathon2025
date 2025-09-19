// src/pages/home/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Products from "../../components/Productos/Products";
import Profile from "../../components/Profile/Profile";

const Home = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('products');
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
    // ... (your logout function remains the same)
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (!tokens?.id_token) {
      localStorage.removeItem("tokens");
      return window.location.href = "/login";
    }

    const idToken = tokens.id_token;
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    const state = Math.random().toString(36).substring(2, 15);

    const logoutUrl = `https://interle-jy3ptw.us1.zitadel.cloud/oidc/v1/end_session?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}&state=${state}`;

    localStorage.removeItem("tokens");
    window.location.href = logoutUrl;
  };

  const onProfileClick = (e) => {
    e.preventDefault();
    setCurrentView('profile');
  };

  const onProductsClick = (e) => {
    e.preventDefault();
    setCurrentView('products');
  };
  
  let content;
  if (currentView === 'products') {
    content = <Products
                user={user}
                logout={logout}
                onProfileClick={onProfileClick}
                onProductsClick={onProductsClick}
              />;
  } else if (currentView === 'profile') {
    content = <Profile user={user} logout={logout} />;
  }

  return (
    <div>
      {user ? (
        <>
          {content}
        </>
      ) : (
        <h1>Cargando...</h1>
      )}
    </div>
  );
};

export default Home;