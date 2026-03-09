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

/** GET /api/decision?crop=xxx */
router.get('/', getDecision);

/** GET /api/decision/commodities */
router.get('/commodities', getCommodities);

module.exports = router;
