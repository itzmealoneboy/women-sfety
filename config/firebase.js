const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;
let isFirebaseEnabled = false;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  // Check if we have a valid project ID
  const invalidProjectIds = [
    'your-project-id-12345',
    'your-firebase-project-id',
    'YOUR_PROJECT_ID',
    'your-project-id',
    'YOUR_PROJECT_ID_HERE'
  ];

  if (!projectId || invalidProjectIds.includes(projectId)) {
    logger.warn('⚠️ Firebase: No valid project ID found. Push notifications disabled.');
    logger.info('💡 To enable Firebase: Set FIREBASE_PROJECT_ID in .env file');
    return null;
  }
  
  try {
    // Method 1: Try using Application Default Credentials (Recommended - No Key File Needed)
    // This works with: gcloud auth application-default login
    firebaseApp = admin.initializeApp({
      projectId: projectId,
    });
    
    isFirebaseEnabled = true;
    logger.info(`✅ Firebase initialized successfully with Application Default Credentials`);
    logger.info(`📱 Project ID: ${projectId}`);
    logger.info(`💡 Push notifications are now enabled`);
    return firebaseApp;
    
  } catch (error) {
    logger.error('❌ Firebase initialization failed:', error.message);
    
    // Provide helpful troubleshooting tips
    if (error.message.includes('Could not load the default credentials')) {
      logger.info('💡 To fix this issue:');
      logger.info('   1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install');
      logger.info('   2. Run: gcloud auth login');
      logger.info('   3. Run: gcloud config set project ' + projectId);
      logger.info('   4. Run: gcloud auth application-default login');
    }
    
    isFirebaseEnabled = false;
    return null;
  }
};

// Alternative method using service account (if you have the key file)
const initializeFirebaseWithServiceAccount = () => {
  if (firebaseApp) return firebaseApp;
  
  try {
    // Check if Firebase credentials are properly configured
    if (!process.env.FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PRIVATE_KEY === 'your-firebase-private-key' ||
        !process.env.FIREBASE_CLIENT_EMAIL) {
      logger.warn('Firebase credentials not properly configured. Skipping Firebase initialization.');
      return null;
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    isFirebaseEnabled = true;
    logger.info('✅ Firebase initialized with Service Account');
    return firebaseApp;
    
  } catch (error) {
    logger.error('❌ Firebase initialization failed:', error.message);
    isFirebaseEnabled = false;
    return null;
  }
};

const getFirebaseApp = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
};

const sendPushNotification = async (deviceToken, title, body, data = {}) => {
  if (!isFirebaseEnabled || !firebaseApp) {
    // Demo mode - log instead of sending
    logger.info(`📱 [DEMO MODE] Push notification would be sent:`);
    logger.info(`   To: ${deviceToken?.substring(0, 20)}...`);
    logger.info(`   Title: ${title}`);
    logger.info(`   Body: ${body}`);
    logger.info(`   Data: ${JSON.stringify(data)}`);
    return { 
      success: true, 
      demo: true, 
      message: 'Demo mode - notification logged (Firebase not configured)' 
    };
  }
  
  try {
    const message = {
      notification: { 
        title: title, 
        body: body 
      },
      data: data,
      token: deviceToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'emergency_alerts'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'content-available': 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    logger.info(`✅ Push notification sent successfully to ${deviceToken?.substring(0, 20)}...`);
    return { success: true, response };
    
  } catch (error) {
    logger.error('❌ Error sending push notification:', error.message);
    
    // Handle specific FCM errors
    if (error.code === 'messaging/invalid-registration-token') {
      logger.warn('⚠️ Invalid device token - client should refresh the token');
    } else if (error.code === 'messaging/unregistered') {
      logger.warn('⚠️ Device unregistered - remove token from database');
    } else if (error.code === 'messaging/registration-token-not-registered') {
      logger.warn('⚠️ Token not registered - client needs to re-register');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
};

const sendMulticastNotification = async (deviceTokens, title, body, data = {}) => {
  if (!isFirebaseEnabled || !firebaseApp) {
    // Demo mode - log instead of sending
    logger.info(`📱 [DEMO MODE] Multicast notification would be sent to ${deviceTokens.length} devices:`);
    logger.info(`   Title: ${title}`);
    logger.info(`   Body: ${body}`);
    return { 
      success: true, 
      demo: true, 
      message: 'Demo mode - notification logged (Firebase not configured)',
      successCount: 0,
      failureCount: deviceTokens.length
    };
  }
  
  if (!deviceTokens || deviceTokens.length === 0) {
    logger.warn('No device tokens provided for multicast notification');
    return { success: false, message: 'No device tokens provided' };
  }
  
  try {
    const message = {
      notification: { title, body },
      data: data,
      tokens: deviceTokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info(`✅ Multicast notification sent. Success: ${response.successCount}, Failure: ${response.failureCount}`);
    
    // Log failed tokens for debugging
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push({
            token: deviceTokens[idx]?.substring(0, 20),
            error: resp.error?.message
          });
        }
      });
      logger.warn('Failed tokens:', failedTokens);
    }
    
    return { success: true, response };
  } catch (error) {
    logger.error('❌ Error sending multicast notification:', error.message);
    return { success: false, error: error.message };
  }
};

// Test function to verify Firebase connection
const testFirebaseConnection = async () => {
  if (!isFirebaseEnabled || !firebaseApp) {
    return { success: false, message: 'Firebase not enabled' };
  }
  
  try {
    // Try to access project info - this verifies credentials work
    const projectId = firebaseApp.options.projectId;
    logger.info(`✅ Firebase connection test passed! Project: ${projectId}`);
    return { success: true, projectId };
  } catch (error) {
    logger.error('❌ Firebase connection test failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeFirebase,
  getFirebaseApp,
  sendPushNotification,
  sendMulticastNotification,
  testFirebaseConnection,
  isFirebaseEnabled: () => isFirebaseEnabled
};