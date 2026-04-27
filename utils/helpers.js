const crypto = require('crypto');

const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const generateOTP = (length = 6) => {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Check if it's a valid Indian number
    if (cleaned.length === 10) {
        return cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return cleaned.substring(1);
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return cleaned.substring(2);
    }

    return cleaned;
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const sanitizeUserData = (user) => {
    const userObject = user.toObject ? user.toObject() : user;
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const isWithinRadius = (lat1, lon1, lat2, lon2, radiusKm) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await sleep(delay * Math.pow(2, i)); // Exponential backoff
            }
        }
    }

    throw lastError;
};

module.exports = {
    generateRandomString,
    generateOTP,
    formatPhoneNumber,
    validateEmail,
    sanitizeUserData,
    calculateAge,
    isWithinRadius,
    sleep,
    retryOperation
};