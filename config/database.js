const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.warn('MongoDB connection error - using in-memory storage');
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected - using in-memory storage');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (error) {
        logger.warn('MongoDB not available - using in-memory storage');
        // Don't exit - app can work without MongoDB
        console.log('Server will continue with in-memory storage for data persistence');
    }
};

module.exports = connectDB;