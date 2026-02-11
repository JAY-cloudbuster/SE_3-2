/**
 * @fileoverview Authentication Service for AgriSahayak Frontend
 * 
 * This module provides functions for user authentication operations:
 * registration, login, and logout. It communicates with the backend
 * auth API endpoints and manages the user session in localStorage.
 * 
 * Session data stored in localStorage (key: 'user'):
 * { success: true, token: "jwt_string", user: { _id, phone, role, name, language } }
 * 
 * @module services/authService
 * @requires services/api - Pre-configured Axios instance with auth interceptor
 * 
 * @see Epic 1, Story 1.1 - Register as Farmer/Buyer
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 * @see Epic 1, Story 1.10 - Secure Logout
 * @see controllers/authController.js (backend) - Server-side handlers
 */

import api from './api';

/**
 * Authentication Service Object
 * 
 * Exposes methods for all auth-related API operations.
 * Each method returns the full Axios response object.
 * 
 * @namespace authService
 */
export const authService = {
  /**
   * Register a New User
   * 
   * Sends registration data to the backend and stores the auth response
   * (including JWT token) in localStorage for auto-login after registration.
   * 
   * @async
   * @function register
   * @param {Object} userData - Registration data
   * @param {string} userData.phone - 10-digit phone number
   * @param {string} userData.password - Password (min 6 characters)
   * @param {string} [userData.role='FARMER'] - User role: 'FARMER' or 'BUYER'
   * @param {string} [userData.language='en'] - Preferred language code
   * @param {string} [userData.name] - Display name
   * @param {string} [userData.avatarUrl] - Avatar filename
   * @returns {Promise<import('axios').AxiosResponse>} Response with { success, token, user }
   * 
   * @see RegisterForm.jsx - Frontend component that calls this function
   * @see POST /api/auth/register - Backend endpoint
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      // Store auth data in localStorage for session persistence
      // This enables auto-login when the user returns to the app
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  /**
   * Login an Existing User
   * 
   * Authenticates the user with phone and password, then stores
   * the auth response (including JWT token) in localStorage.
   * The token is automatically attached to future API requests
   * via the Axios interceptor in api.js.
   * 
   * @async
   * @function login
   * @param {Object} userData - Login credentials
   * @param {string} userData.phone - 10-digit phone number
   * @param {string} userData.password - Plain-text password
   * @returns {Promise<import('axios').AxiosResponse>} Response with { success, token, user }
   * 
   * @see LoginForm.jsx - Frontend component that calls this function
   * @see POST /api/auth/login - Backend endpoint
   */
  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      // Store entire auth response including JWT token and user profile
      // The Axios interceptor will read this token for subsequent requests
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  /**
   * Logout the Current User
   * 
   * Removes the stored authentication data from localStorage.
   * This effectively invalidates the client-side session.
   * Note: The JWT token on the backend remains valid until expiry (30 days).
   * 
   * @function logout
   * @see Epic 1, Story 1.10 - Secure Logout
   */
  logout: () => {
    // Remove stored session data (token + user info)
    localStorage.removeItem('user');
  },
};