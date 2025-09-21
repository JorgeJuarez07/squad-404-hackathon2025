// src/components/ProductCard/ProductCard.js
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const { name = "Nombre no disponible", description = "Sin descripción.", price = 0 } = product;

  return (
    <div className="product-card">
      <div className="product-card-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <p className="product-price">${parseFloat(price).toFixed(2)}</p>
      </div>
      <div className="product-card-actions">
        <button className="add-to-cart-button">
          Agregar al carrito
        </button>
        <button onClick={() => onDelete(product.id)} className="delete-button">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;