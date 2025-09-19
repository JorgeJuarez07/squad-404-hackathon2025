import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = ({ logout }) => {
  return (
    <div className="page-header">
      <Link to="/" className="agromarket-logo">
        <span className="logo-icon"></span>
        <span className="logo-text">AgroMarket</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/products" className="nav-item">Mis Productos</Link>
        <Link to="/chats" className="nav-item">Chats</Link>
        <Link to="/profile" className="nav-item">Mi Perfil</Link>
        
        <Link to="/cart" className="nav-item cart-button">
          <span className="icon">🛒</span>
          Carrito
        </Link>
        <button className="nav-item logout-button" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;