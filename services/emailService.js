const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const initializeTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, html, text = null) => {
    try {
        const transporter = initializeTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        };

        if (text) {
            mailOptions.text = text;
        }

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Email sending failed:', error);
        throw error;
    }
};

const sendWelcomeEmail = async (email, name) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #e91e63;">Welcome to Sakhi!</h1>
      <p>Dear ${name},</p>
      <p>Thank you for joining Sakhi - Women's Safety Platform. We're here to support and empower you.</p>
      <h3>Features you can explore:</h3>
      <ul>
        <li>🚨 Emergency SOS with location sharing</li>
        <li>👥 Trusted circle and emergency contacts</li>
        <li>📝 Report incidents anonymously</li>
        <li>⚖️ Legal aid assistance</li>
        <li>💬 Supportive community forum</li>
        <li>📚 Government scheme information</li>
      </ul>
      <p>Stay safe and empowered!</p>
      <p>Best regards,<br>Sakhi Team</p>
    </div>
  `;

    return sendEmail(email, 'Welcome to Sakhi!', html);
};

const sendEmergencyAlertEmail = async (email, name, userName, location, emergencyType) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffebee; padding: 20px; border-left: 4px solid #e91e63;">
      <h2 style="color: #c62828;">⚠️ EMERGENCY ALERT</h2>
      <p><strong>${userName}</strong> has triggered an emergency alert.</p>
      <p><strong>Type:</strong> ${emergencyType}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p>Please contact them immediately.</p>
      <hr>
      <p style="font-size: 12px; color: #666;">This is an automated alert from Sakhi Safety Platform.</p>
    </div>
  `;

    return sendEmail(email, `URGENT: ${userName} needs help`, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendEmergencyAlertEmail
};