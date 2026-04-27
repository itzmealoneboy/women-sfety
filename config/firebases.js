import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here');
};

let app;
let auth;
let db;
let storage;
let rtdb;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
    });
    storage = getStorage(app);
    rtdb = getDatabase(app);
    
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase configuration missing. Please check your .env file');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db, storage, rtdb, isFirebaseConfigured };
export const isInitialized = isFirebaseConfigured();
