// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const logout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'tokens' && !event.newValue) {
        console.log('Token borrado en otra pestaña. Cerrando sesión.');
        setTimeout(() => {
          setUser(null);
          navigate('/login', { replace: true });
        }, 50);
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, [navigate]);

  const value = { user, setUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};