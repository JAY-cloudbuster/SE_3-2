const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getFarmerProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/me').get(protect, getProfile);
router.route('/profile').put(protect, updateProfile);
router.route('/:farmerId').get(protect, getFarmerProfile);

module.exports = router;