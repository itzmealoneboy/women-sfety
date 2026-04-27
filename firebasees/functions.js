import { 
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator
} from 'firebase/functions';
import { app } from '../../config/firebases';

const functions = getFunctions(app);

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const functionsService = {
  // Call a callable function
  call: async (name, data = {}) => {
    try {
      const fn = httpsCallable(functions, name);
      const result = await fn(data);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Emergency functions
  emergency: {
    // Trigger SOS
    triggerSOS: (data) => functionsService.call('triggerSOS', data),

    // Notify emergency contacts
    notifyContacts: (data) => functionsService.call('notifyEmergencyContacts', data),

    // Alert police
    alertPolice: (data) => functionsService.call('alertPolice', data),

    // Send location to authorities
    sendLocationToAuthorities: (data) => functionsService.call('sendLocationToAuthorities', data),

    // Create incident report
    createIncidentReport: (data) => functionsService.call('createIncidentReport', data)
  },

  // Notification functions
  notifications: {
    // Send push notification
    sendPush: (data) => functionsService.call('sendPushNotification', data),

    // Send SMS
    sendSMS: (data) => functionsService.call('sendSMS', data),

    // Send email
    sendEmail: (data) => functionsService.call('sendEmail', data),

    // Send WhatsApp message
    sendWhatsApp: (data) => functionsService.call('sendWhatsApp', data),

    // Schedule notification
    schedule: (data) => functionsService.call('scheduleNotification', data)
  },

  // AI functions
  ai: {
    // Analyze threat
    analyzeThreat: (data) => functionsService.call('analyzeThreat', data),

    // Detect deepfake
    detectDeepfake: (data) => functionsService.call('detectDeepfake', data),

    // Generate fake call
    generateFakeCall: (data) => functionsService.call('generateFakeCall', data),

    // Clone voice
    cloneVoice: (data) => functionsService.call('cloneVoice', data),

    // Recognize face
    recognizeFace: (data) => functionsService.call('recognizeFace', data),

    // Predict crime
    predictCrime: (data) => functionsService.call('predictCrime', data)
  },

  // Legal functions
  legal: {
    // Check eligibility
    checkEligibility: (data) => functionsService.call('checkLegalAidEligibility', data),

    // Generate document
    generateDocument: (data) => functionsService.call('generateLegalDocument', data),

    // Find lawyer
    findLawyer: (data) => functionsService.call('findLawyer', data),

    // Schedule consultation
    scheduleConsultation: (data) => functionsService.call('scheduleLegalConsultation', data)
  },

  // Location functions
  location: {
    // Geocode address
    geocode: (data) => functionsService.call('geocodeAddress', data),

    // Reverse geocode
    reverseGeocode: (data) => functionsService.call('reverseGeocode', data),

    // Get safe routes
    getSafeRoutes: (data) => functionsService.call('getSafeRoutes', data),

    // Find nearby safety zones
    findSafetyZones: (data) => functionsService.call('findSafetyZones', data),

    // Calculate safety score
    calculateSafetyScore: (data) => functionsService.call('calculateSafetyScore', data)
  },

  // Crime functions
  crime: {
    // Report crime
    reportCrime: (data) => functionsService.call('reportCrime', data),

    // Get crime stats
    getCrimeStats: (data) => functionsService.call('getCrimeStats', data),

    // Search criminal database
    searchCriminal: (data) => functionsService.call('searchCriminalDatabase', data),

    // Get crime alerts
    getCrimeAlerts: (data) => functionsService.call('getCrimeAlerts', data)
  },

  // Voice functions
  voice: {
    // Text to speech
    textToSpeech: (data) => functionsService.call('textToSpeech', data),

    // Speech to text
    speechToText: (data) => functionsService.call('speechToText', data),

    // Voice authentication
    voiceAuth: (data) => functionsService.call('voiceAuthentication', data)
  },

  // Data functions
  data: {
    // Backup user data
    backupUserData: (data) => functionsService.call('backupUserData', data),

    // Restore user data
    restoreUserData: (data) => functionsService.call('restoreUserData', data),

    // Export data
    exportData: (data) => functionsService.call('exportUserData', data),

    // Delete user data
    deleteUserData: (data) => functionsService.call('deleteUserData', data)
  },

  // Admin functions
  admin: {
    // Get analytics
    getAnalytics: (data) => functionsService.call('getAdminAnalytics', data),

    // Manage users
    manageUsers: (data) => functionsService.call('manageUsers', data),

    // Moderate content
    moderateContent: (data) => functionsService.call('moderateContent', data),

    // Generate reports
    generateReports: (data) => functionsService.call('generateReports', data),

    // System health
    getSystemHealth: (data) => functionsService.call('getSystemHealth', data)
  },

  // Utility functions
  utils: {
    // Validate data
    validateData: (data) => functionsService.call('validateData', data),

    // Format data
    formatData: (data) => functionsService.call('formatData', data),

    // Encrypt data
    encryptData: (data) => functionsService.call('encryptData', data),

    // Decrypt data
    decryptData: (data) => functionsService.call('decryptData', data),

    // Generate report
    generateReport: (data) => functionsService.call('generateReport', data)
  },

  // Schedule functions (cron jobs)
  schedule: {
    // Daily safety check
    dailySafetyCheck: () => functionsService.call('dailySafetyCheck'),

    // Weekly report
    weeklyReport: () => functionsService.call('weeklyReport'),

    // Clean up old data
    cleanupOldData: () => functionsService.call('cleanupOldData'),

    // Send reminders
    sendReminders: () => functionsService.call('sendReminders'),

    // Update crime database
    updateCrimeDatabase: () => functionsService.call('updateCrimeDatabase')
  }
};




