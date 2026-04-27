const crypto = require('crypto');
const logger = require('../utils/logger');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-encryption-key-change-this', 'salt', 32);

const encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            content: encrypted
        };
    } catch (error) {
        logger.error('Encryption error:', error);
        throw error;
    }
};

const decrypt = (encryptedData) => {
    try {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = Buffer.from(encryptedData.content, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        logger.error('Decryption error:', error);
        throw error;
    }
};

const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

const generateSecureToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    encrypt,
    decrypt,
    hashData,
    generateSecureToken
};