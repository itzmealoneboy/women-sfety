const logger = require('../utils/logger');

const handleEmergencyEvents = (socket, io, socketManager) => {
    const userId = socket.userId;

    // User triggers emergency
    socket.on('emergency_trigger', async (data) => {
        logger.info(`Emergency triggered by user ${userId}`, data);

        // Broadcast to user's trusted circles
        if (data.circleIds && data.circleIds.length > 0) {
            data.circleIds.forEach(circleId => {
                io.to(`circle_${circleId}`).emit('emergency_alert', {
                    userId,
                    location: data.location,
                    type: data.type,
                    timestamp: new Date()
                });
            });
        }

        // Notify admins/responders
        io.to('admin_emergency').emit('new_emergency', {
            userId,
            location: data.location,
            type: data.type,
            socketId: socket.id
        });
    });

    // User cancels emergency
    socket.on('emergency_cancel', (data) => {
        logger.info(`Emergency cancelled by user ${userId}`);

        if (data.circleIds) {
            data.circleIds.forEach(circleId => {
                io.to(`circle_${circleId}`).emit('emergency_cancelled', {
                    userId,
                    timestamp: new Date()
                });
            });
        }
    });

    // Responder acknowledges emergency
    socket.on('emergency_acknowledge', (data) => {
        logger.info(`Emergency ${data.emergencyId} acknowledged by responder`);

        io.to(`emergency_${data.userId}`).emit('emergency_responded', {
            responderId: userId,
            message: data.message
        });
    });

    // Location tracking during emergency
    socket.on('emergency_location_update', (data) => {
        io.to(`emergency_${data.userId}`).emit('location_tracking', {
            userId: data.userId,
            location: data.location,
            timestamp: new Date()
        });
    });
};

module.exports = {
    handleEmergencyEvents
};