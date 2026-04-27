const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');

describe('Location Tests', () => {
    let authToken;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.create({
            name: 'Location Test User',
            email: 'location@test.com',
            phone: '9876543211',
            password: 'password123'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'location@test.com',
                password: 'password123'
            });

        authToken = loginRes.body.data.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/location/update', () => {
        it('should update user location', async () => {
            const res = await request(app)
                .post('/api/location/update')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 28.6139,
                    longitude: 77.2090,
                    accuracy: 10
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('latitude', 28.6139);
            expect(res.body.data).toHaveProperty('longitude', 77.2090);
        });
    });

    describe('GET /api/location/nearby/safe-places', () => {
        it('should get nearby safe places', async () => {
            const res = await request(app)
                .get('/api/location/nearby/safe-places?latitude=28.6139&longitude=77.2090&radius=5')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('policeStations');
            expect(res.body.data).toHaveProperty('hospitals');
        });
    });
});