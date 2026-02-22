/**
 * @fileoverview Price Routes for AgriSahayak Platform
 * 
 * All routes protected with JWT authentication.
 * Mounted at /api/prices in server.js.
 * 
 * @module routes/priceRoutes
 * @see Epic 5 - Price Transparency
 */

const express = require('express');
const router = express.Router();
const {
    getCurrentPrices,
    getHistoricalTrends,
    getRecommendation
} = require('../controllers/priceController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/current', protect, getCurrentPrices);
router.get('/trends', protect, getHistoricalTrends);
router.get('/recommend', protect, getRecommendation);

module.exports = router;
