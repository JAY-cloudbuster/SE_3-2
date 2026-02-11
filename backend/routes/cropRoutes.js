/**
 * @fileoverview Crop Routes for AgriSahayak Platform
 * 
 * This module defines the Express route mappings for crop listing endpoints.
 * All routes are protected by JWT authentication middleware,
 * requiring a valid Bearer token in the Authorization header.
 * 
 * All crop routes are mounted under the /api/crops prefix
 * (configured in server.js: `app.use('/api/crops', require('./routes/cropRoutes'))`).
 * 
 * Available Endpoints:
 * - POST /api/crops    - Create a new crop listing (Farmer only)
 * - GET  /api/crops/my - Get the logged-in farmer's own listings
 * - GET  /api/crops    - Get all available crops for marketplace
 * 
 * @module routes/cropRoutes
 * @requires express - Express framework for routing
 * @requires controllers/cropController - Handler functions for crop operations
 * @requires middlewares/authMiddleware - JWT authentication middleware
 * 
 * @see Epic 2, Story 2.4 - Add Crop Listing
 * @see Epic 2, Story 2.6 - View Crop Listings
 */

const express = require('express');
const router = express.Router();
const { createCrop, getMyCrops, getAllCrops } = require('../controllers/cropController');
const { protect } = require('../middlewares/authMiddleware');

// ============================================================
// All routes below require JWT authentication (protect middleware)
// The protect middleware verifies the JWT and attaches req.user
// ============================================================

/**
 * @route POST /api/crops
 * @description Create a new crop listing. Farmer's ID is automatically
 *              attached from the JWT token. Validates required fields.
 * @access Private - Requires valid JWT token (intended for Farmers)
 */
router.post('/', protect, createCrop);

/**
 * @route GET /api/crops/my
 * @description Retrieve all crop listings created by the authenticated farmer.
 *              Results sorted by newest first. Used by FarmerDashboard.
 * @access Private - Requires valid JWT token (Farmer only)
 */
router.get('/my', protect, getMyCrops);

/**
 * @route GET /api/crops
 * @description Retrieve all available (unsold) crops for the marketplace.
 *              Populates farmer info (name, location, trustScore).
 *              Results sorted by newest first.
 * @access Private - Requires valid JWT token (any authenticated user)
 */
router.get('/', protect, getAllCrops);

module.exports = router;
