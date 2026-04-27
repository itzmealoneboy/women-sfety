const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    getSafetyTips,
    analyzeText,
    getSafetyRecommendations
} = require('../controllers/aiController');

router.post('/safety-tips', protect, getSafetyTips);
router.post('/analyze-text', protect, analyzeText);
router.post('/recommendations', protect, getSafetyRecommendations);

module.exports = router;