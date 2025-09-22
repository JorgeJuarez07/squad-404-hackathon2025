// src/App.jsx
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from "react-router-dom";

import { AuthProvider} from './context/AuthContext'; // Importamos
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Callback from "./pages/login/Callback";
import SingUp from "./pages/singup/Singup";
import Profile from "./pages/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import Products from './pages/products/Products';
import ShoppingCartPage from './pages/ShoppingCart/ShoppingCartPage';

// El componente App ahora solo define las rutas, sin lógica interna.
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/singup" element={<SingUp />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        {/* Ya no necesitas pasar 'logout' como prop */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/products" element={<Products />} />
      </Route>

      {/* Redirección para cualquier ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


// El componente principal envuelve todo en los proveedores necesarios.
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;