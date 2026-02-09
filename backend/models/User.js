const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true // Allows null/unique
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['FARMER', 'BUYER', 'ADMIN'],
        default: 'FARMER'
    },
    name: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'ta', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'te']
    },
    avatarUrl: {
        type: String,
        default: 'avatar_1.png'
    },
    location: {
        type: String,
        default: ''
    },
    trustScore: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.hash = await bcrypt.hash(this.password, salt);
    this.password = this.hash;
    next();
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
