const mongoose = require('mongoose');

const legalAidSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caseType: {
        type: String,
        enum: ['domestic_violence', 'divorce', 'child_custody', 'harassment', 'property', 'employment', 'other'],
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    preferredLanguage: {
        type: String,
        default: 'en'
    },
    location: {
        city: String,
        state: String,
        district: String
    },
    documents: [{
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    assignedLawyer: {
        name: String,
        barId: String,
        contact: String,
        experience: Number,
        specialization: [String]
    },
    consultationDate: Date,
    consultationType: {
        type: String,
        enum: ['in_person', 'video', 'phone'],
        default: 'in_person'
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'resolved', 'cancelled'],
        default: 'pending'
    },
    legalFees: {
        amount: Number,
        currency: { type: String, default: 'INR' },
        isProBono: { type: Boolean, default: false }
    },
    caseUpdates: [{
        update: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
    }],
    resolution: {
        type: String,
        resolvedAt: Date,
        courtOrder: String
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

legalAidSchema.index({ userId: 1, status: 1 });
legalAidSchema.index({ urgency: 1, createdAt: -1 });

module.exports = mongoose.model('LegalAid', legalAidSchema);