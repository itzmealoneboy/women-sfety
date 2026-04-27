const twilio = require('twilio');
const logger = require('../utils/logger');

let twilioClient = null;

const initializeTwilio = () => {
    if (!twilioClient && process.env.TWILIO_ACCOUNT_SID) {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
    return twilioClient;
};

const sendSMS = async (to, message) => {
    try {
        const client = initializeTwilio();

        if (!client) {
            logger.warn('Twilio not configured, SMS not sent');
            return null;
        }

        const response = await client.messages.create({
            body: message,
            to: `+91${to}`, // Assuming Indian numbers
            from: process.env.TWILIO_PHONE_NUMBER
        });

        logger.info(`SMS sent to ${to}: ${response.sid}`);
        return response;
    } catch (error) {
        logger.error('SMS sending failed:', error);
        throw error;
    }
};

const sendEmergencySOS = async (phone, userName, location) => {
    const message = `SAKHI ALERT: ${userName} needs immediate help! Location: ${location}. Please contact them now.`;
    return sendSMS(phone, message);
};

const sendOTPSMS = async (phone, otp) => {
    const message = `Your Sakhi verification OTP is: ${otp}. Valid for 5 minutes.`;
    return sendSMS(phone, message);
};

module.exports = {
    sendSMS,
    sendEmergencySOS,
    sendOTPSMS
};