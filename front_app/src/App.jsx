import React, { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate 
} from "react-router-dom";

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Callback from "./pages/login/Callback";
import SingUp from "./pages/singup/Singup";
import Profile from "./pages/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'tokens' && !event.newValue) {
        console.log('Token borrado. Forzando cierre de sesión.');
        navigate('/login');
      }
    };

    window.addEventListener('storage', syncLogout);

    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, [navigate]);
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/singup" element={<SingUp />} />
      

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route 
          path="/profile" 
          element={<Profile logout={handleLogout} onProfileClick={handleProfileClick} />} 
        />
        <Route path="/profile-edit" element={<ProfileEdit />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

