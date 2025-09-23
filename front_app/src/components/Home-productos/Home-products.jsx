// src/components/Products/Products.js

import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar'; 
import { useProducts } from '../../Hooks/useProducts';
import './Products.css';

const Products = ({ logout, onProfileClick }) => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div>
        <NavigationBar logout={logout} onProfileClick={onProfileClick} />
        <p className="loading-message">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavigationBar logout={logout} onProfileClick={onProfileClick} />
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="products-page-container">
      <NavigationBar logout={logout} onProfileClick={onProfileClick} />
      
      <h2 className="products-main-title">Productos Disponibles</h2>
      <p className="products-subtitle">Del campo a tu hogar. Frescura y calidad en cada cosecha.</p>
      
      <div className="products-grid">
        {products.map(product => (
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

export default Products;