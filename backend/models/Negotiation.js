const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
    crop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'accepted', 'rejected', 'cancelled'],
        default: 'active'
    },
    finalPrice: {
        type: Number
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            type: {
                type: String, // 'text' or 'offer'
                enum: ['text', 'offer'],
                default: 'text'
            },
            offerAmount: Number,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Negotiation', negotiationSchema);
