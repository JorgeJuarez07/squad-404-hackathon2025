import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import axios from 'axios';

const Products = ({ logout, onProfileClick }) => {
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalVentas, setTotalVentas] = useState(0);
  const [totalDinero, setTotalDinero] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchUserProducts = useCallback(async () => {
    setIsLoading(false);
    setError(null);
    try {
      const userId = user?.sub;
      if (!userId) {
        navigate('/login');
        return;
      }

      // Consulta a la API para obtener productos
      const response = await axios.get(`https://tu-api.com/api/products/user/${userId}`);
      const productos = response.data.products || [];
      
      setMyProducts(productos);

      const vendidos = productos.reduce((acc, prod) => acc + (prod.soldCount || 0), 0);
      const total = productos.reduce((acc, prod) => acc + ((prod.soldCount || 0) * prod.price), 0);

      setTotalVentas(vendidos);
      setTotalDinero(total);

    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudieron cargar tus productos.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user?.sub]);

  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  const handleAddProduct = async (formData) => {
    try {
      const userId = user?.sub;
      if (!userId) return alert("Usuario no identificado.");

      formData.append('owner', userId);
      
      // Consulta a la API para crear un producto
      await axios.post('https://tu-api.com/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false);
      fetchUserProducts(); 

    } catch (err) {
      console.error("Error al guardar el producto:", err);
      alert("Error al guardar el producto.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      // Consulta a la API para eliminar un producto
      await axios.delete(`https://tu-api.com/api/products/${productId}`);
      fetchUserProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <NavigationBar logout={logout} onProfileClick={onProfileClick} />

        <div className="container mx-auto py-12 px-4">
          <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Mis Productos</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                + Agregar Producto
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Resumen de Ventas</h3>
              <p><strong>Total productos vendidos:</strong> {totalVentas}</p>
              <p><strong>Total generado:</strong> ${totalDinero.toFixed(2)}</p>
            </div>

            <hr />

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">Mi Catálogo</h2>
              
              {error && <p className="text-red-500">{error}</p>}

{myProducts.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
    {myProducts.map(product => (
      <div key={product._id} className="border rounded-lg p-4 shadow-sm bg-white">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="text-lg font-bold mt-2">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <p className="text-green-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Vendidos: {product.soldCount || 0}</p>
        <button
          onClick={() => handleDeleteProduct(product._id)}
          className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 pt-4">No tienes productos. ¡Añade uno!</p>
)}

            </div>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
};

export default Products;