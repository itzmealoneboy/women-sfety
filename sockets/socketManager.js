const logger = require('../utils/logger');
const { handleEmergencyEvents } = require('./events');

class SocketManager {
    constructor() {
        this.users = new Map(); // userId -> socketId
        this.socketRooms = new Map(); // socketId -> rooms
    }

    handleConnection(socket, io) {
        const userId = socket.userId;

        // Store user connection
        this.users.set(userId, socket.id);
        socket.join(`user_${userId}`);

        logger.info(`User ${userId} connected with socket ${socket.id}`);

        // Join user's emergency room
        socket.join(`emergency_${userId}`);

        // Handle emergency events
        handleEmergencyEvents(socket, io, this);

        // Handle disconnection
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });

        // Handle joining trusted circle room
        socket.on('join_trusted_circle', (circleId) => {
            socket.join(`circle_${circleId}`);
            if (!this.socketRooms.has(socket.id)) {
                this.socketRooms.set(socket.id, new Set());
            }
            this.socketRooms.get(socket.id).add(`circle_${circleId}`);
        });

        // Handle location updates
        socket.on('location_update', (data) => {
            this.handleLocationUpdate(userId, data, io);
        });

        // Handle typing indicators
        socket.on('typing', (data) => {
            socket.to(`circle_${data.circleId}`).emit('user_typing', {
                userId,
                isTyping: data.isTyping
            });
        });
    }

    handleDisconnect(socket) {
        const userId = socket.userId;
        this.users.delete(userId);

        // Leave all rooms
        if (this.socketRooms.has(socket.id)) {
            const rooms = this.socketRooms.get(socket.id);
            rooms.forEach(room => {
                socket.leave(room);
            });
            this.socketRooms.delete(socket.id);
        }

        logger.info(`User ${userId} disconnected`);
    }

    handleLocationUpdate(userId, data, io) {
        // Broadcast location to trusted circles
        io.to(`user_${userId}`).emit('location_updated', {
            userId,
            location: data.location,
            timestamp: new Date()
        });
    }

    sendToUser(userId, event, data) {
        const socketId = this.users.get(userId);
        if (socketId) {
            const io = require('../config/socket').getIO();
            io.to(socketId).emit(event, data);
            return true;
        }
        return false;
    }

    broadcastToCircle(circleId, event, data) {
        const io = require('../config/socket').getIO();
        io.to(`circle_${circleId}`).emit(event, data);
    }
}

const socketManager = new SocketManager();

module.exports = { socketManager };