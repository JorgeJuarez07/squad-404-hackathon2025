import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const tokenString = localStorage.getItem('tokens');
  let tokens = null;

  if (tokenString) {
    try {
      tokens = JSON.parse(tokenString);
    } catch (error) {
      console.error("Error al parsear los tokens del localStorage:", error);
      localStorage.removeItem('tokens');
    }
  }

  const isAuthenticated = tokens && tokens.access_token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
