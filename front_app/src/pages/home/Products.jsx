// src/home/Products.jsx
import React from 'react';
import './Products.css'; 

const productsData = [
  { id: 1, name: 'Tomates Orgánicos', description: 'Cosecha fresca del día, perfectos para ensaladas y salsas.', delivery: 'Envío a domicilio' },
  { id: 2, name: 'Aguacates Hass', description: 'Aguacates cremosos, listos para hacer un delicioso guacamole.', delivery: 'Recoger en tienda' },
  { id: 3, name: 'Fresas Frescas', description: 'Fresas dulces y jugosas, cultivadas con métodos tradicionales.', delivery: 'Envío a domicilio' },
  { id: 4, name: 'Maíz Orgánico', description: 'Mazorcas de maíz tierno, ideales para asar o hervir.', delivery: 'Recoger en tienda' },
  { id: 5, name: 'Zanahorias Frescas', description: 'Zanahorias de la huerta, crujientes y dulces.', delivery: 'Envío a domicilio' },
  { id: 6, name: 'Lechugas Orgánicas', description: 'Hojas frescas y crujientes, cultivadas sin pesticidas.', delivery: 'Envío a domicilio' },
];

const Products = () => {
  return (
    <div className="products-page-container">
      <div className="page-header">
        <h1 className="agromarket-logo">
          <span className="logo-icon"></span> {/* Aquí iría el ícono real si usas una librería */}
          <span className="logo-text">AgroMarket</span>
        </h1>
        <div className="nav-links">
          {/* Aquí están los enlaces como en tu imagen */}
          <a href="#" className="nav-item">Mis Productos</a>
          <a href="#" className="nav-item">Chats</a>
          <a href="#" className="nav-item cart-button">
            <span className="icon">🛒</span> {/* Reemplaza con un ícono real si usas una librería */}
            Carrito
          </a>
          <a href="#" className="nav-item logout-button">Cerrar Sesión</a>
        </div>
      </div>

      <h2 className="products-main-title">Productos Disponibles</h2>
      <p className="products-subtitle">Del campo a tu hogar. Frescura y calidad en cada cosecha.</p>
      
      <div className="products-grid">
        {productsData.map(product => (
          <div key={product.id} className="product-card">
            <div className={`product-tag ${product.delivery === 'Envío a domicilio' ? 'tag-domicilio' : 'tag-tienda'}`}>
              {product.delivery}
            </div>
            <div className={`product-image-area product-bg-${product.id}`}>
              {/* Aquí irían las imágenes de los productos */}
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

export default Products;