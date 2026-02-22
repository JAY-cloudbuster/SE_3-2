/**
 * @fileoverview Admin Service for AgriSahayak Frontend
 * 
 * Provides methods for admin-only API operations.
 * All routes require admin authentication.
 * 
 * @module services/adminService
 * @see Epic 7 - Trust & Safety
 */

import api from './api';

export const adminService = {
    /** Fetch all users (paginated, with optional role filter) */
    getAllUsers: async (page = 1, limit = 20, role = '') => {
        const params = { page, limit };
        if (role) params.role = role;
        return api.get('/admin/users', { params });
    },

    /** Verify a user by ID */
    verifyUser: async (userId) => api.put(`/admin/users/${userId}/verify`),

    /** Toggle ban status for a user */
    banUser: async (userId) => api.put(`/admin/users/${userId}/ban`),

    /** Get platform-wide statistics */
    getPlatformStats: async () => api.get('/admin/stats'),
};
