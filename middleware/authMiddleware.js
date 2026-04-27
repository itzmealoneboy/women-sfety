const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ApiError('Not authorized to access this route', 401));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(new ApiError('User not found', 401));
            }

            if (!req.user.isActive) {
                return next(new ApiError('Account is deactivated', 401));
            }

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return next(new ApiError('Invalid token', 401));
            } else if (error.name === 'TokenExpiredError') {
                return next(new ApiError('Token expired', 401));
            }
            throw error;
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        next(new ApiError('Authentication failed', 401));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};

const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return next(new ApiError('Refresh token required', 401));
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        next(new ApiError('Invalid refresh token', 401));
    }
};

module.exports = {
    protect,
    authorize,
    verifyRefreshToken
};