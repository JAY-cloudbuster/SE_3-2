const express = require('express');
const router = express.Router();
const { createCrop, getMyCrops, getAllCrops } = require('../controllers/cropController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.post('/', protect, createCrop);
router.get('/my', protect, getMyCrops);
router.get('/', protect, getAllCrops);

module.exports = router;
