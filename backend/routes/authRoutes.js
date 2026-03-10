/**
 * @fileoverview Authentication Routes for AgriSahayak Platform
 * 
 * This module defines the Express route mappings for authentication endpoints.
 * It connects HTTP methods and URL paths to their corresponding controller functions.
 * 
 * All authentication routes are mounted under the /api/auth prefix
 * (configured in server.js: `app.use('/api/auth', require('./routes/authRoutes'))`).
 * 
 * Available Endpoints:
 * - POST /api/auth/register - Create a new user account
 * - POST /api/auth/login    - Authenticate and receive JWT token
 * 
 * @module routes/authRoutes
 * @requires express - Express framework for routing
 * @requires controllers/authController - Handler functions for auth operations
 * 
 * @see Epic 1, Story 1.1 - Register as Farmer/Buyer
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 */

const express = require('express');
const router = express.Router();
const {
    loginUser,
    adminLogin,
    activateAccount,
    setNewPassword,
    verifyOTP,
    resendOTP,
} = require('../controllers/authController');

// Normal login (Phone + Password) - for activated farmers/buyers
router.post('/login', loginUser);

// Admin login (Email + Password)
router.post('/admin-login', adminLogin);

// Activation flow
router.post('/activate', activateAccount);
router.post('/set-password', setNewPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;
