const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { phone, password, role, language, avatarUrl, name } = req.body;

    if (!phone || !password) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password handled in Model Middleware

    // Create user
    const user = await User.create({
        phone,
        password,
        role,
        language,
        avatarUrl,
        name
    });

    if (user) {
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                phone: user.phone,
                role: user.role,
                name: user.name,
                language: user.language
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    // Check for user
    const user = await User.findOne({ phone }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                phone: user.phone,
                role: user.role,
                name: user.name,
                language: user.language
            }
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

module.exports = {
    registerUser,
    loginUser,
};
