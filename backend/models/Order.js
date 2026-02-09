const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    items: [
        {
            crop: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Crop',
                required: true
            },
            name: String,
            quantity: Number,
            pricePerKg: Number,
            total: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: [0, 'Shipping cost cannot be negative']
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
