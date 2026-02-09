const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Crop name is required'],
        trim: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1 kg'],
        max: [200, 'Quantity cannot exceed 200 kg']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least ₹1'],
        max: [500, 'Price cannot exceed ₹500/kg']
    },
    quality: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: [true, 'Quality grade is required']
    },
    description: {
        type: String,
        maxlength: 500
    },
    image: {
        type: String,
        default: 'default_crop.jpg'
    },
    location: {
        type: String,
        required: true
    },
    isSold: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
