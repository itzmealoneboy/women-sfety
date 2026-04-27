const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
    createPost,
    getPosts,
    getPostById,
    toggleLike,
    addComment,
    reportPost
} = require('../controllers/communityController');

const postValidation = [
    body('content').notEmpty().isLength({ min: 1, max: 2000 }),
    body('category').isIn(['safety_tip', 'experience', 'support', 'awareness', 'question', 'general']),
    body('tags').optional().isArray(),
    body('isAnonymous').optional().isBoolean()
];

const commentValidation = [
    body('comment').notEmpty().isLength({ min: 1, max: 500 })
];

router.post('/posts', protect, postValidation, validateRequest, createPost);
router.get('/posts', protect, getPosts);
router.get('/posts/:id', protect, getPostById);
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/comments', protect, commentValidation, validateRequest, addComment);
router.post('/posts/:id/report', protect, reportPost);

module.exports = router;