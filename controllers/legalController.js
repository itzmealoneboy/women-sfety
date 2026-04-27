const LegalAid = require('../models/LegalAid');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// @desc    Request legal aid
// @route   POST /api/legal/request
// @access  Private
const requestLegalAid = async (req, res, next) => {
    try {
        const {
            caseType,
            description,
            urgency,
            preferredLanguage,
            location,
            documents
        } = req.body;

        const legalAid = await LegalAid.create({
            userId: req.user._id,
            caseType,
            description,
            urgency,
            preferredLanguage,
            location,
            documents: documents || []
        });

        // Notify admins about new legal aid request
        await createNotification(
            req.user._id,
            'legal_update',
            'Legal Aid Request Submitted',
            `Your legal aid request (${caseType}) has been submitted successfully. We'll connect you with a lawyer soon.`,
            { legalAidId: legalAid._id },
            'high'
        );

        // Send email confirmation
        await sendEmail(
            req.user.email,
            'Legal Aid Request Confirmation - Sakhi',
            `
        <h2>Legal Aid Request Submitted</h2>
        <p>Dear ${req.user.name},</p>
        <p>Your legal aid request for <strong>${caseType}</strong> has been received.</p>
        <p>Reference ID: ${legalAid._id}</p>
        <p>We will assign a lawyer within 24-48 hours.</p>
        <p>Stay strong! The Sakhi Team is here for you.</p>
      `
        );

        res.status(201).json(new ApiResponse(201, legalAid, 'Legal aid request submitted'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's legal aid requests
// @route   GET /api/legal/my-requests
// @access  Private
const getMyLegalRequests = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { userId: req.user._id };
        if (status) query.status = status;

        const requests = await LegalAid.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LegalAid.countDocuments(query);

        res.json(new ApiResponse(200, {
            requests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }, 'Legal requests retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get legal aid by ID
// @route   GET /api/legal/:id
// @access  Private
const getLegalAidById = async (req, res, next) => {
    try {
        const legalAid = await LegalAid.findById(req.params.id);

        if (!legalAid) {
            throw new ApiError('Legal aid request not found', 404);
        }

        if (legalAid.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new ApiError('Not authorized', 403);
        }

        res.json(new ApiResponse(200, legalAid, 'Legal aid details retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update legal aid status (Admin only)
// @route   PUT /api/legal/:id/status
// @access  Private/Admin
const updateLegalStatus = async (req, res, next) => {
    try {
        const { status, assignedLawyer, consultationDate, legalFees } = req.body;

        const legalAid = await LegalAid.findById(req.params.id);
        if (!legalAid) {
            throw new ApiError('Legal aid request not found', 404);
        }

        if (status) legalAid.status = status;
        if (assignedLawyer) legalAid.assignedLawyer = assignedLawyer;
        if (consultationDate) legalAid.consultationDate = consultationDate;
        if (legalFees) legalAid.legalFees = legalFees;

        await legalAid.save();

        // Notify user about update
        await createNotification(
            legalAid.userId,
            'legal_update',
            'Legal Aid Request Updated',
            `Your legal aid request has been updated. Status: ${status}`,
            { legalAidId: legalAid._id },
            'medium'
        );

        res.json(new ApiResponse(200, legalAid, 'Legal aid status updated'));
    } catch (error) {
        next(error);
    }
};

// @desc    Add case update
// @route   POST /api/legal/:id/updates
// @access  Private
const addCaseUpdate = async (req, res, next) => {
    try {
        const { update } = req.body;

        const legalAid = await LegalAid.findById(req.params.id);
        if (!legalAid) {
            throw new ApiError('Legal aid request not found', 404);
        }

        if (legalAid.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new ApiError('Not authorized', 403);
        }

        legalAid.caseUpdates.push({
            update,
            addedBy: req.user._id
        });

        await legalAid.save();

        // Notify other party
        const notifyUserId = req.user.role === 'admin' ? legalAid.userId : legalAid.assignedLawyer?._id;
        if (notifyUserId) {
            await createNotification(
                notifyUserId,
                'legal_update',
                'New Case Update',
                update.substring(0, 100),
                { legalAidId: legalAid._id },
                'low'
            );
        }

        res.json(new ApiResponse(200, legalAid, 'Case update added'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestLegalAid,
    getMyLegalRequests,
    getLegalAidById,
    updateLegalStatus,
    addCaseUpdate
};