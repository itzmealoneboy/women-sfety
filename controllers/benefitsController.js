const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Get all government schemes
// @route   GET /api/benefits/schemes
// @access  Private
const getAllSchemes = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, category, search, state } = req.query;

        const cacheKey = `schemes:${page}:${limit}:${category}:${search}:${state}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(new ApiResponse(200, cached, 'Schemes retrieved from cache'));
        }

        const query = { isActive: true };
        if (category && category !== 'all') query.category = category;
        if (state) query['eligibility.states'] = state;

        let schemesQuery = Scheme.find(query);

        if (search) {
            schemesQuery = schemesQuery.find({ $text: { $search: search } });
        }

        const schemes = await schemesQuery
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Scheme.countDocuments(query);

        const result = {
            schemes,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };

        await setCache(cacheKey, result, 3600); // Cache for 1 hour

        res.json(new ApiResponse(200, result, 'Schemes retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get scheme by ID
// @route   GET /api/benefits/schemes/:id
// @access  Private
const getSchemeById = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.id);

        if (!scheme) {
            throw new ApiError('Scheme not found', 404);
        }

        // Increment view count
        scheme.viewCount += 1;
        await scheme.save();

        res.json(new ApiResponse(200, scheme, 'Scheme retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get personalized scheme recommendations
// @route   GET /api/benefits/recommendations
// @access  Private
const getPersonalizedRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        // Build eligibility criteria based on user profile
        const criteria = {
            gender: ['female'],
            'eligibility.gender': 'female'
        };

        if (user.dateOfBirth) {
            const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
            criteria['eligibility.ageMin'] = { $lte: age };
            criteria['eligibility.ageMax'] = { $gte: age };
        }

        if (user.address && user.address.state) {
            criteria['eligibility.states'] = user.address.state;
        }

        const recommendations = await Scheme.find({
            isActive: true,
            $or: [
                { 'eligibility.gender': 'female' },
                { 'eligibility.gender': 'all' }
            ]
        })
            .sort({ viewCount: -1 })
            .limit(10);

        res.json(new ApiResponse(200, recommendations, 'Personalized recommendations retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Check user eligibility for a scheme
// @route   POST /api/benefits/check-eligibility/:schemeId
// @access  Private
const checkEligibility = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.schemeId);
        if (!scheme) {
            throw new ApiError('Scheme not found', 404);
        }

        const user = await User.findById(req.user._id);

        const eligibility = {
            eligible: true,
            reasons: []
        };

        // Check gender eligibility
        if (scheme.eligibility.gender &&
            !scheme.eligibility.gender.includes('all') &&
            !scheme.eligibility.gender.includes('female')) {
            eligibility.eligible = false;
            eligibility.reasons.push('Scheme is not available for women');
        }

        // Check age eligibility
        if (user.dateOfBirth && scheme.eligibility.ageMin) {
            const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
            if (age < scheme.eligibility.ageMin) {
                eligibility.eligible = false;
                eligibility.reasons.push(`Minimum age requirement is ${scheme.eligibility.ageMin}`);
            }
            if (scheme.eligibility.ageMax && age > scheme.eligibility.ageMax) {
                eligibility.eligible = false;
                eligibility.reasons.push(`Maximum age limit is ${scheme.eligibility.ageMax}`);
            }
        }

        // Check state eligibility
        if (scheme.eligibility.stateSpecific && scheme.eligibility.states) {
            if (!user.address?.state || !scheme.eligibility.states.includes(user.address.state)) {
                eligibility.eligible = false;
                eligibility.reasons.push('Scheme is only available in specific states');
            }
        }

        res.json(new ApiResponse(200, eligibility, 'Eligibility checked'));
    } catch (error) {
        next(error);
    }
};

// @desc    Create new scheme (Admin only)
// @route   POST /api/benefits/schemes
// @access  Private/Admin
const createScheme = async (req, res, next) => {
    try {
        const schemeData = req.body;

        const scheme = await Scheme.create(schemeData);

        res.status(201).json(new ApiResponse(201, scheme, 'Scheme created successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update scheme (Admin only)
// @route   PUT /api/benefits/schemes/:id
// @access  Private/Admin
const updateScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!scheme) {
            throw new ApiError('Scheme not found', 404);
        }

        res.json(new ApiResponse(200, scheme, 'Scheme updated successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSchemes,
    getSchemeById,
    getPersonalizedRecommendations,
    checkEligibility,
    createScheme,
    updateScheme
};