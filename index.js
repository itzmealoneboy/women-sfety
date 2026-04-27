const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { initializeRedis } = require('./config/redis');
const { initializeSocket } = require('./config/socket');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const locationRoutes = require('./routes/locationRoutes');
const legalRoutes = require('./routes/legalRoutes');
const reportRoutes = require('./routes/reportRoutes');
const communityRoutes = require('./routes/communityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const benefitsRoutes = require('./routes/benefitsRoutes');
const userRoutes = require('./routes/userRoutes');

// Import logger
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
app.use('/api', rateLimiter);

// Initialize services
connectDB();
const firebaseApp = initializeFirebase();
if (firebaseApp) {
    console.log('Firebase initialized successfully');
} else {
    console.log('Firebase not configured - some features may be limited');
}
initializeRedis();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server`
    });
});

// Error handling middleware
app.use(errorHandler);

// Initialize Socket.IO
const io = initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = { app, server };