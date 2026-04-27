module.exports = {
    // User Roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        MODERATOR: 'moderator',
        EMERGENCY_RESPONDER: 'emergency_responder'
    },

    // Emergency Types
    EMERGENCY_TYPES: {
        SOS: 'sos',
        MEDICAL: 'medical',
        FIRE: 'fire',
        ACCIDENT: 'accident',
        HARASSMENT: 'harassment',
        DOMESTIC_VIOLENCE: 'domestic_violence',
        OTHER: 'other'
    },

    // Emergency Status
    EMERGENCY_STATUS: {
        ACTIVE: 'active',
        RESPONDED: 'responded',
        RESOLVED: 'resolved',
        CANCELLED: 'cancelled'
    },

    // Report Status
    REPORT_STATUS: {
        DRAFT: 'draft',
        SUBMITTED: 'submitted',
        UNDER_REVIEW: 'under_review',
        ACTION_TAKEN: 'action_taken',
        RESOLVED: 'resolved',
        REJECTED: 'rejected'
    },

    // Notification Types
    NOTIFICATION_TYPES: {
        EMERGENCY: 'emergency',
        SAFETY_ALERT: 'safety_alert',
        COMMUNITY: 'community',
        LEGAL_UPDATE: 'legal_update',
        REPORT_UPDATE: 'report_update',
        SYSTEM: 'system',
        REMINDER: 'reminder'
    },

    // Notification Priority
    NOTIFICATION_PRIORITY: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical'
    },

    // Cache Keys
    CACHE_KEYS: {
        USER_LOCATION: (userId) => `location:${userId}`,
        USER_SESSION: (userId) => `session:${userId}`,
        POSTS_FEED: (page, limit) => `posts:${page}:${limit}`,
        NEARBY_PLACES: (lat, lng, radius) => `nearby:${lat}:${lng}:${radius}`
    },

    // API Response Messages
    MESSAGES: {
        SUCCESS: {
            LOGIN_SUCCESS: 'Login successful',
            REGISTRATION_SUCCESS: 'Registration successful',
            SOS_TRIGGERED: 'SOS triggered successfully',
            LOCATION_UPDATED: 'Location updated successfully',
            REPORT_SUBMITTED: 'Report submitted successfully'
        },
        ERROR: {
            UNAUTHORIZED: 'Not authorized to access this route',
            FORBIDDEN: 'Access forbidden',
            NOT_FOUND: 'Resource not found',
            VALIDATION_ERROR: 'Validation error',
            SERVER_ERROR: 'Internal server error'
        }
    },

    // Safety Settings
    SAFETY_SETTINGS: {
        MAX_EMERGENCY_CONTACTS: 5,
        SOS_RETRY_ATTEMPTS: 3,
        LOCATION_UPDATE_INTERVAL: 5000, // 5 seconds
        EMERGENCY_TIMEOUT: 300000 // 5 minutes
    }
};