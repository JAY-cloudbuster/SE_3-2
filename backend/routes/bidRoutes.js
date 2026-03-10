const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { placeBid, getBidsByListing, updateBidStatus } = require('../controllers/bidController');

router.post('/place', protect, placeBid);
router.get('/:listingId', protect, getBidsByListing);
router.put('/:bidId/status', protect, updateBidStatus);

module.exports = router;
