const Report = require('../models/Reports');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { sendEmail } = require('../services/emailService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache, deleteCache } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
    try {
        const {
            type,
            title,
            description,
            incidentDate,
            incidentLocation,
            evidence,
            witnesses,
            isAnonymous
        } = req.body;

        const report = await Report.create({
            userId: req.user._id,
            type,
            title,
            description,
            incidentDate,
            incidentLocation,
            evidence: evidence || [],
            witnesses: witnesses || [],
            isAnonymous: isAnonymous || false,
            status: 'submitted'
        });

        // Notify admins
        await createNotification(
            req.user._id,
            'report_update',
            'Report Submitted Successfully',
            `Your report "${title}" has been submitted. Reference ID: ${report.caseNumber || report._id}`,
            { reportId: report._id, caseNumber: report.caseNumber },
            'high'
        );

        // Send email confirmation
        await sendEmail(
            req.user.email,
            `Report Confirmation - ${report.caseNumber || 'Sakhi Report'}`,
            `
        <div style="font-family: Arial, sans-serif;">
          <h2>Report Submitted Successfully</h2>
          <p>Dear ${req.user.name},</p>
          <p>Your report has been received and is being reviewed.</p>
          <p><strong>Report ID:</strong> ${report.caseNumber || report._id}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p>We will update you on the status within 48 hours.</p>
          <p>Stay strong! The Sakhi Team is here to support you.</p>
        </div>
      `
        );

        res.status(201).json(new ApiResponse(201, report, 'Report submitted successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, type } = req.query;

        const query = { userId: req.user._id };
        if (status) query.status = status;
        if (type) query.type = type;

        const cacheKey = `user_reports:${req.user._id}:page:${page}:status:${status}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(new ApiResponse(200, cached, 'Reports retrieved from cache'));
        }

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-witnesses'); // Hide sensitive witness info

        const total = await Report.countDocuments(query);

        const result = {
            reports,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };

        await setCache(cacheKey, result, 300); // Cache for 5 minutes

        res.json(new ApiResponse(200, result, 'Reports retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('assignedTo', 'name email role');

        if (!report) {
            throw new ApiError('Report not found', 404);
        }

        // Check authorization
        if (report.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin' &&
            req.user.role !== 'moderator') {
            throw new ApiError('Not authorized to view this report', 403);
        }

        // If user is not admin, hide some fields
        if (req.user.role === 'user' && report.userId.toString() === req.user._id.toString()) {
            report.witnesses = undefined;
        }

        res.json(new ApiResponse(200, report, 'Report retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminRemarks, assignedTo } = req.body;

        const report = await Report.findById(req.params.id);
        if (!report) {
            throw new ApiError('Report not found', 404);
        }

        const oldStatus = report.status;
        report.status = status;

        if (adminRemarks) {
            report.adminRemarks.push({
                remark: adminRemarks,
                addedBy: req.user._id
            });
        }

        if (assignedTo) {
            report.assignedTo = assignedTo;
        }

        if (status === 'resolved') {
            report.resolvedAt = new Date();
        }

        await report.save();

        // Notify user about status change
        let statusMessage = '';
        switch (status) {
            case 'under_review':
                statusMessage = 'Your report is under review by our team.';
                break;
            case 'action_taken':
                statusMessage = 'Action has been taken on your report.';
                break;
            case 'resolved':
                statusMessage = 'Your report has been resolved.';
                break;
            case 'rejected':
                statusMessage = 'Your report has been reviewed and not accepted. Please contact support for more information.';
                break;
        }

        await createNotification(
            report.userId,
            'report_update',
            `Report Status Update - ${report.caseNumber || report._id}`,
            statusMessage,
            { reportId: report._id, status, oldStatus },
            'medium'
        );

        res.json(new ApiResponse(200, report, 'Report status updated'));
    } catch (error) {
        next(error);
    }
};

// @desc    Add evidence to report
// @route   POST /api/reports/:id/evidence
// @access  Private
const addEvidence = async (req, res, next) => {
    try {
        const { type, url, fileName, mimeType, size } = req.body;

        const report = await Report.findById(req.params.id);
        if (!report) {
            throw new ApiError('Report not found', 404);
        }

        if (report.userId.toString() !== req.user._id.toString()) {
            throw new ApiError('Not authorized to add evidence to this report', 403);
        }

        report.evidence.push({
            type,
            url,
            fileName,
            mimeType,
            size
        });

        await report.save();

        res.json(new ApiResponse(200, report.evidence, 'Evidence added successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get report statistics (Admin only)
// @route   GET /api/reports/statistics
// @access  Private/Admin
const getReportStatistics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const statistics = {
            total: await Report.countDocuments(query),
            byStatus: await Report.aggregate([
                { $match: query },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            byType: await Report.aggregate([
                { $match: query },
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]),
            byPriority: await Report.aggregate([
                { $match: query },
                { $group: { _id: '$priority', count: { $sum: 1 } } }
            ]),
            averageResolutionTime: await Report.aggregate([
                { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
                { $project: { resolutionTime: { $subtract: ['$resolvedAt', '$createdAt'] } } },
                { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
            ])
        };

        res.json(new ApiResponse(200, statistics, 'Statistics retrieved'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReport,
    getMyReports,
    getReportById,
    updateReportStatus,
    addEvidence,
    getReportStatistics
};