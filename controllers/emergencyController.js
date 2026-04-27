const Emergency = require('../models/Emergency');
const User = require('../models/User');
const { sendSOSAlert } = require('../services/notificationService');
const { getAddressFromCoordinates } = require('../services/geoService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

// @desc    Trigger SOS
// @route   POST /api/emergency/sos
// @access  Private
const triggerSOS = async (req, res, next) => {
    try {
        const { type, latitude, longitude, description } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId).populate('emergencyContacts');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Get address from coordinates
        const address = await getAddressFromCoordinates(latitude, longitude);

        // Create emergency record
        const emergency = await Emergency.create({
            userId,
            type,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
                address: address.formattedAddress,
                city: address.city,
                state: address.state
            },
            status: 'active'
        });

        // Send alerts to emergency contacts
        const notifiedContacts = [];
        for (const contact of user.emergencyContacts) {
            try {
                await sendSOSAlert({
                    phone: contact.phone,
                    name: contact.name,
                    userName: user.name,
                    location: address.formattedAddress,
                    emergencyType: type,
                    emergencyId: emergency._id
                });

                notifiedContacts.push({
                    contactId: contact._id,
                    phone: contact.phone,
                    notifiedAt: new Date()
                });
            } catch (error) {
                logger.error(`Failed to notify contact ${contact.phone}:`, error);
            }
        }

        emergency.notifiedContacts = notifiedContacts;

        // Contact authorities based on emergency type
        const authorities = [];
        if (type === 'sos' || type === 'harassment' || type === 'domestic_violence') {
            authorities.push('police', 'women_helpline');
        } else if (type === 'medical') {
            authorities.push('ambulance');
        } else if (type === 'fire') {
            authorities.push('fire');
        }

        for (const authority of authorities) {
            emergency.contactedAuthorities.push({
                authority,
                contactedAt: new Date()
            });
        }

        await emergency.save();

        // Emit socket event for real-time monitoring
        const io = getIO();
        io.emit(`emergency_${userId}`, {
            emergencyId: emergency._id,
            type,
            location: emergency.location,
            status: 'active'
        });

        // Notify nearby users (optional safety network)
        await notifyNearbyUsers(latitude, longitude, userId, emergency._id);

        res.status(201).json(new ApiResponse(201, {
            emergencyId: emergency._id,
            status: emergency.status,
            notifiedContacts: notifiedContacts.length,
            authoritiesNotified: authorities
        }, 'SOS triggered successfully'));

    } catch (error) {
        next(error);
    }
};

// Helper function to notify nearby users
const notifyNearbyUsers = async (latitude, longitude, userId, emergencyId) => {
    try {
        const nearbyUsers = await User.find({
            _id: { $ne: userId },
            'preferences.locationTracking': true,
            isActive: true
        }).limit(10);

        const io = getIO();
        for (const user of nearbyUsers) {
            io.emit(`nearby_emergency_${user._id}`, {
                emergencyId,
                location: { latitude, longitude }
            });
        }
    } catch (error) {
        logger.error('Error notifying nearby users:', error);
    }
};

// @desc    Update emergency status
// @route   PUT /api/emergency/:id/status
// @access  Private
const updateEmergencyStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, resolutionNotes } = req.body;

        const emergency = await Emergency.findById(id);

        if (!emergency) {
            throw new ApiError('Emergency record not found', 404);
        }

        if (emergency.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new ApiError('Not authorized', 403);
        }

        emergency.status = status;
        if (status === 'resolved') {
            emergency.resolvedAt = new Date();
            emergency.resolvedBy = req.user._id;
            emergency.resolutionNotes = resolutionNotes;
        }

        await emergency.save();

        // Emit socket update
        const io = getIO();
        io.emit(`emergency_update_${emergency.userId}`, {
            emergencyId: id,
            status
        });

        res.json(new ApiResponse(200, emergency, 'Emergency status updated'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's emergency history
// @route   GET /api/emergency/history
// @access  Private
const getEmergencyHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { userId: req.user._id };
        if (status) query.status = status;

        const emergencies = await Emergency.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Emergency.countDocuments(query);

        res.json(new ApiResponse(200, {
            emergencies,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }, 'Emergency history retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel active emergency
// @route   POST /api/emergency/:id/cancel
// @access  Private
const cancelEmergency = async (req, res, next) => {
    try {
        const { id } = req.params;

        const emergency = await Emergency.findOne({
            _id: id,
            userId: req.user._id,
            status: 'active'
        });

        if (!emergency) {
            throw new ApiError('No active emergency found', 404);
        }

        emergency.status = 'cancelled';
        await emergency.save();

        // Notify contacts that emergency is cancelled
        const io = getIO();
        io.emit(`emergency_cancelled_${req.user._id}`, {
            emergencyId: id
        });

        res.json(new ApiResponse(200, null, 'Emergency cancelled successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    triggerSOS,
    updateEmergencyStatus,
    getEmergencyHistory,
    cancelEmergency
};