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
const { createCrop, getMyCrops, getAllCrops, updateCrop, deleteCrop } = require('../controllers/cropController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require JWT authentication

/** POST /api/crops - Create a new crop listing */
router.post('/', protect, createCrop);

/** GET /api/crops/my - Get farmer's own listings */
router.get('/my', protect, getMyCrops);

/** GET /api/crops - Get all marketplace crops (with search/filter) */
router.get('/', protect, getAllCrops);

/** PUT /api/crops/:id - Update a crop listing (owner only) */
router.put('/:id', protect, updateCrop);

/** DELETE /api/crops/:id - Delete a crop listing (owner only) */
router.delete('/:id', protect, deleteCrop);

module.exports = router;
