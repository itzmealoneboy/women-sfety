const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    getAllSchemes,
    getSchemeById,
    getPersonalizedRecommendations,
    checkEligibility,
    createScheme,
    updateScheme
} = require('../controllers/benefitsController');

router.get('/schemes', protect, getAllSchemes);
router.get('/schemes/recommendations', protect, getPersonalizedRecommendations);
router.get('/schemes/:id', protect, getSchemeById);
router.post('/schemes/:schemeId/check-eligibility', protect, checkEligibility);
router.post('/schemes', protect, authorize('admin'), createScheme);
router.put('/schemes/:id', protect, authorize('admin'), updateScheme);

module.exports = router;