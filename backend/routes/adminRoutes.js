/**
 * @fileoverview Admin Routes for AgriSahayak Platform
 * 
 * All routes protected with JWT auth + admin role check.
 * Mounted at /api/admin in server.js.
 * 
 * @module routes/adminRoutes
 * @see Epic 7 - Trust & Safety
 */

const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    verifyUser,
    banUser,
    getPlatformStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All admin routes require authentication AND admin role
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/verify', protect, admin, verifyUser);
router.put('/users/:id/ban', protect, admin, banUser);
router.get('/stats', protect, admin, getPlatformStats);

module.exports = router;
