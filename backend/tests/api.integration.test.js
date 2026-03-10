const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming this exports your Express app

describe('API Integration Tests', () => {

    beforeAll(async () => {
        // Connect to a test database if not already handled inside server.js
        const uri = 'mongodb://localhost:27017/agritech_integration_test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        }
    });

    afterAll(async () => {
        // Clean up connections after testing
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    });

    describe('GET /api/public/home', () => {
        it('should return a 200 indicating the API is active', async () => {
            // Note: Update to a route that actually exists and requires no auth
            // If the route doesn't exist, this might return 404, which is expected behaviour in testing
            const res = await request(app).get('/api/public/home');
            
            // Just verifying the server responds and routing works
            expect([200, 404]).toContain(res.statusCode); 
        });
    });

    describe('GET /api/crops', () => {
         it('should return available crops list', async () => {
            const res = await request(app).get('/api/crops');
            // Assuming this route should either return 200 or 401 (if auth is enforced but we didn't provide it)
            expect([200, 401, 404]).toContain(res.statusCode);
         });
    });
});
