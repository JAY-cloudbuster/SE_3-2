const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getBidsForListing, getMessagesForListing } = require('../controllers/bidMessageController');

router.get('/bids/:listingId', protect, getBidsForListing);
router.get('/messages/:listingId', protect, getMessagesForListing);

module.exports = router;
