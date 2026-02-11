/**
 * @fileoverview Axios API Client Configuration for AgriSahayak Frontend
 * 
 * This module creates and configures a central Axios instance used by all
 * service modules (authService, cropService, tradeService, priceService)
 * to make HTTP requests to the backend API.
 * 
 * Key features:
 * - Base URL configuration pointing to the backend server
 * - Automatic JWT token injection via request interceptor
 * 
 * All API calls across the application should use this configured instance
 * instead of importing Axios directly, ensuring consistent authentication
 * headers and base URL resolution.
 * 
 * @module services/api
 * @requires axios - HTTP client library for browser and Node.js
 * 
 * @example
 * // Usage in service modules:
 * import api from './api';
 * const response = await api.get('/crops');      // → GET http://localhost:5000/api/crops
 * const response = await api.post('/auth/login'); // → POST http://localhost:5000/api/auth/login
 */

import axios from 'axios';

/**
 * Configured Axios Instance
 * 
 * Pre-configured with the backend API base URL.
 * All relative paths in API calls are resolved against this base URL.
 * 
 * Example: api.get('/crops') → GET http://localhost:5000/api/crops
 * 
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend Express server URL + /api prefix
});

/**
 * Request Interceptor: Automatic JWT Token Injection
 * 
 * This interceptor runs before EVERY outgoing API request.
 * It reads the JWT token from localStorage (stored during login)
 * and attaches it to the Authorization header as a Bearer token.
 * 
 * This eliminates the need to manually include the token in each
 * API call — all requests are automatically authenticated.
 * 
 * Header format: Authorization: Bearer <JWT_TOKEN>
 * 
 * @param {import('axios').InternalAxiosRequestConfig} config - Axios request configuration
 * @returns {import('axios').InternalAxiosRequestConfig} Modified config with auth header
 * 
 * @see authMiddleware.js (backend) - Verifies this token on protected routes
 * @see AuthContext.jsx - Manages the localStorage 'user' key
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