// src/components/AddProductModal/AddProductModal.jsx

import React, { useState } from 'react';
import { useCreateProduct } from '../../Hooks/useAddProductModal';
import './ProductForm.css';

// El componente ya no necesita la prop 'userId'
const AddProductModal = ({ isOpen, onClose }) => { 
  const initialState = {
    name: '',
    description: '',
    price: '',
    unit: '',
    image: null,
    deliveryOption: 'Envío a domicilio'
  };

  const [formData, setFormData] = useState(initialState);
  const { create, loading, error, data } = useCreateProduct();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('price', formData.price);
    dataToSend.append('unit', formData.unit);
    dataToSend.append('deliveryOption', formData.deliveryOption);
    
    // 🔥 La corrección clave: siempre envía el usuario con ID 1
    dataToSend.append('user', 1);
    
    if (formData.image) {
      dataToSend.append('image', formData.image);
    }
    
    await create(dataToSend);

    if (!error && !loading) {
      onClose();
      setFormData(initialState);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">&times;</button>
        <h3 className="modal-title">Nuevo Producto</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div>
            <label htmlFor="name" className="form-label">Nombre del Producto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="form-label">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="unit" className="form-label">Unidad (ej: kg, pieza)</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="form-label">Imagen del producto</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
              required
            />
          </div>
          {formData.image && (
            <div style={{ marginTop: '1rem' }}>
              <p className="form-label">Vista previa:</p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Vista previa"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}
          <div>
            <label htmlFor="deliveryOption" className="form-label">Opción de entrega</label>
            <select
              id="deliveryOption"
              name="deliveryOption"
              value={formData.deliveryOption}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Envío a domicilio">Envío a domicilio</option>
              <option value="Recoger en tienda">Recoger en tienda</option>
            </select>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
          {error && <p className="error-message">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;