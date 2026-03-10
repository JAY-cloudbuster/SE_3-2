const express = require('express');
const router = express.Router();
const { rateFarmer } = require('../controllers/ratingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/:farmerId').post(protect, rateFarmer);

module.exports = router;