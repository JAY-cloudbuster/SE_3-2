const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const MarketPrice = require('../models/MarketPrice');
const app = require('../server');

const getTestUri = () => {
    const originalUri = process.env.MONGO_URI;
    if (originalUri && originalUri.includes('agritech')) {
        return originalUri.replace('agritech', 'agritech_test_prices');
    }
    return 'mongodb://localhost:27017/agritech_test_prices';
};

let token;

beforeAll(async () => {
    await mongoose.connect(getTestUri());
    await User.deleteMany({});
    await MarketPrice.deleteMany({});

    // Create a user for auth
    const userRes = await request(app).post('/api/auth/register').send({
        phone: '7776665555',
        password: 'password123',
        role: 'FARMER',
        name: 'Price Tester'
    });
    token = userRes.body.token;

    // Seed some market data
    const today = new Date();
    const records = [];
    for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        records.push({
            commodity: 'Wheat',
            market: 'Delhi APMC',
            date,
            minPrice: 20 + i,
            maxPrice: 30 + i,
            modalPrice: 25 + i
        });
        records.push({
            commodity: 'Rice',
            market: 'Mumbai APMC',
            date,
            minPrice: 30 + i,
            maxPrice: 40 + i,
            modalPrice: 35 + i
        });
    }
    await MarketPrice.insertMany(records);
});

afterAll(async () => {
    await User.deleteMany({});
    await MarketPrice.deleteMany({});
    await mongoose.connection.close();
});

describe('Prices API (Epic 5)', () => {

    describe('GET /api/prices/current', () => {
        it('should return current prices (200)', async () => {
            const res = await request(app)
                .get('/api/prices/current')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('commodity');
            expect(res.body[0]).toHaveProperty('modalPrice');
        });

        it('should fail without auth (401)', async () => {
            const res = await request(app).get('/api/prices/current');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/prices/trends', () => {
        it('should return trend data (200)', async () => {
            const res = await request(app)
                .get('/api/prices/trends?commodity=Wheat&days=30')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should filter by commodity', async () => {
            const res = await request(app)
                .get('/api/prices/trends?commodity=Rice')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            res.body.forEach(record => {
                expect(record.commodity).toBe('Rice');
            });
        });
    });

    describe('GET /api/prices/recommend', () => {
        it('should return recommendation (200)', async () => {
            const res = await request(app)
                .get('/api/prices/recommend?commodity=Wheat&userPrice=30')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('recommendation');
            expect(res.body).toHaveProperty('message');
            expect(['sell', 'wait', 'neutral']).toContain(res.body.recommendation);
        });

        it('should handle missing commodity', async () => {
            const res = await request(app)
                .get('/api/prices/recommend')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(400);
        });
    });
});
