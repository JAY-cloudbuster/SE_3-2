/**
 * @fileoverview User Model Definition for AgriSahayak Platform
 * 
 * This module defines the Mongoose schema and model for the User entity.
 * It handles user registration data for both FARMER and BUYER roles,
 * including authentication fields (phone, password), profile fields
 * (name, avatar, location), and platform-specific fields (language, trustScore).
 * 
 * Password hashing is handled automatically via a Mongoose pre-save middleware
 * using the bcryptjs library, ensuring passwords are never stored in plain text.
 * 
 * @module models/User
 * @requires mongoose - MongoDB object modeling tool
 * @requires bcryptjs - Library for hashing and comparing passwords
 * 
 * @see Epic 1 (Stories 1.1, 1.3, 1.4, 1.5, 1.7) - User Onboarding & Identity
 * @see Epic 7 (Story 7.10) - Trust Score field
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * 
 * Represents a registered user on the AgriSahayak platform.
 * Users can be Farmers (who list crops), Buyers (who purchase crops),
 * or Admins (who moderate the platform).
 * 
 * The schema includes automatic timestamp tracking (createdAt, updatedAt)
 * via the { timestamps: true } option.
 */
const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
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
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isBanned: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: false
    },

    isFirstLogin: {
        type: Boolean,
        default: true
    },

    otp: {
        type: String,
        select: false
    },

    otpExpiry: {
        type: Date,
        select: false
    },

    savedAddresses: {
        type: [String],
        default: []
    }
}, { timestamps: true });

/**
 * Pre-save Middleware: Password Hashing
 * 
 * Automatically hashes the user's password before saving to MongoDB.
 * Uses bcryptjs with a salt factor of 10 for secure one-way hashing.
 * 
 * This middleware only runs when the password field has been modified
 * (checked via `this.isModified('password')`), preventing re-hashing
 * on unrelated profile updates.
 * 
 * @function preSaveHook
 * @param {Function} next - Mongoose middleware next() callback
 * @see Epic 1, Story 1.7 - Password Encryption
 */
userSchema.pre('save', async function (next) {
    // Skip hashing if the password field hasn't changed (e.g., profile update)
    if (!this.isModified('password')) return next();

    // Generate a cryptographic salt with 10 rounds of processing
    const salt = await bcrypt.genSalt(10);

    // Hash the plain-text password using the generated salt
    this.hash = await bcrypt.hash(this.password, salt);

    // Replace the plain-text password with the hashed version
    this.password = this.hash;

    next();
});

/**
 * Instance Method: Match/Verify Password
 * 
 * Compares a plain-text password (entered during login) against
 * the stored bcrypt hash. Returns true if they match, false otherwise.
 * 
 * Uses bcrypt.compare() which internally extracts the salt from the
 * stored hash and applies it to the entered password for comparison.
 * 
 * @method matchPassword
 * @param {String} enteredPassword - The plain-text password to verify
 * @returns {Promise<Boolean>} True if the password matches, false otherwise
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the compiled Mongoose model for use in controllers and routes
module.exports = mongoose.model('User', userSchema);
