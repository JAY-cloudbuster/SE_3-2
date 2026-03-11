import axios from "axios";

/**
 * Backend URL Resolution
 *
 * Development: Uses localhost backend
 * Production:  Uses deployed Render backend (se32-backend.onrender.com)
 */
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : (import.meta.env.VITE_API_URL || "https://se32-backend.onrender.com");

/**
 * Axios Instance
 *
 * All API calls should use this instance.
 * Example:
 *   api.get("/api/crops")
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Request Interceptor
 *
 * Automatically attaches JWT token from localStorage
 * to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for global error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request - token may be expired.");
    }
    return Promise.reject(error);
  }
);

export default api;