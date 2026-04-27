const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['sos', 'medical', 'fire', 'accident', 'harassment', 'domestic_violence', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'responded', 'resolved', 'cancelled'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'high'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        address: String,
        city: String,
        state: String
    },
    description: {
        type: String,
        maxlength: 500
    },
    contactedAuthorities: [{
        authority: { type: String, enum: ['police', 'ambulance', 'fire', 'women_helpline'] },
        contactedAt: { type: Date, default: Date.now },
        response: String,
        caseNumber: String
    }],
    notifiedContacts: [{
        contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        phone: String,
        notifiedAt: Date,
        acknowledged: { type: Boolean, default: false }
    }],
    audioRecording: {
        url: String,
        duration: Number,
        uploadedAt: Date
    },
    videoRecording: {
        url: String,
        duration: Number,
        uploadedAt: Date
    },
    resolvedAt: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolutionNotes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for geospatial queries
emergencySchema.index({ location: '2dsphere' });
emergencySchema.index({ userId: 1, status: 1 });
emergencySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Emergency', emergencySchema);