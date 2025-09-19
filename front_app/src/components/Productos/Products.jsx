
import NavigationBar from '../NavigationBar/NavigationBar'; // <-- 1. Importamos la barra de navegación
import './Products.css'; // Te recomiendo crear un CSS para la página

// Datos de los productos
const productsData = [
  { id: 1, name: 'Tomates Orgánicos', description: 'Cosecha fresca del día, perfectos para ensaladas y salsas.', delivery: 'Envío a domicilio' },
  { id: 2, name: 'Aguacates Hass', description: 'Aguacates cremosos, listos para un delicioso guacamole.', delivery: 'Recoger en tienda' },
  { id: 3, name: 'Fresas Frescas', description: 'Fresas dulces y jugosas, cultivadas con métodos tradicionales.', delivery: 'Envío a domicilio' },
  { id: 4, name: 'Maíz Orgánico', description: 'Mazorcas de maíz tierno, ideales para asar o hervir.', delivery: 'Recoger en tienda' },
  // ... más productos si quieres
];

const ProductsPage = ({ logout, onProfileClick }) => {
  return (
    <div className="products-page-container">
      {/* 2. Usamos el componente NavigationBar y le pasamos las props */}
      <NavigationBar logout={logout} onProfileClick={onProfileClick} />
      
      <h2 className="products-main-title">Productos Disponibles</h2>
      <p className="products-subtitle">Del campo a tu hogar. Frescura y calidad en cada cosecha.</p>
      
      <div className="products-grid">
        {productsData.map(product => (
          <div key={product.id} className="product-card">
            <div className={`product-tag ${product.delivery === 'Envío a domicilio' ? 'tag-domicilio' : 'tag-tienda'}`}>
              {product.delivery}
            </div>
            <div className={`product-image-area product-bg-${product.id}`}>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <button className="add-to-cart-button">Añadir al Carrito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;