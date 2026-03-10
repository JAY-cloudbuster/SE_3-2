import axios from 'axios';

// In development, use an empty base URL so Vite's proxy handles /api requests
// (avoids CORS entirely on localhost). In production, use the deployed backend URL.
const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_APP_URL || '');

/**
 * Configured Axios Instance
 *
 * In development: requests go to /api/... which Vite proxies to http://localhost:5000
 * In production:  requests go to https://agritechse.onrender.com/api/...
 *
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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
