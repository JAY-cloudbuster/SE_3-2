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

export const authService = {
  /** Normal login: Phone + Password (for activated users) */
  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  /** Admin login: Email + Password */
  adminLogin: async (userData) => {
    const response = await api.post('/auth/admin-login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  /** Activation Step 1: Verify email + temp password */
  activateAccount: async (data) => {
    return api.post('/auth/activate', data);
  },

  /** Activation Step 2: Set new password */
  setNewPassword: async (data) => {
    return api.post('/auth/set-password', data);
  },

  /** Activation Step 3: Verify OTP */
  verifyOTP: async (data) => {
    return api.post('/auth/verify-otp', data);
  },

  /** Resend OTP */
  resendOTP: async (data) => {
    return api.post('/auth/resend-otp', data);
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};