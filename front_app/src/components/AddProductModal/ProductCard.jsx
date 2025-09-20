// src/components/ProductCard/ProductCard.js

import React from 'react';


const ProductCard = ({ product }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-white">{product.name}</h3>
        <p className="text-gray-300 text-base mb-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-green-400 font-bold text-lg">${product.price.toFixed(2)} / {product.unit}</p>
          {/* Aquí podrías agregar botones para editar o eliminar el producto */}
          {/* <button className="text-sm text-yellow-400">Editar</button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;