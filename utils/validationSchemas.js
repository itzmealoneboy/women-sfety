const Joi = require('joi');

const userValidationSchema = {
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
        password: Joi.string().min(6).required()
    }),

    login: Joi.object({
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().required()
    }).xor('email', 'phone'),

    updateProfile: Joi.object({
        name: Joi.string().min(2).max(50),
        dateOfBirth: Joi.date(),
        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),
            country: Joi.string()
        }),
        preferences: Joi.object({
            notifications: Joi.object({
                email: Joi.boolean(),
                sms: Joi.boolean(),
                push: Joi.boolean()
            }),
            language: Joi.string(),
            locationTracking: Joi.boolean()
        })
    })
};

const emergencyValidationSchema = {
    triggerSOS: Joi.object({
        type: Joi.string().valid('sos', 'medical', 'fire', 'accident', 'harassment', 'domestic_violence', 'other').required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
        description: Joi.string().max(500)
    })
};

const reportValidationSchema = {
    createReport: Joi.object({
        type: Joi.string().valid('harassment', 'assault', 'stalking', 'cyber_crime', 'domestic_violence', 'other').required(),
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(20).max(2000).required(),
        incidentDate: Joi.date().iso().required(),
        incidentLocation: Joi.object({
            address: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string(),
            coordinates: Joi.object({
                lat: Joi.number(),
                lng: Joi.number()
            })
        }),
        isAnonymous: Joi.boolean()
    })
};

const legalAidValidationSchema = {
    requestLegalAid: Joi.object({
        caseType: Joi.string().valid('domestic_violence', 'divorce', 'child_custody', 'harassment', 'property', 'employment', 'other').required(),
        description: Joi.string().min(20).max(2000).required(),
        urgency: Joi.string().valid('low', 'medium', 'high', 'critical'),
        preferredLanguage: Joi.string(),
        location: Joi.object({
            city: Joi.string(),
            state: Joi.string(),
            district: Joi.string()
        })
    })
};

const communityValidationSchema = {
    createPost: Joi.object({
        content: Joi.string().min(1).max(2000).required(),
        category: Joi.string().valid('safety_tip', 'experience', 'support', 'awareness', 'question', 'general'),
        tags: Joi.array().items(Joi.string()),
        isAnonymous: Joi.boolean()
    }),

    addComment: Joi.object({
        comment: Joi.string().min(1).max(500).required()
    })
};

module.exports = {
    userValidationSchema,
    emergencyValidationSchema,
    reportValidationSchema,
    legalAidValidationSchema,
    communityValidationSchema
};