const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { socketManager } = require('../sockets/socketManager');

let io = null;

const initializeSocket = (server) => {
    if (!io) {
        io = socketIO(server, {
            cors: {
                origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
                credentials: true,
                methods: ['GET', 'POST']
            },
            path: '/socket.io',
            transports: ['websocket', 'polling']
        });

        // Authentication middleware
        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.id;
                socket.user = decoded;
                next();
            } catch (err) {
                logger.error('Socket authentication error:', err);
                next(new Error('Authentication error'));
            }
        });

        io.on('connection', (socket) => {
            logger.info(`New client connected: ${socket.id} for user: ${socket.userId}`);
            socketManager.handleConnection(socket, io);
        });

        logger.info('Socket.IO initialized');
    }
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};