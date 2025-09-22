// src/App.jsx
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";

// Proveedor de contexto para manejar la autenticación en toda la app
import { AuthProvider } from './context/AuthContext'; 

// Componente para proteger rutas que requieren inicio de sesión
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Importación de todas las páginas
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Callback from "./pages/login/Callback";
import SingUp from "./pages/singup/Singup";
import Profile from "./pages/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import Products from './pages/products/Products';
import ShoppingCartPage from './pages/ShoppingCart/ShoppingCartPage';
import ChatPage from './pages/chat/chatPage';
import ConversationPage from './pages/conversationPage/conversationPage';

// Componente que define todas las rutas de la aplicación
const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      {/* Cualquiera puede acceder a estas rutas */}
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/singup" element={<SingUp />} />
      
      {/* --- Rutas Protegidas --- */}
      {/* Solo los usuarios autenticados pueden acceder a estas rutas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:chatId" element={<ConversationPage />} />
      </Route>

      {/* --- Redirección --- */}
      {/* Si un usuario intenta acceder a una ruta que no existe, se le redirige a la página principal */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Componente principal que envuelve la aplicación con el Router y el AuthProvider
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