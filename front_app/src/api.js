
const API_BASE_URL = 'http://localhost:8673';

const fetchWithAuth = async (url, options = {}) => {
  const publicRoutes = ['/auth/token', '/api/register'];
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (!publicRoutes.includes(url) && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const fullUrl = `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, {
    ...options, 
    headers,
  });
  if (response.status === 401) {
    console.log('Token inválido o expirado. Se necesita iniciar sesión de nuevo.');
    throw new Error('Unauthorized');
  }
  return response;
};

export default fetchWithAuth;