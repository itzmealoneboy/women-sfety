import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { generateDeviceFingerprint } from '../../utils/devicefingerprints';

const auth = getAuth(app);
const db = getFirestore(app);

export const authService = {
  // Login attempts tracking (simple in-memory implementation)
  loginAttempts: new Map(),

  // Check login attempts
  checkLoginAttempts: (email) => {
    const attempts = this.loginAttempts.get(email) || { count: 0, lockedUntil: 0 };
    const now = Date.now();
    
    if (attempts.lockedUntil > now) {
      return { allowed: false, remainingTime: Math.ceil((attempts.lockedUntil - now) / 1000) };
    }
    
    if (attempts.count >= 5) {
      attempts.lockedUntil = now + (15 * 60 * 1000); // 15 minutes
      this.loginAttempts.set(email, attempts);
      return { allowed: false, remainingTime: 15 * 60 };
    }
    
    return { allowed: true };
  },

  // Reset login attempts
  resetAttempts: (email) => {
    this.loginAttempts.delete(email);
  },

  // Record failed attempt
  recordFailedAttempt: (email) => {
    const attempts = this.loginAttempts.get(email) || { count: 0, lockedUntil: 0 };
    attempts.count += 1;
    this.loginAttempts.set(email, attempts);
    
    const locked = attempts.count >= 5;
    const attemptsLeft = locked ? 0 : 5 - attempts.count;
    
    return { attemptsLeft, locked };
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate device fingerprint
  generateDeviceFingerprint: generateDeviceFingerprint,

  // Create session
  createSession: async (userId, sessionData) => {
    try {
      const sessionRef = await addDoc(collection(db, 'sessions'), {
        userId,
        ...sessionData,
        createdAt: new Date(),
        active: true
      });
      return { success: true, sessionId: sessionRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register new user
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Google login
  googleLogin: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await updateProfile(user, profileData);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update email
  updateEmail: async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await updateEmail(user, newEmail);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reauthenticate user
  reauthenticate: async (password) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user logged in');
      
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Send email verification
  sendVerificationEmail: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Auth state observer
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get ID token
  getIdToken: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  },

  // Check if email verified
  isEmailVerified: () => {
    const user = auth.currentUser;
    return user?.emailVerified || false;
  }
};
