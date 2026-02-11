const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../server');

// Use a distinct database for testing
const getTestUri = () => {
    const originalUri = process.env.MONGO_URI;
    if (originalUri && originalUri.includes('agritech')) {
        return originalUri.replace('agritech', 'agritech_test');
    }
    return 'mongodb://localhost:27017/agritech_test';
};

beforeAll(async () => {
    // connect to test db
    const uri = getTestUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    // clean up and close
    await User.deleteMany({}); // Optional: clear users after test suite
    await mongoose.connection.close();
});

describe('Auth API (Module 4)', () => {

    // Clean up before each test to ensure isolation
    beforeEach(async () => {
        await User.deleteMany({});
    });

    const testUser = {
        phone: '9876543210',
        password: 'password123',
        role: 'FARMER'
    };

    describe('POST /api/auth/register', () => {

        it('should register a new user successfully (201)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('phone', testUser.phone);
            expect(res.body.user).not.toHaveProperty('password'); // Password should not be returned
        });

        it('should fail if phone is missing (400)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ password: '123' });

            expect(res.statusCode).toEqual(400);
        });

        it('should fail if duplicate phone is registered (400)', async () => {
            // first registration
            await request(app).post('/api/auth/register').send(testUser);

            // second registration
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toMatch(/User already exists/);
        });
    });

    describe('POST /api/auth/login', () => {

        beforeEach(async () => {
            // Register user before login tests
            await request(app).post('/api/auth/register').send(testUser);
        });

        it('should login successfully with correct credentials (200)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    phone: testUser.phone,
                    password: testUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail login with wrong password (401)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    phone: testUser.phone,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toMatch(/Invalid credentials/);
        });

        it('should fail login with non-existent phone (401)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    phone: '0000000000',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});
