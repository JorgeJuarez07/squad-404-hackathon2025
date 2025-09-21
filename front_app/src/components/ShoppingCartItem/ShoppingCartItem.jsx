import React from 'react';
import './ShoppingCartItem.css';

const ShoppingCartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">${(item.price).toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => onDecrease(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)}>+</button>
      </div>
      <div className="cart-item-total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button onClick={() => onRemove(item.id)} className="cart-item-remove">
        &times;
      </button>
    </div>
  );
};

export default ShoppingCartItem;