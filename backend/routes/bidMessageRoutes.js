const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getBidsForListing,
    getMessagesForListing,
    sendMessage,
    getFarmerInbox,
} = require('../controllers/bidMessageController');

// ── Bids ──────────────────────────────────────────────────
router.get('/bids/:listingId', protect, getBidsForListing);

// ── Messages ──────────────────────────────────────────────
router.get('/messages/:listingId', protect, getMessagesForListing);
router.post('/messages', protect, sendMessage);          // REST send (main path)

// ── Farmer Inbox ──────────────────────────────────────────
router.get('/inbox', protect, getFarmerInbox);           // Grouped conversations for farmer

module.exports = router;
