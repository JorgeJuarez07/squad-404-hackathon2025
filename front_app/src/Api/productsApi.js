const BASE_API = 'http://localhost:8000'; 

export async function fetchProducts() {
  try {
    const url = `${BASE_API}/api/products/`;
    const response = await fetch(url);
    
    // Si la respuesta no es exitosa (por ejemplo, 404 o 500), lanzamos un error
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    // Registramos el error en la consola y lo relanzamos para que sea capturado por el hook
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}