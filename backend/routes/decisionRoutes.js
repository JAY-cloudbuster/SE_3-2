/**
 * @fileoverview Decision Routes — Module 5: Price Transparency
 *
 * Mounted at /api/decision in server.js.
 *
 * Endpoints:
 *   GET /api/decision?crop=Wheat — AI recommendation + chart data
 *   GET /api/decision/commodities — available crop/state lists
 *
 * @module routes/decisionRoutes
 */

const express = require('express');
const router = express.Router();
const { getDecision, getCommodities } = require('../controllers/decisionController');
const { protect } = require('../middlewares/authMiddleware');

/** GET /api/decision?crop=xxx */
router.get('/', protect, getDecision);

/** GET /api/decision/commodities */
router.get('/commodities', protect, getCommodities);

module.exports = router;
