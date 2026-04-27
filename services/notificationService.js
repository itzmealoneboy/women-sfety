const Notification = require('../models/Notification');
const { sendPushNotification, sendMulticastNotification } = require('../config/firebase');
const { sendEmail, sendEmergencyAlertEmail } = require('./emailService');
const { sendSMS, sendEmergencySOS } = require('./smsService');
const logger = require('../utils/logger');

const createNotification = async (userId, type, title, message, data = {}, priority = 'medium', channels = ['in_app']) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            data,
            priority,
            channels
        });

        // Send through specified channels
        await sendNotificationThroughChannels(notification);

        return notification;
    } catch (error) {
        logger.error('Error creating notification:', error);
        throw error;
    }
};

const sendNotificationThroughChannels = async (notification) => {
    try {
        const user = await require('../models/User').findById(notification.userId);
        if (!user) return;

        // In-app notification is already saved

        // Push notification
        if (notification.channels.includes('push') && user.deviceTokens.length > 0) {
            const tokens = user.deviceTokens.map(dt => dt.token);
            await sendMulticastNotification(tokens, notification.title, notification.message, notification.data);
        }

        // Email notification
        if (notification.channels.includes('email') && user.email && user.preferences.notifications.email) {
            await sendEmail(user.email, notification.title, notification.message);
        }

        // SMS notification (only for critical)
        if (notification.channels.includes('sms') && user.phone && user.preferences.notifications.sms && notification.priority === 'critical') {
            await sendSMS(user.phone, notification.message);
        }
    } catch (error) {
        logger.error('Error sending notification through channels:', error);
    }
};

const sendSOSAlert = async ({ phone, name, userName, location, emergencyType, emergencyId }) => {
    const message = `SAKHI EMERGENCY: ${userName} needs help! Type: ${emergencyType}. Location: ${location}. Track: https://sakhi.app/track/${emergencyId}`;

    try {
        await sendSMS(phone, message);
        await sendEmail(`${name} <${phone}@sms>`, `Emergency Alert - ${userName}`, message);
        logger.info(`SOS alert sent to ${phone}`);
    } catch (error) {
        logger.error(`Failed to send SOS alert to ${phone}:`, error);
    }
};

const sendBulkNotifications = async (userIds, type, title, message, data = {}) => {
    const notifications = [];

    for (const userId of userIds) {
        try {
            const notification = await createNotification(userId, type, title, message, data);
            notifications.push(notification);
        } catch (error) {
            logger.error(`Failed to send notification to user ${userId}:`, error);
        }
    }

    return notifications;
};

module.exports = {
    createNotification,
    sendSOSAlert,
    sendBulkNotifications
};