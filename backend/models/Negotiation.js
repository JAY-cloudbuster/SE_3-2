/**
 * @fileoverview Negotiation Model Definition for AgriSahayak Platform
 * 
 * This module defines the Mongoose schema and model for price negotiations
 * between buyers and farmers. Negotiations are tied to specific crop listings
 * and function as a chat-like thread where both parties can exchange
 * text messages and price offers.
 * 
 * A negotiation has a lifecycle: active → accepted/rejected/cancelled.
 * When accepted, a finalPrice is set and an order can be generated.
 * 
 * @module models/Negotiation
 * @requires mongoose - MongoDB object modeling tool
 * 
 * @see Epic 4, Story 4.4 - Negotiate Price
 * @see Epic 4, Story 4.5 - Accept Negotiation
 */

const mongoose = require('mongoose');

/**
 * Negotiation Schema Definition
 * 
 * Represents a price negotiation thread between a buyer and a farmer
 * for a specific crop listing. Contains an array of messages that
 * can be either plain text or price offers.
 * 
 * Includes automatic timestamp tracking (createdAt, updatedAt).
 */
const negotiationSchema = new mongoose.Schema({
    /**
     * Reference to the Crop being negotiated for.
     * Links the negotiation to a specific marketplace listing.
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref Crop
     * @required
     */
    crop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },

    /**
     * Reference to the User (buyer) who initiated the negotiation.
     * The buyer sends the first offer/message to start the thread.
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
     * Reference to the User (farmer) who owns the crop listing.
     * The farmer responds to offers and can accept/reject/counter.
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
     * Current status of the negotiation lifecycle.
     * - active: Negotiation is ongoing, messages can be exchanged
     * - accepted: Farmer accepted the buyer's offer (finalPrice is set)
     * - rejected: Farmer rejected the negotiation
     * - cancelled: Either party cancelled the negotiation
     * @type {String}
     * @enum {('active'|'accepted'|'rejected'|'cancelled')}
     * @default 'active'
     */
    status: {
        type: String,
        enum: ['active', 'accepted', 'rejected', 'cancelled'],
        default: 'active'
    },

    /**
     * The agreed-upon price when negotiation status becomes 'accepted'.
     * This is the price that will be used to generate the order.
     * Remains null/undefined while negotiation is still active.
     * @type {Number}
     * @optional
     */
    finalPrice: {
        type: Number
    },

    /**
     * Array of messages exchanged between buyer and farmer.
     * Messages can be plain text conversations or formal price offers.
     * Displayed in the NegotiationChat.jsx component as a chat timeline.
     * 
     * Each message contains:
     * - sender: Who sent the message (User reference)
     * - content: The text content of the message
     * - type: 'text' for regular messages, 'offer' for price proposals
     * - offerAmount: The proposed price (only for 'offer' type messages)
     * - timestamp: When the message was sent
     * 
     * @type {Array<Object>}
     * @see Epic 4, Story 4.4 - Chat-like negotiation interface
     */
    messages: [
        {
            /** Reference to the User who sent this message */
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            /** Text content of the message or offer description */
            content: {
                type: String,
                required: true
            },
            /**
             * Message type discriminator:
             * - 'text': Regular chat message
             * - 'offer': A formal price proposal with an offerAmount
             */
            type: {
                type: String,
                enum: ['text', 'offer'],
                default: 'text'
            },
            /** The proposed price amount (only present when type is 'offer') */
            offerAmount: Number,
            /** Timestamp of when this message was sent */
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],

    /**
     * Timestamp of the most recent activity in this negotiation.
     * Updated whenever a new message is added or status changes.
     * Used for sorting negotiations by recency in the Trade Dashboard.
     * @type {Date}
     * @default Date.now
     */
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the compiled Mongoose model for use in controllers and routes
module.exports = mongoose.model('Negotiation', negotiationSchema);
