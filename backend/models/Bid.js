const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Bid amount cannot be negative'],
        max: [10000, 'Bid cannot exceed ₹10,000/quintal']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Expired'],
        default: 'Pending'
    },
    acceptedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true });

bidSchema.index({ listingId: 1, buyerId: 1 });
bidSchema.index({ farmerId: 1, status: 1 });

module.exports = mongoose.model('Bid', bidSchema);
