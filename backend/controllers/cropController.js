const asyncHandler = require('express-async-handler');
const Crop = require('../models/Crop');

// @desc    Create new crop listing
// @route   POST /api/crops
// @access  Private (Farmer only)
const createCrop = asyncHandler(async (req, res) => {
    const { name, quantity, price, quality, description, location } = req.body;

    if (!name || !quantity || !price || !quality) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const crop = await Crop.create({
        farmer: req.user.id,
        name,
        quantity,
        price,
        quality,
        description,
        location: location || req.user.location // Default to user location if not provided
    });

    res.status(201).json(crop);
});

// @desc    Get logged in farmer's crops
// @route   GET /api/crops/my
// @access  Private (Farmer only)
const getMyCrops = asyncHandler(async (req, res) => {
    const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(crops);
});

// @desc    Get all crops (Marketplace)
// @route   GET /api/crops
// @access  Private
const getAllCrops = asyncHandler(async (req, res) => {
    // Basic implementation for marketplace
    // Filter out own crops so farmers don't buy their own stuff? Or just show all.
    // Showing all for now, maybe filter by isSold later.
    const crops = await Crop.find({ isSold: false })
        .populate('farmer', 'name location trustScore')
        .sort({ createdAt: -1 });
    res.status(200).json(crops);
});

module.exports = {
    createCrop,
    getMyCrops,
    getAllCrops
};
