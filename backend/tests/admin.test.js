const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../server');

const getTestUri = () => {
    const originalUri = process.env.MONGO_URI;
    if (originalUri && originalUri.includes('agritech')) {
        return originalUri.replace('agritech', 'agritech_test_admin');
    }
    return 'mongodb://localhost:27017/agritech_test_admin';
};

let adminToken, farmerToken, farmerId;

beforeAll(async () => {
    await mongoose.connect(getTestUri());
    await User.deleteMany({});

    // Create admin user directly in DB (no register endpoint for admin)
    const adminUser = await User.create({
        phone: '9999999999',
        password: 'admin123',
        role: 'ADMIN',
        name: 'Test Admin'
    });

    // Login as admin to get token
    const adminLoginRes = await request(app).post('/api/auth/login').send({
        phone: '9999999999',
        password: 'admin123'
    });
    adminToken = adminLoginRes.body.token;

    // Create a regular farmer
    const farmerRes = await request(app).post('/api/auth/register').send({
        phone: '8888888888',
        password: 'farmer123',
        role: 'FARMER',
        name: 'Test Farmer'
    });
    farmerToken = farmerRes.body.token;
    farmerId = farmerRes.body.user._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Admin API (Epic 7)', () => {

    describe('GET /api/admin/users', () => {
        it('should return users for admin (200)', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('users');
            expect(res.body).toHaveProperty('totalUsers');
            expect(Array.isArray(res.body.users)).toBe(true);
        });

        it('should reject non-admin users (401)', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${farmerToken}`);

            expect(res.statusCode).toBe(401);
        });

        it('should reject unauthenticated requests (401)', async () => {
            const res = await request(app).get('/api/admin/users');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /api/admin/users/:id/verify', () => {
        it('should verify a user (200)', async () => {
            const res = await request(app)
                .put(`/api/admin/users/${farmerId}/verify`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.user.isVerified).toBe(true);
        });
    });

    describe('PUT /api/admin/users/:id/ban', () => {
        it('should ban a user (200)', async () => {
            const res = await request(app)
                .put(`/api/admin/users/${farmerId}/ban`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.user.isBanned).toBe(true);
        });
    });

    describe('GET /api/admin/stats', () => {
        it('should return platform statistics (200)', async () => {
            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('users');
            expect(res.body).toHaveProperty('crops');
            expect(res.body).toHaveProperty('orders');
            expect(res.body).toHaveProperty('totalRevenue');
            expect(res.body.users).toHaveProperty('total');
            expect(res.body.users).toHaveProperty('farmers');
            expect(res.body.users).toHaveProperty('buyers');
        });
    });
});
