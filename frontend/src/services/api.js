import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

/**
 * Configured Axios Instance
 *
 * Pre-configured with the backend API base URL.
 * All relative paths in API calls are resolved against this base URL.
 *
 * Example: api.get('/api/crops')
 *
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Request Interceptor: Automatic JWT Token Injection
 *
 * This interceptor runs before EVERY outgoing API request.
 * It reads the JWT token from localStorage (stored during login)
 * and attaches it to the Authorization header as a Bearer token.
 */
api.interceptors.request.use((config) => {
  // Retrieve the stored auth data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // If user data exists and contains a JWT token, attach it
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
