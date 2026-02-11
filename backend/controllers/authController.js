/**
 * @fileoverview Authentication Controller for AgriSahayak Platform
 * 
 * This module contains the request handler functions for user authentication,
 * including registration (sign-up) and login endpoints. It generates JWT tokens
 * for authenticated sessions and handles input validation.
 * 
 * All handlers use express-async-handler to automatically catch async errors
 * and pass them to the Express error handling middleware.
 * 
 * @module controllers/authController
 * @requires models/User - User model for database operations
 * @requires jsonwebtoken - JWT generation for session management
 * @requires express-async-handler - Async error wrapper for Express handlers
 * 
 * @see Epic 1, Story 1.1 - Register as Farmer/Buyer
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/**
 * Generate a JSON Web Token (JWT) for user authentication.
 * 
 * Creates a signed JWT containing the user's MongoDB ObjectId as payload.
 * The token uses the secret key from environment variable JWT_SECRET
 * and expires after 30 days.
 * 
 * This token is sent to the client on successful login/register and
 * must be included in the Authorization header (as Bearer token)
 * for all subsequent protected API requests.
 * 
 * @function generateToken
 * @param {String} id - The user's MongoDB ObjectId (_id)
 * @returns {String} Signed JWT string
 * @see Epic 1, Story 1.2 (Task 3) - JWT generation on successful login
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token valid for 30 days
    });
};

/**
 * Register a New User
 * 
 * Creates a new user account in the database with the provided details.
 * The password is automatically hashed by the User model's pre-save middleware
 * (see User.js). On success, returns the created user data along with
 * a JWT token for immediate authentication.
 * 
 * @route POST /api/auth/register
 * @access Public - No authentication required
 * 
 * @param {Object} req.body - Registration payload
 * @param {String} req.body.phone - 10-digit phone number (required, must be unique)
 * @param {String} req.body.password - Password, minimum 6 characters (required)
 * @param {String} req.body.role - User role: 'FARMER' or 'BUYER' (optional, defaults to FARMER)
 * @param {String} req.body.language - Preferred language code, e.g., 'hi' (optional, defaults to 'en')
 * @param {String} req.body.avatarUrl - Selected avatar filename (optional, defaults to 'avatar_1.png')
 * @param {String} req.body.name - User's display name (optional)
 * 
 * @returns {Object} 201 - Success response with token and user data
 * @returns {Object} 400 - Missing required fields or user already exists
 * 
 * @example
 * // Request body
 * { "phone": "9876543210", "password": "secure123", "role": "FARMER", "language": "hi" }
 * 
 * // Response
 * { "success": true, "token": "eyJhb...", "user": { "_id": "...", "phone": "9876543210", "role": "FARMER" } }
 * 
 * @see Epic 1, Story 1.1 - Register as Farmer/Buyer
 */
const registerUser = asyncHandler(async (req, res) => {
    // Destructure registration fields from request body
    const { phone, password, role, language, avatarUrl, name } = req.body;

    // Validate that required fields are present
    if (!phone || !password) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check if a user with this phone number already exists in the database
    const userExists = await User.findOne({ phone });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Password hashing is handled automatically by the User model's
    // pre-save middleware (bcryptjs with 10 salt rounds)

    // Create the new user document in MongoDB
    const user = await User.create({
        phone,
        password,   // Will be hashed by pre-save middleware
        role,       // 'FARMER' or 'BUYER' (defaults to 'FARMER')
        language,   // Language preference code (defaults to 'en')
        avatarUrl,  // Avatar image filename (defaults to 'avatar_1.png')
        name        // Display name
    });

    // If user was created successfully, respond with user data and JWT token
    if (user) {
        res.status(201).json({
            success: true,
            token: generateToken(user._id), // Generate JWT for immediate auth
            user: {
                _id: user._id,
                phone: user.phone,
                role: user.role,
                name: user.name,
                language: user.language
            }
        });
    } else {
        // This catch handles unexpected creation failures
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/**
 * Authenticate/Login User
 * 
 * Authenticates a user by verifying their phone number and password.
 * Looks up the user by phone, then uses bcrypt to compare the entered
 * password against the stored hash. On success, returns user data
 * with a fresh JWT token.
 * 
 * Note: The `.select('+password')` is required because the password
 * field has `select: false` in the User schema (excluded by default).
 * 
 * @route POST /api/auth/login
 * @access Public - No authentication required
 * 
 * @param {Object} req.body - Login credentials
 * @param {String} req.body.phone - 10-digit phone number
 * @param {String} req.body.password - Plain-text password to verify
 * 
 * @returns {Object} 200 - Success response with token and user data (including role for redirect)
 * @returns {Object} 401 - Invalid phone number or password
 * 
 * @example
 * // Request body
 * { "phone": "9876543210", "password": "secure123" }
 * 
 * // Response (used by frontend for role-based redirect)
 * { "success": true, "token": "eyJhb...", "user": { "role": "FARMER" } }
 * 
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 * @see Epic 1, Story 1.8 - Role-Based Redirect (response includes role)
 */
const loginUser = asyncHandler(async (req, res) => {
    // Extract login credentials from request body
    const { phone, password } = req.body;

    // Find user by phone number and explicitly include the password field
    // (.select('+password') overrides the schema's `select: false` setting)
    const user = await User.findOne({ phone }).select('+password');

    // Verify both that the user exists AND the password matches
    // user.matchPassword() uses bcrypt.compare() internally
    if (user && (await user.matchPassword(password))) {
        // Authentication successful - return user data with JWT
        res.json({
            success: true,
            token: generateToken(user._id), // Fresh JWT valid for 30 days
            user: {
                _id: user._id,
                phone: user.phone,
                role: user.role,        // Used by frontend for role-based redirect
                name: user.name,
                language: user.language  // Used to set initial UI language
            }
        });
    } else {
        // Authentication failed - generic message to avoid leaking info
        // about whether the phone number exists
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// Export controller functions for use in authRoutes.js
module.exports = {
    registerUser,
    loginUser,
};
