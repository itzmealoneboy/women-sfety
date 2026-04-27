const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    requestLegalAid,
    getMyLegalRequests,
    getLegalAidById,
    updateLegalStatus,
    addCaseUpdate
} = require('../controllers/legalController');

const legalRequestValidation = [
    body('caseType').isIn(['domestic_violence', 'divorce', 'child_custody', 'harassment', 'property', 'employment', 'other']),
    body('description').notEmpty().isLength({ min: 20, max: 2000 }),
    body('urgency').isIn(['low', 'medium', 'high', 'critical']),
    body('preferredLanguage').optional().isString(),
    body('location.city').optional().isString()
];

router.post('/request', protect, legalRequestValidation, validateRequest, requestLegalAid);
router.get('/my-requests', protect, getMyLegalRequests);
router.get('/:id', protect, getLegalAidById);
router.put('/:id/status', protect, authorize('admin'), updateLegalStatus);
router.post('/:id/updates', protect, addCaseUpdate);

module.exports = router;