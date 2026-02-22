/**
 * @fileoverview MarketPrice Model for AgriSahayak Platform
 * 
 * Stores historical market price data for commodities across 
 * different markets. Used by the Price Transparency feature (Epic 5)
 * to show price trends, daily prices, and pricing recommendations.
 * 
 * @module models/MarketPrice
 * @requires mongoose
 * @see Epic 5, Story 5.1 - Current Crop Prices
 * @see Epic 5, Story 5.3 - Price Trend Charts
 */

const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    /** Commodity name (e.g., "Wheat", "Rice", "Onion") */
    commodity: {
        type: String,
        required: [true, 'Commodity name is required'],
        trim: true
    },

    /** Market location (e.g., "Delhi", "Mumbai APMC", "Pune") */
    market: {
        type: String,
        required: [true, 'Market name is required'],
        trim: true
    },

    /** Date of the price record */
    date: {
        type: Date,
        required: [true, 'Date is required']
    },

    /** Minimum price recorded for the day (₹/quintal) */
    minPrice: {
        type: Number,
        required: true,
        min: 0
    },

    /** Maximum price recorded for the day (₹/quintal) */
    maxPrice: {
        type: Number,
        required: true,
        min: 0
    },

    /** Modal (most common) price for the day (₹/quintal) */
    modalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

// Compound index for efficient querying by commodity + date
marketPriceSchema.index({ commodity: 1, date: -1 });
marketPriceSchema.index({ commodity: 1, market: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
