const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    updateLocation,
    shareLocation,
    getNearbySafePlaces,
    getLocationHistory,
    calculateRouteDistance
} = require('../controllers/locationController');

const locationValidation = [
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    body('accuracy').optional().isFloat()
];

const shareLocationValidation = [
    body('contactId').isMongoId(),
    body('duration').optional().isInt({ min: 60, max: 86400 })
];

router.post('/update', protect, locationValidation, validateRequest, updateLocation);
router.post('/share', protect, shareLocationValidation, validateRequest, shareLocation);
router.get('/nearby/safe-places', protect, getNearbySafePlaces);
router.get('/history', protect, getLocationHistory);
router.post('/distance', protect, calculateRouteDistance);

module.exports = router;