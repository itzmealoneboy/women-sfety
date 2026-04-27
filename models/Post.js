const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    media: [{
        type: {
            type: String,
            enum: ['image', 'video', 'audio']
        },
        url: String,
        thumbnail: String
    }],
    category: {
        type: String,
        enum: ['safety_tip', 'experience', 'support', 'awareness', 'question', 'general'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likedAt: { type: Date, default: Date.now }
    }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    shares: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sharedAt: { type: Date, default: Date.now }
    }],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isModerated: {
        type: Boolean,
        default: false
    },
    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'reported', 'blocked', 'deleted'],
        default: 'active'
    },
    reports: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        reportedAt: { type: Date, default: Date.now }
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function () {
    return this.shares.length;
});

// Indexes
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ content: 'text' });

module.exports = mongoose.model('Post', postSchema);