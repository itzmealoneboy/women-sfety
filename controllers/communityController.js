const Post = require('../models/Post');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache, deleteCache } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Create a post
// @route   POST /api/community/posts
// @access  Private
const createPost = async (req, res, next) => {
    try {
        const { content, media, category, tags, isAnonymous } = req.body;

        const post = await Post.create({
            userId: req.user._id,
            content,
            media: media || [],
            category,
            tags: tags || [],
            isAnonymous: isAnonymous || false
        });

        // Clear posts cache
        await deleteCache(`posts:page:*`);

        res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts (feed)
// @route   GET /api/community/posts
// @access  Private
const getPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, category, sort = 'latest' } = req.query;

        const cacheKey = `posts:page:${page}:limit:${limit}:category:${category}:sort:${sort}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(new ApiResponse(200, cached, 'Posts retrieved from cache'));
        }

        const query = { status: 'active' };
        if (category && category !== 'all') query.category = category;

        let sortOption = { createdAt: -1 };
        if (sort === 'popular') sortOption = { likeCount: -1, createdAt: -1 };

        const posts = await Post.find(query)
            .populate('userId', 'name profilePicture')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Add virtual fields
        const postsWithCounts = posts.map(post => ({
            ...post.toObject(),
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            shareCount: post.shareCount,
            isLiked: post.likes.some(like => like.userId.toString() === req.user._id.toString())
        }));

        const total = await Post.countDocuments(query);

        const result = {
            posts: postsWithCounts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };

        await setCache(cacheKey, result, 300); // Cache for 5 minutes

        res.json(new ApiResponse(200, result, 'Posts retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/community/posts/:id
// @access  Private
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'name profilePicture')
            .populate('comments.userId', 'name profilePicture');

        if (!post) {
            throw new ApiError('Post not found', 404);
        }

        // Increment view count
        post.viewCount += 1;
        await post.save();

        const postData = {
            ...post.toObject(),
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            shareCount: post.shareCount,
            isLiked: post.likes.some(like => like.userId.toString() === req.user._id.toString())
        };

        res.json(new ApiResponse(200, postData, 'Post retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Like/unlike a post
// @route   POST /api/community/posts/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new ApiError('Post not found', 404);
        }

        const likeIndex = post.likes.findIndex(
            like => like.userId.toString() === req.user._id.toString()
        );

        let liked = false;
        if (likeIndex === -1) {
            post.likes.push({ userId: req.user._id });
            liked = true;

            // Create notification for post owner
            if (post.userId.toString() !== req.user._id.toString()) {
                await createNotification(
                    post.userId,
                    'community',
                    'Someone liked your post',
                    `${req.user.name} liked your post`,
                    { postId: post._id },
                    'low'
                );
            }
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        // Clear cache
        await deleteCache(`posts:page:*`);

        res.json(new ApiResponse(200, { liked, likeCount: post.likes.length }, 'Post like toggled'));
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
    try {
        const { comment } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new ApiError('Post not found', 404);
        }

        post.comments.push({
            userId: req.user._id,
            comment
        });

        await post.save();

        // Create notification for post owner
        if (post.userId.toString() !== req.user._id.toString()) {
            await createNotification(
                post.userId,
                'community',
                'New comment on your post',
                `${req.user.name} commented: ${comment.substring(0, 50)}...`,
                { postId: post._id },
                'low'
            );
        }

        res.status(201).json(new ApiResponse(201, {
            comment: post.comments[post.comments.length - 1],
            commentCount: post.comments.length
        }, 'Comment added'));
    } catch (error) {
        next(error);
    }
};

// @desc    Report a post
// @route   POST /api/community/posts/:id/report
// @access  Private
const reportPost = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new ApiError('Post not found', 404);
        }

        // Check if user already reported
        const alreadyReported = post.reports.some(
            report => report.userId.toString() === req.user._id.toString()
        );

        if (alreadyReported) {
            throw new ApiError('You have already reported this post', 400);
        }

        post.reports.push({
            userId: req.user._id,
            reason
        });

        // If post has multiple reports, flag for moderation
        if (post.reports.length >= 5) {
            post.isModerated = true;
            post.status = 'reported';
        }

        await post.save();

        res.json(new ApiResponse(200, null, 'Post reported successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    toggleLike,
    addComment,
    reportPost
};