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
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { sendOTPEmail } = require('../utils/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * Normal Login - Phone Number + Password (for activated accounts)
 * POST /api/auth/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        res.status(400);
        throw new Error('Phone number and password are required');
    }

    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
        res.status(403);
        throw new Error('Account not activated. Please activate your account first.');
    }

    if (user.isBanned) {
        res.status(403);
        throw new Error('Your account has been banned. Contact admin.');
    }

    if (!(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Admin can also login with phone+password
    res.json({
        success: true,
        token: generateToken(user._id),
        user: {
            _id: user._id,
            phone: user.phone,
            role: user.role,
            name: user.name,
            language: user.language,
            isActive: user.isActive,
            isFirstLogin: user.isFirstLogin,
        },
    });
});

/**
 * Admin Login - Email + Password (Admin uses email to login)
 * POST /api/auth/admin-login
 */
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: normalizedEmail, role: 'ADMIN' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid admin credentials');
    }

    res.json({
        success: true,
        token: generateToken(user._id),
        user: {
            _id: user._id,
            phone: user.phone,
            email: user.email,
            role: user.role,
            name: user.name,
            language: user.language,
            isActive: user.isActive,
            isFirstLogin: user.isFirstLogin,
        },
    });
});

/**
 * Activate Account - Step 1: Verify email + temp password
 * POST /api/auth/activate
 */
const activateAccount = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and temporary password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(404);
        throw new Error('Account not found');
    }

    if (user.isActive && !user.isFirstLogin) {
        res.status(400);
        throw new Error('Account is already activated');
    }

    if (!(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid temporary password');
    }

    res.json({
        success: true,
        message: 'Credentials verified. Please set your new password.',
        userId: user._id,
    });
});

/**
 * Set New Password - Step 2: Change password during activation
 * POST /api/auth/set-password
 */
const setNewPassword = asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        res.status(400);
        throw new Error('User ID and new password are required');
    }

    // Validate password complexity
    if (newPassword.length < 8) {
        res.status(400);
        throw new Error('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(newPassword)) {
        res.status(400);
        throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
        res.status(400);
        throw new Error('Password must contain at least one special symbol');
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    // Generate and send OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await User.updateOne(
        { _id: user._id },
        { otp, otpExpiry: user.otpExpiry }
    );

    await sendOTPEmail(user.email, otp);

    res.json({
        success: true,
        message: 'Password updated. OTP sent to your email.',
        userId: user._id,
    });
});

/**
 * Verify OTP - Step 3: Complete activation
 * POST /api/auth/verify-otp
 */
const verifyOTP = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        res.status(400);
        throw new Error('User ID and OTP are required');
    }

    const user = await User.findById(userId).select('+otp +otpExpiry');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.otp || !user.otpExpiry) {
        res.status(400);
        throw new Error('No OTP requested. Please restart the activation process.');
    }

    if (new Date() > user.otpExpiry) {
        res.status(400);
        throw new Error('OTP has expired. Please restart the activation process.');
    }

    if (user.otp !== otp) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    // Activation complete
    user.isActive = true;
    user.isFirstLogin = false;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
        success: true,
        message: 'Account activated successfully. You can now login with your phone number and password.',
    });
});

/**
 * Resend OTP
 * POST /api/auth/resend-otp
 */
const resendOTP = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error('User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await User.updateOne(
        { _id: user._id },
        { otp, otpExpiry: user.otpExpiry }
    );

    await sendOTPEmail(user.email, otp);

    res.json({
        success: true,
        message: 'OTP resent to your email.',
    });
});

module.exports = {
    loginUser,
    adminLogin,
    activateAccount,
    setNewPassword,
    verifyOTP,
    resendOTP,
};
