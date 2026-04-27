const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    createReport,
    getMyReports,
    getReportById,
    updateReportStatus,
    addEvidence,
    getReportStatistics
} = require('../controllers/reportController');

const reportValidation = [
    body('type').isIn(['harassment', 'assault', 'stalking', 'cyber_crime', 'domestic_violence', 'other']),
    body('title').notEmpty().isLength({ min: 5, max: 100 }),
    body('description').notEmpty().isLength({ min: 20, max: 2000 }),
    body('incidentDate').isISO8601(),
    body('incidentLocation.address').optional().isString()
];

router.post('/', protect, reportValidation, validateRequest, createReport);
router.get('/my-reports', protect, getMyReports);
router.get('/statistics', protect, authorize('admin'), getReportStatistics);
router.get('/:id', protect, getReportById);
router.put('/:id/status', protect, authorize('admin', 'moderator'), updateReportStatus);
router.post('/:id/evidence', protect, addEvidence);

module.exports = router;