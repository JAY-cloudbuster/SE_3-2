/**
 * @fileoverview Crop Controller for AgriSahayak Platform
 * 
 * This module contains the request handler functions for crop listing
 * operations, including creating new listings, retrieving a farmer's
 * own crops, and fetching all available crops for the marketplace.
 * 
 * All handlers require authentication via the protect middleware
 * (JWT token in Authorization header). The farmer's identity is
 * automatically attached to `req.user` by the auth middleware.
 * 
 * @module controllers/cropController
 * @requires express-async-handler - Async error wrapper for Express handlers
 * @requires models/Crop - Crop model for database operations
 * 
 * @see Epic 2, Story 2.4 - Add Crop Listing
 * @see Epic 2, Story 2.6 - View Crop Listings
 */

const asyncHandler = require('express-async-handler');
const Crop = require('../models/Crop');

/**
 * Create a New Crop Listing
 * 
 * Allows an authenticated farmer to create a new crop listing on the marketplace.
 * The farmer's user ID is automatically attached from the JWT token (via req.user).
 * If no location is provided, it defaults to the farmer's profile location.
 * 
 * @route POST /api/crops
 * @access Private - Requires JWT authentication (Farmer only)
 * 
 * @param {Object} req.body - Crop listing details
 * @param {String} req.body.name - Crop name (required, e.g., "Organic Wheat")
 * @param {Number} req.body.quantity - Quantity in kg, range 1-200 (required)
 * @param {Number} req.body.price - Price per kg in ₹, range 1-500 (required)
 * @param {String} req.body.quality - Quality grade: 'A', 'B', or 'C' (required)
 * @param {String} req.body.description - Optional description (max 500 chars)
 * @param {String} req.body.location - Crop location (optional, falls back to user location)
 * 
 * @returns {Object} 201 - The created crop document
 * @returns {Object} 400 - Missing required fields
 * 
 * @example
 * // Request (with Bearer token in Authorization header)
 * POST /api/crops
 * { "name": "Red Onions", "quantity": 50, "price": 35, "quality": "B", "location": "Nashik, MH" }
 * 
 * // Response
 * { "_id": "...", "name": "Red Onions", "farmer": "farmer_user_id", "quantity": 50, ... }
 * 
 * @see Epic 2, Story 2.4 - Add Crop Listing
 * @see CropForm.jsx - Frontend component that calls this endpoint
 */
const createCrop = asyncHandler(async (req, res) => {
    // Destructure crop details from the request body
    const { name, quantity, price, quality, description, location } = req.body;

    // Validate that all required fields are present
    if (!name || !quantity || !price || !quality) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Create the crop document in MongoDB
    // The farmer field is set from the authenticated user's ID (req.user.id)
    // provided by the authMiddleware's protect function
    const crop = await Crop.create({
        farmer: req.user.id,    // Automatically set from JWT-authenticated user
        name,
        quantity,
        price,
        quality,
        description,
        location: location || req.user.location // Fallback to farmer's profile location
    });

    // Return the created crop document with 201 Created status
    res.status(201).json(crop);
});

/**
 * Get Logged-in Farmer's Own Crop Listings
 * 
 * Retrieves all crop listings created by the currently authenticated farmer.
 * Results are sorted by creation date (newest first) for display in the
 * Farmer Dashboard's "My Harvest Inventory" table.
 * 
 * @route GET /api/crops/my
 * @access Private - Requires JWT authentication (Farmer only)
 * 
 * @returns {Array<Object>} 200 - Array of crop documents belonging to the farmer
 * 
 * @example
 * // Response
 * [
 *   { "_id": "...", "name": "Organic Wheat", "quantity": 500, "price": 24, ... },
 *   { "_id": "...", "name": "Red Onions", "quantity": 50, "price": 35, ... }
 * ]
 * 
 * @see Epic 2, Story 2.6 - View Crop Listings
 * @see CropList.jsx - Frontend component that displays these results
 */
const getMyCrops = asyncHandler(async (req, res) => {
    // Query crops belonging to the authenticated farmer, sorted newest first
    const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(crops);
});

/**
 * Get All Available Crops (Marketplace) with Search & Filter
 * 
 * Supports query params: search, minPrice, maxPrice, quality, 
 * location, category, sortBy, order.
 * 
 * @route GET /api/crops?search=wheat&minPrice=10&quality=A
 * @access Private
 * @see Epic 3 - Buyer Discovery & Exploration
 */
const getAllCrops = asyncHandler(async (req, res) => {
    const { search, minPrice, maxPrice, quality, location, category, sortBy, order } = req.query;

    // Base filter: only available crops
    const filter = { isSold: false, status: { $ne: 'Sold' } };

    // Name search (case-insensitive regex)
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Quality grade filter
    if (quality) {
        filter.quality = quality;
    }

    // Location filter (case-insensitive regex)
    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    // Category filter
    if (category) {
        filter.category = category;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy) {
        const sortOrder = order === 'asc' ? 1 : -1;
        sortOption = { [sortBy]: sortOrder };
    }

    const crops = await Crop.find(filter)
        .populate('farmer', 'name location trustScore isVerified')
        .sort(sortOption);

    res.status(200).json(crops);
});

/**
 * Update a Crop Listing
 * 
 * @route PUT /api/crops/:id
 * @access Private (Owner farmer only)
 */
const updateCrop = asyncHandler(async (req, res) => {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }

    // Verify the authenticated user owns this crop
    if (crop.farmer.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to update this crop');
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedCrop);
});

/**
 * Delete a Crop Listing
 * 
 * @route DELETE /api/crops/:id
 * @access Private (Owner farmer only)
 */
const deleteCrop = asyncHandler(async (req, res) => {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }

    // Verify the authenticated user owns this crop
    if (crop.farmer.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to delete this crop');
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Crop deleted successfully', id: req.params.id });
});

// Export controller functions for use in cropRoutes.js
module.exports = {
    createCrop,
    getMyCrops,
    getAllCrops,
    updateCrop,
    deleteCrop
};
