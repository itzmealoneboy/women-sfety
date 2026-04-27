const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache, deleteCache } = require('../config/redis');
const { sanitizeUserData } = require('../utils/helpers');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -__v');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        res.json(new ApiResponse(200, sanitizeUserData(user), 'Profile retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, dateOfBirth, address, preferences } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (address) user.address = { ...user.address, ...address };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        await user.save();

        // Clear user cache
        await deleteCache(`user:${user._id}`);

        res.json(new ApiResponse(200, sanitizeUserData(user), 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Add emergency contact
// @route   POST /api/users/emergency-contacts
// @access  Private
const addEmergencyContact = async (req, res, next) => {
    try {
        const { name, relationship, phone, email, isPrimary } = req.body;

        const user = await User.findById(req.user._id);

        // Check limit
        if (user.emergencyContacts.length >= 5) {
            throw new ApiError('Maximum 5 emergency contacts allowed', 400);
        }

        // If setting as primary, unset other primary contacts
        if (isPrimary) {
            user.emergencyContacts.forEach(contact => {
                contact.isPrimary = false;
            });
        }

        user.emergencyContacts.push({
            name,
            relationship,
            phone,
            email,
            isPrimary: isPrimary || false
        });

        await user.save();

        res.status(201).json(new ApiResponse(201, user.emergencyContacts, 'Emergency contact added'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update emergency contact
// @route   PUT /api/users/emergency-contacts/:contactId
// @access  Private
const updateEmergencyContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, relationship, phone, email, isPrimary } = req.body;

        const user = await User.findById(req.user._id);

        const contact = user.emergencyContacts.id(contactId);
        if (!contact) {
            throw new ApiError('Emergency contact not found', 404);
        }

        if (name) contact.name = name;
        if (relationship) contact.relationship = relationship;
        if (phone) contact.phone = phone;
        if (email) contact.email = email;

        if (isPrimary) {
            user.emergencyContacts.forEach(c => {
                c.isPrimary = false;
            });
            contact.isPrimary = true;
        }

        await user.save();

        res.json(new ApiResponse(200, user.emergencyContacts, 'Emergency contact updated'));
    } catch (error) {
        next(error);
    }
};

// @desc    Delete emergency contact
// @route   DELETE /api/users/emergency-contacts/:contactId
// @access  Private
const deleteEmergencyContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;

        const user = await User.findById(req.user._id);

        const contact = user.emergencyContacts.id(contactId);
        if (!contact) {
            throw new ApiError('Emergency contact not found', 404);
        }

        contact.remove();
        await user.save();

        res.json(new ApiResponse(200, null, 'Emergency contact deleted'));
    } catch (error) {
        next(error);
    }
};

// @desc    Add device token for push notifications
// @route   POST /api/users/device-token
// @access  Private
const addDeviceToken = async (req, res, next) => {
    try {
        const { token, platform } = req.body;

        const user = await User.findById(req.user._id);

        // Check if token already exists
        const tokenExists = user.deviceTokens.some(dt => dt.token === token);
        if (!tokenExists) {
            user.deviceTokens.push({ token, platform });
            await user.save();
        }

        res.json(new ApiResponse(200, null, 'Device token added'));
    } catch (error) {
        next(error);
    }
};

// @desc    Remove device token
// @route   DELETE /api/users/device-token
// @access  Private
const removeDeviceToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        const user = await User.findById(req.user._id);

        user.deviceTokens = user.deviceTokens.filter(dt => dt.token !== token);
        await user.save();

        res.json(new ApiResponse(200, null, 'Device token removed'));
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new ApiError('Current password is incorrect', 401);
        }

        user.password = newPassword;
        await user.save();

        res.json(new ApiResponse(200, null, 'Password changed successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's safety score
// @route   GET /api/users/safety-score
// @access  Private
const getSafetyScore = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('safetyScore');

        // Calculate safety score based on various factors
        let score = 100;

        // Check if user has emergency contacts
        const emergencyContactsCount = await User.aggregate([
            { $match: { _id: user._id } },
            { $project: { count: { $size: '$emergencyContacts' } } }
        ]);

        if (emergencyContactsCount[0]?.count < 2) {
            score -= 10;
        }

        // Check if location tracking is enabled
        if (!user.preferences?.locationTracking) {
            score -= 15;
        }

        // Check if user is verified
        if (!user.isVerified) {
            score -= 20;
        }

        user.safetyScore = Math.max(0, score);
        await user.save();

        res.json(new ApiResponse(200, { safetyScore: user.safetyScore }, 'Safety score retrieved'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addDeviceToken,
    removeDeviceToken,
    changePassword,
    getSafetyScore
};