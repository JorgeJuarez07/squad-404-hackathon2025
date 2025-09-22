/**
 * Un contenedor (wrapper) para la API nativa `fetch` que añade automáticamente
 * el token de autenticación a las cabeceras de las peticiones protegidas.
 */

// La URL base de tu backend
const API_BASE_URL = 'http://localhost:8673';

const fetchWithAuth = async (url, options = {}) => {
  // 1. Define las rutas que no necesitan token
  const publicRoutes = ['/auth/token', '/api/register'];

  // 2. Obtiene el token de localStorage (o de donde lo guardes)
  const token = localStorage.getItem('accessToken');

  // 3. Prepara las cabeceras. Incluye las que ya vengan en 'options'.
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 4. Si la ruta no es pública y existe un token, lo añade a las cabeceras
  if (!publicRoutes.includes(url) && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 5. Construye la URL completa para la petición
  const fullUrl = `${API_BASE_URL}${url}`;

  // 6. Realiza la llamada `fetch` original con las cabeceras modificadas
  const response = await fetch(fullUrl, {
    ...options, // Mantiene las opciones originales (method, body, etc.)
    headers,
  });

  // 7. (Opcional pero recomendado) Maneja errores de autenticación de forma centralizada
  if (response.status === 401) {
    console.log('Token inválido o expirado. Se necesita iniciar sesión de nuevo.');
    // Aquí podrías borrar el token y redirigir al login
    // localStorage.removeItem('accessToken');
    // window.location.href = '/login';
    
    // Lanzamos un error para que la lógica del componente no continúe
    throw new Error('Unauthorized');
  }

  // 8. Devuelve la respuesta para que el componente pueda procesarla
  return response;
};

export default fetchWithAuth;