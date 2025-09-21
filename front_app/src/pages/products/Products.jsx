import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import axios from 'axios';

// Define la URL base de tu API de Django
const API_BASE_URL = 'http://localhost:8000/api';

// Función para obtener el CSRF token de las cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Función para convertir un archivo a un string Base64
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});


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
    setIsLoading(true);
    setError(null);
    try {
      const userId = user?.sub; // Asumiendo que 'sub' es el ID de usuario
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/products/?user=${userId}`);
      const productos = response.data || [];
      
      setMyProducts(productos);

      const vendidos = productos.reduce((acc, prod) => acc + (prod.soldCount || 0), 0);
      const total = productos.reduce((acc, prod) => acc + ((prod.soldCount || 0) * parseFloat(prod.price)), 0);

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
      
      const csrftoken = getCookie('csrftoken');

      // Convertir FormData a un objeto plano
      const productData = Object.fromEntries(formData.entries());
      const imageFile = formData.get('image'); // Obtener el archivo de imagen

      let imageBase64 = null;
      // Si el usuario seleccionó un archivo, convertirlo a Base64
      if (imageFile && imageFile.size > 0) {
        imageBase64 = await fileToBase64(imageFile);
      }
      
      // Construir el objeto final para enviar como JSON
      const payload = {
        name: productData.name,
        description: productData.description,
        price: String(productData.price),
        unit: productData.unit,
        image: imageBase64, // Aquí se envía el string Base64
        is_delivery_available: productData.is_delivery_available === 'on' || productData.is_delivery_available === true,
        is_pickup_available: productData.is_pickup_available === 'on' || productData.is_pickup_available === true,
        is_published: productData.is_published === 'on' || productData.is_published === true,
        user: parseInt(userId, 10)
      };
      
      // Enviar la solicitud POST con el formato JSON y el token CSRF
      await axios.post(`${API_BASE_URL}/products/`, payload, {
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrftoken
        }
      });

      setIsModalOpen(false);
      fetchUserProducts();

    } catch (err) {
      console.error("Error al guardar el producto:", err);
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "No se pudo conectar con el servidor.";
      alert(`Error al guardar el producto: ${errorMessage}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const csrftoken = getCookie('csrftoken');
      await axios.delete(`${API_BASE_URL}/products/${productId}/`, {
        headers: { 'X-CSRFTOKEN': csrftoken }
      });
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
              
              {isLoading && <p>Cargando productos...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!isLoading && !error && myProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {myProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
                      <img
                        src={product.image || 'https://placehold.co/600x400?text=Producto'}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded"
                      />
                      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <p className="text-green-600 font-semibold mt-1">${parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Vendidos: {product.soldCount || 0}</p>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoading && <p className="text-gray-500 pt-4">No tienes productos. ¡Añade uno!</p>
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