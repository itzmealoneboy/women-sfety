const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['financial', 'legal', 'healthcare', 'education', 'employment', 'housing', 'safety'],
        required: true
    },
    benefits: [{
        type: String,
        required: true
    }],
    eligibility: {
        gender: [String],
        ageMin: Number,
        ageMax: Number,
        incomeLimit: Number,
        maritalStatus: [String],
        stateSpecific: Boolean,
        states: [String],
        additionalCriteria: String
    },
    documents: [{
        name: String,
        required: Boolean,
        description: String
    }],
    applicationProcess: {
        mode: {
            type: String,
            enum: ['online', 'offline', 'both'],
            default: 'both'
        },
        steps: [String],
        website: String,
        helpline: String,
        applicationForm: String
    },
    deadline: Date,
    funding: {
        amount: Number,
        currency: { type: String, default: 'INR' },
        frequency: {
            type: String,
            enum: ['one_time', 'monthly', 'yearly']
        }
    },
    implementingAgency: {
        name: String,
        contact: String,
        email: String,
        website: String
    },
    tags: [String],
    languages: [{
        type: String,
        default: ['en', 'hi']
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
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

// Indexes
schemeSchema.index({ name: 'text', description: 'text', tags: 'text' });
schemeSchema.index({ category: 1, isActive: 1 });
schemeSchema.index({ 'eligibility.stateSpecific': 1, 'eligibility.states': 1 });

module.exports = mongoose.model('Scheme', schemeSchema);