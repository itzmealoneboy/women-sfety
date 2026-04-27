const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    getProfile,
    updateProfile,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addDeviceToken,
    removeDeviceToken,
    changePassword,
    getSafetyScore
} = require('../controllers/userController');

const emergencyContactValidation = [
    body('name').notEmpty().isLength({ min: 2 }),
    body('relationship').notEmpty(),
    body('phone').matches(/^[0-9]{10}$/),
    body('email').optional().isEmail()
];

const changePasswordValidation = [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
];

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/emergency-contacts', protect, emergencyContactValidation, validateRequest, addEmergencyContact);
router.put('/emergency-contacts/:contactId', protect, emergencyContactValidation, validateRequest, updateEmergencyContact);
router.delete('/emergency-contacts/:contactId', protect, deleteEmergencyContact);
router.post('/device-token', protect, addDeviceToken);
router.delete('/device-token', protect, removeDeviceToken);
router.post('/change-password', protect, changePasswordValidation, validateRequest, changePassword);
router.get('/safety-score', protect, getSafetyScore);

module.exports = router;