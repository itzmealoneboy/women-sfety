const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ApiError } = require('../utils/apiResponse');

// Helmet configuration for security headers
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.openai.com", "https://maps.googleapis.com"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Strict rate limiter for sensitive endpoints
const strictRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Prevent parameter pollution
const preventParameterPollution = (req, res, next) => {
    const duplicatedParams = [];

    for (const param in req.query) {
        if (Array.isArray(req.query[param]) && req.query[param].length > 1) {
            duplicatedParams.push(param);
        }
    }

    if (duplicatedParams.length > 0) {
        throw new ApiError(`Duplicate parameters detected: ${duplicatedParams.join(', ')}`, 400);
    }

    next();
};

// Request sanitization for XSS
const sanitizeInput = (req, res, next) => {
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key]
                    .replace(/[<>]/g, '') // Remove < and >
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);

    next();
};

// Check for suspicious IPs (example - can be enhanced with external service)
const checkSuspiciousIP = async (req, res, next) => {
    const suspiciousIPs = []; // Load from database or external service
    const clientIP = req.ip || req.connection.remoteAddress;

    if (suspiciousIPs.includes(clientIP)) {
        throw new ApiError('Access denied', 403);
    }

    next();
};

// Audit log middleware
const auditLog = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            timestamp: new Date(),
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userId: req.user?._id,
            userAgent: req.get('user-agent')
        };

        // Log to file or database
        logger.info('API Request:', logData);
    });

    next();
};

module.exports = {
    securityHeaders,
    strictRateLimiter,
    preventParameterPollution,
    sanitizeInput,
    checkSuspiciousIP,
    auditLog
};