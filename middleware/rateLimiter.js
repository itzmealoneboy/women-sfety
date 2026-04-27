const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

const authRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after an hour'
    }
});

const sosRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each user to 3 SOS requests per 5 minutes
    keyGenerator: (req) => req.user?.id || req.ip,
    message: {
        success: false,
        message: 'Please wait before sending another SOS'
    }
});

module.exports = rateLimiter;
module.exports.authRateLimiter = authRateLimiter;
module.exports.sosRateLimiter = sosRateLimiter;