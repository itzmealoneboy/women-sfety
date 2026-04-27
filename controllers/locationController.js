const User = require('../models/User');
const Emergency = require('../models/Emergency');
const { getAddressFromCoordinates, calculateDistance, getNearbyServices } = require('../services/geoService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache } = require('../config/redis');
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

// @desc    Update user location
// @route   POST /api/location/update
// @access  Private
const updateLocation = async (req, res, next) => {
    try {
        const { latitude, longitude, accuracy } = req.body;

        if (!latitude || !longitude) {
            throw new ApiError('Latitude and longitude are required', 400);
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Get address from coordinates
        const address = await getAddressFromCoordinates(latitude, longitude);

        // Update user's last known location in cache
        const locationData = {
            userId: req.user._id,
            latitude,
            longitude,
            address: address.formattedAddress,
            accuracy,
            timestamp: new Date()
        };

        await setCache(`location:${req.user._id}`, locationData, 300); // Cache for 5 minutes

        // Update user's address in database if changed significantly
        if (user.address && user.address.city !== address.city) {
            user.address = {
                ...user.address,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            };
            await user.save();
        }

        // Emit location update to trusted circles if enabled
        if (user.preferences.locationTracking) {
            const io = getIO();
            io.to(`user_${req.user._id}`).emit('location_updated', locationData);
        }

        res.json(new ApiResponse(200, locationData, 'Location updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Share location with trusted contact
// @route   POST /api/location/share
// @access  Private
const shareLocation = async (req, res, next) => {
    try {
        const { contactId, duration = 3600 } = req.body;

        const user = await User.findById(req.user._id);
        const contact = await User.findById(contactId);

        if (!contact) {
            throw new ApiError('Contact not found', 404);
        }

        // Check if contact is in trusted circle
        const isTrusted = user.trustedCircles.some(
            circle => circle.userId.toString() === contactId && circle.status === 'accepted'
        );

        if (!isTrusted) {
            throw new ApiError('Contact is not in your trusted circle', 403);
        }

        // Get current location
        const cachedLocation = await getCache(`location:${req.user._id}`);
        if (!cachedLocation) {
            throw new ApiError('Current location not available', 404);
        }

        // Generate share token
        const shareToken = require('crypto').randomBytes(32).toString('hex');
        await setCache(`share:${shareToken}`, {
            userId: req.user._id,
            contactId,
            expiresAt: Date.now() + (duration * 1000)
        }, duration);

        // Notify contact via socket
        const io = getIO();
        io.to(`user_${contactId}`).emit('location_shared', {
            userId: req.user._id,
            userName: user.name,
            shareToken,
            duration
        });

        res.json(new ApiResponse(200, {
            shareToken,
            location: cachedLocation,
            expiresIn: duration
        }, 'Location shared successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get nearby safe places
// @route   GET /api/location/nearby/safe-places
// @access  Private
const getNearbySafePlaces = async (req, res, next) => {
    try {
        const { latitude, longitude, radius = 5 } = req.query;

        if (!latitude || !longitude) {
            throw new ApiError('Latitude and longitude are required', 400);
        }

        const cacheKey = `safeplaces:${latitude}:${longitude}:${radius}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(new ApiResponse(200, cached, 'Nearby safe places retrieved from cache'));
        }

        // Fetch nearby police stations, hospitals, women's helpline centers
        const services = await getNearbyServices(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(radius)
        );

        const safePlaces = {
            policeStations: services.police || [],
            hospitals: services.hospitals || [],
            womensHelpline: services.womensHelpline || [],
            safeHouses: services.safeHouses || []
        };

        await setCache(cacheKey, safePlaces, 3600); // Cache for 1 hour

        res.json(new ApiResponse(200, safePlaces, 'Nearby safe places retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get location history
// @route   GET /api/location/history
// @access  Private
const getLocationHistory = async (req, res, next) => {
    try {
        const { startDate, endDate, limit = 50 } = req.query;

        // Get location history from database or cache
        const history = await getCache(`location_history:${req.user._id}`);

        if (!history) {
            return res.json(new ApiResponse(200, [], 'No location history found'));
        }

        let filteredHistory = history;
        if (startDate) {
            filteredHistory = filteredHistory.filter(h => new Date(h.timestamp) >= new Date(startDate));
        }
        if (endDate) {
            filteredHistory = filteredHistory.filter(h => new Date(h.timestamp) <= new Date(endDate));
        }

        filteredHistory = filteredHistory.slice(0, limit);

        res.json(new ApiResponse(200, filteredHistory, 'Location history retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get distance to destination
// @route   POST /api/location/distance
// @access  Private
const calculateRouteDistance = async (req, res, next) => {
    try {
        const { originLat, originLng, destLat, destLng, mode = 'driving' } = req.body;

        const distance = await calculateDistance(
            originLat, originLng,
            destLat, destLng,
            mode
        );

        res.json(new ApiResponse(200, distance, 'Distance calculated'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateLocation,
    shareLocation,
    getNearbySafePlaces,
    getLocationHistory,
    calculateRouteDistance
};