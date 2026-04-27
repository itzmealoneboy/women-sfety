const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['harassment', 'assault', 'stalking', 'cyber_crime', 'domestic_violence', 'other'],
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 2000
    },
    incidentDate: {
        type: Date,
        required: true
    },
    incidentLocation: {
        address: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    evidence: [{
        type: {
            type: String,
            enum: ['image', 'video', 'audio', 'document']
        },
        url: String,
        fileName: String,
        mimeType: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    witnesses: [{
        name: String,
        phone: String,
        statement: String
    }],
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under_review', 'action_taken', 'resolved', 'rejected'],
        default: 'draft'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adminRemarks: [{
        remark: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
    }],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    caseNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    resolvedAt: Date,
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

// Generate case number before saving
reportSchema.pre('save', async function (next) {
    if (this.isNew && this.status === 'submitted') {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Report').countDocuments();
        this.caseNumber = `SAKHI-${year}-${(count + 1).toString().padStart(6, '0')}`;
    }
    this.updatedAt = Date.now();
    next();
});

// Indexes
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ caseNumber: 1 });

module.exports = mongoose.model('Report', reportSchema);