const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache, deleteCache } = require('../config/redis');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            throw new ApiError('User already exists with this email or phone', 400);
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password
        });

        // Generate OTP for verification
        const otp = crypto.randomInt(100000, 999999).toString();
        await setCache(`otp:${email}`, otp, 300); // OTP expires in 5 minutes

        // Send OTP via email and SMS
        await sendEmail(email, 'Email Verification', `Your OTP for verification is: ${otp}`);
        await sendSMS(phone, `Your Sakhi verification OTP is: ${otp}`);

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json(new ApiResponse(201, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token,
            refreshToken
        }, 'Registration successful. Please verify your email/phone with OTP'));
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;

        // Find user by email or phone
        const user = await User.findOne({
            $or: [{ email: email || '' }, { phone: phone || '' }]
        }).select('+password');

        if (!user) {
            throw new ApiError('Invalid credentials', 401);
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new ApiError('Invalid credentials', 401);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.json(new ApiResponse(200, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                safetyScore: user.safetyScore
            },
            token,
            refreshToken
        }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const cachedOTP = await getCache(`otp:${email}`);

        if (!cachedOTP || cachedOTP !== otp) {
            throw new ApiError('Invalid or expired OTP', 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        user.isVerified = true;
        await user.save();

        await deleteCache(`otp:${email}`);

        res.json(new ApiResponse(200, null, 'Email verified successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.json(new ApiResponse(200, {
            token: newToken,
            refreshToken: newRefreshToken
        }, 'Token refreshed successfully'));
    } catch (error) {
        next(new ApiError('Invalid refresh token', 401));
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        await setCache(`reset:${resetToken}`, user._id.toString(), 3600); // 1 hour expiry

        await sendEmail(email, 'Password Reset Request',
            `Click here to reset your password: ${resetUrl}\nThis link expires in 1 hour.`);

        res.json(new ApiResponse(200, null, 'Password reset email sent'));
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const userId = await getCache(`reset:${token}`);
        if (!userId) {
            throw new ApiError('Invalid or expired reset token', 400);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        user.password = password;
        await user.save();

        await deleteCache(`reset:${token}`);

        res.json(new ApiResponse(200, null, 'Password reset successful'));
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        // Invalidate token by adding to blacklist (optional)
        // For now, just return success
        res.json(new ApiResponse(200, null, 'Logged out successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    verifyOTP,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout
};