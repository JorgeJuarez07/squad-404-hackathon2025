// src/api/productsApi.js

const BASE_API = 'http://localhost:8000';

export async function createProduct(productData) { // Ya no recibe 'accessToken'
  try {
    const url = `${BASE_API}/api/products/`;
    
    const response = await fetch(url, {
      method: 'POST',
      // No se incluye el encabezado de Authorization
      body: productData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear el producto: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}