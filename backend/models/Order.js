/**
 * @fileoverview Order Model Definition for AgriSahayak Platform
 * 
 * This module defines the Mongoose schema and model for orders placed
 * on the platform. An order is created when a buyer completes a purchase
 * (either via "Buy Now" or an accepted negotiation).
 * 
 * Each order tracks the buyer, farmer, purchased items (crops),
 * payment information, shipping details, and order lifecycle status.
 * 
 * @module models/Order
 * @requires mongoose - MongoDB object modeling tool
 * 
 * @see Epic 4, Story 4.1 - Fixed-Price Purchase
 * @see Epic 4, Story 4.7 - Order Confirmation
 * @see Epic 4, Story 4.8 - Order Status Updates
 */

const mongoose = require('mongoose');

/**
 * Order Schema Definition
 * 
 * Represents a completed transaction between a buyer and a farmer.
 * Contains line items (crops purchased), payment details,
 * shipping information, and status tracking.
 * 
 * Includes automatic timestamp tracking (createdAt, updatedAt).
 */
const orderSchema = new mongoose.Schema({
    /**
     * Reference to the User (buyer) who placed the order.
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref User
     * @required
     */
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * Reference to the User (farmer) who is fulfilling the order.
     * Responsible for shipping the crops and updating order status.
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
     * Array of crop items included in this order.
     * Each item references the original Crop listing and stores
     * a snapshot of the purchased details (name, quantity, price).
     * 
     * The `total` field for each item = quantity × pricePerKg.
     * 
     * @type {Array<Object>}
     */
    items: [
        {
            /** Reference to the original Crop listing document */
            crop: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Crop',
                required: true
            },
            /** Snapshot of the crop name at time of purchase */
            name: String,
            /** Quantity purchased (in kg) */
            quantity: Number,
            /** Price per kilogram at time of purchase (₹) */
            pricePerKg: Number,
            /** Line item total: quantity × pricePerKg (₹) */
            total: Number
        }
    ],

    /**
     * Grand total amount for the order in Indian Rupees (₹).
     * Sum of all item totals plus shipping cost.
     * Cannot be negative.
     * @type {Number}
     * @required
     * @min 0
     */
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },

    /**
     * Shipping/delivery cost in Indian Rupees (₹).
     * Calculated based on distance or flat rate.
     * Defaults to 0 (free shipping).
     * @type {Number}
     * @default 0
     * @min 0
     */
    shippingCost: {
        type: Number,
        default: 0,
        min: [0, 'Shipping cost cannot be negative']
    },

    /**
     * Payment method selected by the buyer at checkout.
     * - card: Credit/debit card payment
     * - upi: Unified Payments Interface (e.g., Google Pay, PhonePe)
     * - cod: Cash on Delivery
     * @type {String}
     * @enum {('card'|'upi'|'cod')}
     * @required
     */
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cod'],
        required: true
    },

    /**
     * Current status of the payment transaction.
     * - pending: Payment not yet completed (e.g., COD orders)
     * - paid: Payment successfully received
     * - failed: Payment attempt failed
     * @type {String}
     * @enum {('pending'|'paid'|'failed')}
     * @default 'pending'
     */
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    /**
     * Current status of the order fulfillment lifecycle.
     * Updated by the farmer through the order management dashboard.
     * 
     * Flow: Pending → Processing → Shipped → Delivered
     * Alternative: Pending → Cancelled (if order is cancelled)
     * 
     * Tracked in the OrderTrackingCard.jsx component for buyer visibility.
     * @type {String}
     * @enum {('Pending'|'Processing'|'Shipped'|'Delivered'|'Cancelled')}
     * @default 'Pending'
     * @see Epic 4, Story 4.8 - Order Status Updates
     */
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    /**
     * Delivery address provided by the buyer during order confirmation.
     * Editable on the OrderConfirmationPage before final submission.
     * @type {String}
     * @required
     * @see Epic 4, Story 4.7 - Order Confirmation
     */
    shippingAddress: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the compiled Mongoose model for use in controllers and routes
module.exports = mongoose.model('Order', orderSchema);
