const request = require('supertest');
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const User = require('../models/User');
const app = require('../server');

// Distinct test database
const getTestUri = () => {
    const originalUri = process.env.MONGO_URI;
    if (originalUri && originalUri.includes('agritech')) {
        return originalUri.replace('agritech', 'agritech_test_crops');
    }
    return 'mongodb://localhost:27017/agritech_test_crops';
};

let token;
let farmerId;

beforeAll(async () => {
    await mongoose.connect(getTestUri());
    await User.deleteMany({});
    await Crop.deleteMany({});

    // Create a farmer to use for tests
    const farmerRes = await request(app).post('/api/auth/register').send({
        phone: '1112223333',
        password: 'password123',
        role: 'FARMER',
        name: 'Test Farmer',
        location: 'Punjab'
    });
    token = farmerRes.body.token;
    farmerId = farmerRes.body.user._id;
});

afterAll(async () => {
    // await User.deleteMany({});
    // await Crop.deleteMany({});
    await mongoose.connection.close();
});

describe('Crops API (Module 5)', () => {

    beforeEach(async () => {
        await Crop.deleteMany({});
    });

    describe('POST /api/crops (Create)', () => {
        it('should create a crop with valid data (201)', async () => {
            const res = await request(app)
                .post('/api/crops')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Wheat',
                    quantity: 100,
                    price: 20,
                    quality: 'A',
                    location: 'Punjab'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toBe('Wheat');
            expect(res.body.farmer).toBe(farmerId);
        });

        it('should fail if price is negative (Validaton Error)', async () => {
            const res = await request(app)
                .post('/api/crops')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Bad Pricing',
                    quantity: 50,
                    price: -10, // Invalid
                    quality: 'B'
                });

            expect(res.statusCode).toBe(400); // Mongoose validation error handled as 400
        });

        it('should fail without token (401)', async () => {
            const res = await request(app)
                .post('/api/crops')
                .send({ name: 'Wheat', quantity: 10, price: 10, quality: 'A' });
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/crops (Marketplace)', () => {
        it('should return empty list initially', async () => {
            const res = await request(app)
                .get('/api/crops')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
        });

        it('should return listed crops', async () => {
            // Seed one crop
            await Crop.create({
                farmer: farmerId,
                name: 'Rice',
                quantity: 50,
                price: 30,
                quality: 'A',
                location: 'Kerala'
            });

            const res = await request(app)
                .get('/api/crops')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Rice');
        });
    });
});
