/**
 * @fileoverview Authentication Middleware for AgriSahayak Platform
 * 
 * This module provides middleware functions for securing API routes.
 * The `protect` middleware verifies JWT tokens from the Authorization header,
 * and the `admin` middleware restricts access to admin-only routes.
 * 
 * These middlewares are applied to route definitions in the routes/ directory
 * to enforce authentication and authorization on protected endpoints.
 * 
 * @module middlewares/authMiddleware
 * @requires jsonwebtoken - JWT verification
 * @requires models/User - User model for fetching user data from token
 * @requires express-async-handler - Async error wrapper
 * 
 * @see Epic 1, Story 1.8 - Role-Based Redirect (admin middleware)
 * @see Epic 7, Story 7.2 - Admin Verification Approval (admin middleware)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * Protect Middleware - JWT Authentication Guard
 * 
 * Verifies the JWT token from the request's Authorization header.
 * If valid, attaches the full user document (minus password) to `req.user`
 * and allows the request to proceed. If invalid or missing, returns 401.
 * 
 * Expected header format: `Authorization: Bearer <JWT_TOKEN>`
 * 
 * Usage in routes:
 *   router.get('/protected', protect, controllerFunction);
 * 
 * After this middleware runs, controllers can access:
 *   - req.user._id   (User's MongoDB ID)
 *   - req.user.role  (User's role: FARMER/BUYER/ADMIN)
 *   - req.user.name  (User's display name)
 *   - req.user.phone (User's phone number)
 *   - etc.
 * 
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} 401 - "Not authorized, token failed" if JWT is invalid/expired
 * @throws {Error} 401 - "Not authorized, no token" if no token is provided
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and follows Bearer token format
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key from environment variables
            // Returns the decoded payload containing the user's ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the full user document from the database using the decoded ID
            // .select('-password') excludes the password field from the result
            req.user = await User.findById(decoded.id).select('-password');

            // Token is valid and user is found - proceed to the next middleware/controller
            next();
        } catch (error) {
            // Token verification failed (expired, tampered, or malformed)
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    // No token was found in the Authorization header
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

/**
 * Admin Middleware - Role-Based Authorization Guard
 * 
 * Must be used AFTER the `protect` middleware (which sets `req.user`).
 * Checks if the authenticated user has the 'ADMIN' role.
 * If not, returns a 401 Unauthorized error.
 * 
 * Usage in routes:
 *   router.get('/admin-only', protect, admin, controllerFunction);
 * 
 * @function admin
 * @param {Object} req - Express request object (must have req.user from protect middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} 401 - "Not authorized as an admin" if user role is not ADMIN
 * 
 * @see Epic 7, Story 7.2 - Admin Verification Approval
 * @see Epic 7, Story 7.7 - Moderation Dashboard access
 */
const admin = (req, res, next) => {
    // Check if the user exists and has the ADMIN role
    if (req.user && req.user.role === 'ADMIN') {
        next(); // User is an admin, proceed to the next handler
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

// Export middleware functions for use in route definitions
module.exports = { protect, admin };
