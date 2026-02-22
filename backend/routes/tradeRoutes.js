/**
 * @fileoverview Trade Routes for AgriSahayak Platform
 * 
 * All routes protected with JWT authentication.
 * Mounted at /api/trade in server.js.
 * 
 * @module routes/tradeRoutes
 * @see Epic 4 - Trade & Auction
 */

const express = require('express');
const router = express.Router();
const {
    placeBid,
    startNegotiation,
    sendOffer,
    acceptNegotiation,
    rejectNegotiation,
    createOrder,
    getOrders,
    updateOrderStatus
} = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');

// Bidding
router.post('/bid', protect, placeBid);

// Negotiations
router.post('/negotiation/start', protect, startNegotiation);
router.post('/negotiation/offer', protect, sendOffer);
router.put('/negotiation/:id/accept', protect, acceptNegotiation);
router.put('/negotiation/:id/reject', protect, rejectNegotiation);

// Orders
router.post('/orders', protect, createOrder);
router.get('/orders', protect, getOrders);
router.put('/orders/:id', protect, updateOrderStatus);

module.exports = router;
