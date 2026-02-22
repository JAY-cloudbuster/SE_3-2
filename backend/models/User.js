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
    /**
     * User's phone number - serves as the primary login identifier.
     * Must be exactly 10 digits (Indian phone number format).
     * Enforced as unique to prevent duplicate registrations.
     * @type {String}
     * @required
     * @unique
     */
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },

    /**
     * User's email address (optional).
     * The `sparse: true` index allows multiple users to have null/undefined email
     * while still enforcing uniqueness for users who do provide an email.
     * @type {String}
     * @optional
     */
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true // Allows null/unique - permits multiple null values in unique index
    },

    /**
     * User's hashed password.
     * The `select: false` option ensures the password field is excluded from
     * query results by default. Use `.select('+password')` to explicitly include it
     * (e.g., during login authentication).
     * 
     * Raw password is hashed automatically by the pre-save middleware below.
     * @type {String}
     * @required
     * @minlength 6
     */
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Excluded from queries by default for security
    },

    /**
     * User's role on the platform, determining their access level and UI experience.
     * - FARMER: Can create crop listings, manage harvests, participate in auctions
     * - BUYER: Can browse marketplace, purchase crops, place bids
     * - ADMIN: Can access moderation dashboard, approve verifications
     * 
     * Defaults to 'FARMER' if not specified during registration.
     * @type {String}
     * @enum {('FARMER'|'BUYER'|'ADMIN')}
     * @default 'FARMER'
     */
    role: {
        type: String,
        enum: ['FARMER', 'BUYER', 'ADMIN'],
        default: 'FARMER'
    },

    /**
     * User's display name shown across the platform (profile, listings, chat).
     * @type {String}
     * @optional
     */
    name: {
        type: String,
        trim: true
    },

    /**
     * User's preferred language code for UI translation.
     * Supported languages include major Indian languages.
     * Used by the TranslationContext on the frontend to render
     * the interface in the user's chosen language.
     * 
     * Language codes follow ISO 639-1 standard:
     * en=English, hi=Hindi, ta=Tamil, bn=Bengali, mr=Marathi,
     * gu=Gujarati, kn=Kannada, ml=Malayalam, pa=Punjabi,
     * or=Odia, as=Assamese, ur=Urdu, te=Telugu
     * 
     * @type {String}
     * @default 'en'
     * @see Epic 1, Story 1.3 - Select Preferred Language
     * @see Epic 6, Story 6.1 - Persist Interface Language
     */
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'ta', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'te']
    },

    /**
     * Filename of the user's selected avatar image.
     * Users choose from a set of predefined avatar images (no file upload).
     * The frontend resolves this to a full image path for display.
     * @type {String}
     * @default 'avatar_1.png'
     * @see Epic 1, Story 1.4 - Set Profile Picture
     */
    avatarUrl: {
        type: String,
        default: 'avatar_1.png'
    },

    /**
     * User's location as a free-text string (e.g., "Pune, Maharashtra").
     * Used as a default location when creating crop listings
     * and for display on user profiles.
     * @type {String}
     * @default ''
     * @see Epic 1, Story 1.5 - Add Location
     */
    location: {
        type: String,
        default: ''
    },

    /**
     * Numerical trust/reputation score for the user (0-100 scale).
     * Intended to be computed from:
     * - Verification status (30%)
     * - Ratings received (40%)
     * - Dispute history (20%)
     * - Platform activity (10%)
     * 
     * Currently defaults to 100 for new users. Backend calculation
     * logic is planned for future implementation.
     * @type {Number}
     * @default 100
     * @see Epic 7, Story 7.10 - Trust Score Calculation
     */
    trustScore: {
        type: Number,
        default: 100
    },

    /**
     * Whether the user has been verified by an admin.
     * Verified users get a badge and higher trust score.
     * @type {Boolean}
     * @default false
     * @see Epic 7, Story 7.1 - Request Verification
     */
    isVerified: {
        type: Boolean,
        default: false
    },

    /**
     * Whether the user has been banned by an admin.
     * Banned users cannot login or perform any actions.
     * @type {Boolean}
     * @default false
     * @see Epic 7, Story 7.7 - Moderation Dashboard
     */
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

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
