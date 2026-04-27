const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, verifyRefreshToken } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const authRateLimiter = require('../middleware/rateLimiter');
const {
    register,
    login,
    verifyOTP,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('password').notEmpty().withMessage('Password is required')
];

const otpValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').matches(/^[0-9]{6}$/).withMessage('OTP must be 6 digits')
];

// Routes
router.post('/register', authRateLimiter, registerValidation, validateRequest, register);
router.post('/login', authRateLimiter, loginValidation, validateRequest, login);
router.post('/verify-otp', otpValidation, validateRequest, verifyOTP);
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', protect, logout);

module.exports = router;