import React, { useState } from 'react';
import './ProductForm.css';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const initialState = {
    name: '',
    description: '',
    price: '',
    unit: '',
    image: null,
    deliveryOption: 'Envío a domicilio'
  };

  const [formData, setFormData] = useState(initialState);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('price', formData.price);
    dataToSend.append('unit', formData.unit);
    dataToSend.append('deliveryOption', formData.deliveryOption);
    dataToSend.append('image', formData.image);

    onSubmit(dataToSend);
    setFormData(initialState);
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

          <button type="submit" className="submit-button">Guardar Producto</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
