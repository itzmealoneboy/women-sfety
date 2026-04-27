const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { sosRateLimiter } = require('../middleware/rateLimiter');
const {
    triggerSOS,
    updateEmergencyStatus,
    getEmergencyHistory,
    cancelEmergency
} = require('../controllers/emergencyController');

const sosValidation = [
    body('type').isIn(['sos', 'medical', 'fire', 'accident', 'harassment', 'domestic_violence', 'other']),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    body('description').optional().isLength({ max: 500 })
];

router.post('/sos', protect, sosRateLimiter, sosValidation, validateRequest, triggerSOS);
router.put('/:id/status', protect, updateEmergencyStatus);
router.get('/history', protect, getEmergencyHistory);
router.post('/:id/cancel', protect, cancelEmergency);

module.exports = router;