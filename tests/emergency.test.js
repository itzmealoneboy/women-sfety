const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');
const Emergency = require('../src/models/Emergency');

describe('Emergency Tests', () => {
    let authToken;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);

        // Create test user and get token
        const user = await User.create({
            name: 'Test User',
            email: 'emergency@test.com',
            phone: '9876543210',
            password: 'password123'
        });

        userId = user._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'emergency@test.com',
                password: 'password123'
            });

        authToken = loginRes.body.data.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Emergency.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/emergency/sos', () => {
        it('should trigger SOS successfully', async () => {
            const res = await request(app)
                .post('/api/emergency/sos')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'sos',
                    latitude: 28.6139,
                    longitude: 77.2090,
                    description: 'Test emergency'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('emergencyId');
            expect(res.body.data.status).toBe('active');
        });
    });

    describe('GET /api/emergency/history', () => {
        it('should get emergency history', async () => {
            const res = await request(app)
                .get('/api/emergency/history')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('emergencies');
        });
    });
});