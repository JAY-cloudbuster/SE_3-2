/**
 * @fileoverview Crop Model Definition for AgriSahayak Platform
 * 
 * This module defines the Mongoose schema and model for Crop listings.
 * Farmers create crop listings to advertise their harvests to buyers
 * on the marketplace. Each crop is linked to a farmer (User) via a
 * reference ObjectId.
 * 
 * The schema includes validation rules for quantity (1-200 kg),
 * price (₹1-₹500/kg), and quality grades (A/B/C).
 * 
 * @module models/Crop
 * @requires mongoose - MongoDB object modeling tool
 * 
 * @see Epic 2, Story 2.4 - Add Crop Listing
 * @see Epic 2, Story 2.6 - View Crop Listings
 * @see Epic 2, Story 2.9 - Manage Crop Availability (isSold field)
 */

const mongoose = require('mongoose');

/**
 * Crop Schema Definition
 * 
 * Represents a single crop listing on the AgriSahayak marketplace.
 * Each listing belongs to one farmer and contains details about
 * the crop's name, quantity, pricing, quality grade, and location.
 * 
 * Includes automatic timestamp tracking (createdAt, updatedAt)
 * via the { timestamps: true } option.
 */
const cropSchema = new mongoose.Schema({
    /**
     * Display name of the crop (e.g., "Organic Wheat", "Red Onions").
     * Shown in the marketplace listing cards and search results.
     * @type {String}
     * @required
     */
    name: {
        type: String,
        required: [true, 'Crop name is required'],
        trim: true
    },

    /**
     * Reference to the User (farmer) who created this crop listing.
     * This establishes a one-to-many relationship: one farmer can
     * have multiple crop listings.
     * Populated in marketplace queries to show farmer name, location, and trust score.
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref User
     * @required
     */
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * Available quantity of the crop in kilograms.
     * Restricted to 1-200 kg range per listing to ensure
     * reasonable marketplace listings.
     * Voice input (VoiceInput.jsx) can be used to fill this field.
     * @type {Number}
     * @required
     * @min 1
     * @max 200
     * @see Epic 6, Story 6.5 - Voice Input for Numbers
     */
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1 kg'],
        max: [200, 'Quantity cannot exceed 200 kg']
    },

    /**
     * Price per kilogram in Indian Rupees (₹).
     * Restricted to ₹1-₹500/kg range to prevent unreasonable pricing.
     * Displayed using Indian number formatting (₹1,00,000) via formatCurrency().
     * @type {Number}
     * @required
     * @min 1
     * @max 500
     * @see Epic 6, Story 6.10 - Indian Number Formatting
     */
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least ₹1'],
        max: [500, 'Price cannot exceed ₹500/kg']
    },

    /**
     * Quality grade classification for the crop.
     * - Grade A: Premium quality, highest standard
     * - Grade B: Standard quality, acceptable
     * - Grade C: Economy grade, lower quality
     * 
     * Displayed as colored badges in the UI (green/yellow/grey).
     * @type {String}
     * @enum {('A'|'B'|'C')}
     * @required
     */
    quality: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: [true, 'Quality grade is required']
    },

    /**
     * Optional text description providing additional details about the crop.
     * Farmers can describe growing conditions, organic status, etc.
     * Limited to 500 characters to maintain concise listings.
     * @type {String}
     * @optional
     * @maxlength 500
     */
    description: {
        type: String,
        maxlength: 500
    },

    /**
     * Crop category for filtering and search.
     * @type {String}
     * @enum {('grain'|'vegetable'|'fruit'|'spice'|'pulse'|'oilseed'|'other')}
     * @default 'other'
     */
    category: {
        type: String,
        enum: ['grain', 'vegetable', 'fruit', 'spice', 'pulse', 'oilseed', 'other'],
        default: 'other'
    },

    /**
     * Filename/path of the crop's display image.
     * Currently stores a string path (no actual file upload implemented).
     * Defaults to a placeholder image for listings without photos.
     * @type {String}
     * @default 'default_crop.jpg'
     * @see Epic 2, Story 2.5 - Upload Crop Media (planned)
     */
    image: {
        type: String,
        default: 'default_crop.jpg'
    },

    /**
     * Geographic location of the crop (e.g., "Punawale, Pune" or "Nashik, MH").
     * Displayed with a MapPin icon in the crop listing table.
     * Falls back to the farmer's profile location if not provided during creation.
     * Also used in the buyer's MarketMap component for geographical display.
     * @type {String}
     * @required
     * @see Epic 3, Story 3.4 - Interactive Crop Map
     */
    location: {
        type: String,
        required: true
    },

    /**
     * Boolean flag indicating whether the crop has been sold.
     * When true, the crop is excluded from marketplace queries
     * (filtered by `isSold: false` in getAllCrops controller).
     * 
     * Note: Future implementation will expand this to a multi-status
     * enum (Available/OutOfStock/Sold) per Epic 2, Story 2.9.
     * @type {Boolean}
     * @default false
     * @see Epic 2, Story 2.9 - Manage Crop Availability
     */
    isSold: {
        type: Boolean,
        default: false
    },

    /**
     * Detailed availability status.
     * - Available: Listed and available for purchase
     * - OutOfStock: Temporarily unavailable
     * - Sold: Completely sold out
     * - Draft: Not yet published
     * @type {String}
     * @enum {('Available'|'OutOfStock'|'Sold'|'Draft')}
     * @default 'Available'
     */
    status: {
        type: String,
        enum: ['Available', 'OutOfStock', 'Sold', 'Draft'],
        default: 'Available'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the compiled Mongoose model for use in controllers and routes
module.exports = mongoose.model('Crop', cropSchema);
