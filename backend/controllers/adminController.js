/**
 * @fileoverview Admin Controller for AgriSahayak Platform
 * 
 * Provides admin-only operations for user management,
 * verification approvals, banning, and platform analytics.
 * 
 * @module controllers/adminController
 * @requires express-async-handler
 * @requires models/User
 * @requires models/Crop
 * @requires models/Order
 * 
 * @see Epic 7 - Trust & Safety
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

/**
 * Get All Users (paginated)
 * 
 * @route GET /api/admin/users?page=1&limit=20&role=FARMER
 * @access Private (Admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) {
        filter.role = req.query.role;
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter)
    ]);

    res.status(200).json({
        users,
        page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
    });
});

/**
 * Verify a User
 * 
 * @route PUT /api/admin/users/:id/verify
 * @access Private (Admin only)
 */
const verifyUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
        message: `User ${user.name || user.phone} has been verified`,
        user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified
        }
    });
});

/**
 * Ban a User
 * 
 * @route PUT /api/admin/users/:id/ban
 * @access Private (Admin only)
 */
const banUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
        res.status(400);
        throw new Error('Cannot ban an admin user');
    }

    user.isBanned = !user.isBanned; // Toggle ban status
    await user.save();

    res.status(200).json({
        message: user.isBanned
            ? `User ${user.name || user.phone} has been banned`
            : `User ${user.name || user.phone} has been unbanned`,
        user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isBanned: user.isBanned
        }
    });
});

/**
 * Get Platform Statistics
 * 
 * @route GET /api/admin/stats
 * @access Private (Admin only)
 */
const getPlatformStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalCrops,
        activeCrops,
        totalOrders,
        deliveredOrders,
        revenueResult
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'FARMER' }),
        User.countDocuments({ role: 'BUYER' }),
        Crop.countDocuments(),
        Crop.countDocuments({ isSold: false, status: 'Available' }),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: 'Delivered' }),
        Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
        users: {
            total: totalUsers,
            farmers: totalFarmers,
            buyers: totalBuyers
        },
        crops: {
            total: totalCrops,
            active: activeCrops
        },
        orders: {
            total: totalOrders,
            delivered: deliveredOrders
        },
        totalRevenue
    });
});

module.exports = {
    getAllUsers,
    verifyUser,
    banUser,
    getPlatformStats
};
