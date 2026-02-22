/**
 * @fileoverview Review Model for AgriSahayak Platform
 * 
 * Stores user reviews and ratings. Buyers can rate and review
 * farmers after completing an order, contributing to the
 * trust score calculation.
 * 
 * @module models/Review
 * @requires mongoose
 * @see Epic 7, Story 7.6 - Rate & Review
 * @see Epic 7, Story 7.10 - Trust Score Calculation
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    /** User who wrote the review */
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /** User being reviewed (the farmer) */
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /** Rating score from 1-5 stars */
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },

    /** Written review comment */
    comment: {
        type: String,
        maxlength: [500, 'Comment cannot exceed 500 characters'],
        trim: true
    },

    /** Reference to the order this review is associated with */
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
}, { timestamps: true });

// Prevent duplicate reviews: one review per reviewer-order pair
reviewSchema.index({ reviewer: 1, relatedOrder: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
