const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Negotiation = require('../models/Negotiation');
const app = require('../server');

const getTestUri = () => {
    const originalUri = process.env.MONGO_URI;
    if (originalUri && originalUri.includes('agritech')) {
        return originalUri.replace('agritech', 'agritech_test_trade');
    }
    return 'mongodb://localhost:27017/agritech_test_trade';
};

let farmerToken, buyerToken, farmerId, buyerId, cropId;

beforeAll(async () => {
    await mongoose.connect(getTestUri());
    await User.deleteMany({});
    await Crop.deleteMany({});
    await Order.deleteMany({});
    await Negotiation.deleteMany({});

    // Create farmer
    const farmerRes = await request(app).post('/api/auth/register').send({
        phone: '5551112222',
        password: 'password123',
        role: 'FARMER',
        name: 'Trade Farmer',
        location: 'Delhi'
    });
    farmerToken = farmerRes.body.token;
    farmerId = farmerRes.body.user._id;

    // Create buyer
    const buyerRes = await request(app).post('/api/auth/register').send({
        phone: '5553334444',
        password: 'password123',
        role: 'BUYER',
        name: 'Trade Buyer'
    });
    buyerToken = buyerRes.body.token;
    buyerId = buyerRes.body.user._id;

    // Create a crop
    const cropRes = await request(app)
        .post('/api/crops')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
            name: 'Trade Wheat',
            quantity: 100,
            price: 25,
            quality: 'A',
            location: 'Delhi'
        });
    cropId = cropRes.body._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await Crop.deleteMany({});
    await Order.deleteMany({});
    await Negotiation.deleteMany({});
    await mongoose.connection.close();
});

describe('Trade API (Epic 4)', () => {

    describe('POST /api/trade/orders (Create Order)', () => {
        it('should create an order with valid data (201)', async () => {
            // Create a fresh crop for this test
            const cropRes = await request(app)
                .post('/api/crops')
                .set('Authorization', `Bearer ${farmerToken}`)
                .send({ name: 'Order Wheat', quantity: 50, price: 30, quality: 'B', location: 'Punjab' });

            const res = await request(app)
                .post('/api/trade/orders')
                .set('Authorization', `Bearer ${buyerToken}`)
                .send({
                    cropId: cropRes.body._id,
                    quantity: 50,
                    paymentMethod: 'upi',
                    shippingAddress: '123 Test Street, Delhi'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('buyer');
            expect(res.body).toHaveProperty('farmer');
            expect(res.body.totalAmount).toBe(50 * 30);
        });

        it('should fail without auth token (401)', async () => {
            const res = await request(app)
                .post('/api/trade/orders')
                .send({ cropId, paymentMethod: 'upi', shippingAddress: 'test' });
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/trade/orders (Get Orders)', () => {
        it('should return orders for the user (200)', async () => {
            const res = await request(app)
                .get('/api/trade/orders')
                .set('Authorization', `Bearer ${buyerToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('PUT /api/trade/orders/:id (Update Status)', () => {
        it('should update order status (200)', async () => {
            // Get an existing order
            const ordersRes = await request(app)
                .get('/api/trade/orders')
                .set('Authorization', `Bearer ${farmerToken}`);

            if (ordersRes.body.length > 0) {
                const orderId = ordersRes.body[0]._id;
                const res = await request(app)
                    .put(`/api/trade/orders/${orderId}`)
                    .set('Authorization', `Bearer ${farmerToken}`)
                    .send({ status: 'Processing' });

                expect(res.statusCode).toBe(200);
                expect(res.body.orderStatus).toBe('Processing');
            }
        });
    });

    describe('POST /api/trade/negotiation/start', () => {
        it('should start a negotiation (201)', async () => {
            const res = await request(app)
                .post('/api/trade/negotiation/start')
                .set('Authorization', `Bearer ${buyerToken}`)
                .send({
                    cropId,
                    message: 'Can we negotiate?',
                    offerAmount: 20
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('buyer');
            expect(res.body).toHaveProperty('farmer');
            expect(res.body.messages.length).toBeGreaterThan(0);
        });

        it('should fail to negotiate on own crop', async () => {
            const res = await request(app)
                .post('/api/trade/negotiation/start')
                .set('Authorization', `Bearer ${farmerToken}`)
                .send({ cropId });

            expect(res.statusCode).toBe(400);
        });
    });
});
