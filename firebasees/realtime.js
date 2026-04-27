import { 
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  startAt,
  endAt,
  equalTo,
  limitToFirst,
  limitToLast,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  serverTimestamp
} from 'firebase/database';
import { app } from '../../config/firebases';

const rtdb = getDatabase(app);

export const realtimeService = {
  // Write data
  set: async (path, data) => {
    try {
      const dbRef = ref(rtdb, path);
      await set(dbRef, {
        ...data,
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Push data (generate unique key)
  push: async (path, data) => {
    try {
      const dbRef = ref(rtdb, path);
      const newRef = push(dbRef);
      await set(newRef, {
        ...data,
        timestamp: serverTimestamp()
      });
      return { success: true, key: newRef.key };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update data
  update: async (path, data) => {
    try {
      const dbRef = ref(rtdb, path);
      await update(dbRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove data
  remove: async (path) => {
    try {
      const dbRef = ref(rtdb, path);
      await remove(dbRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get data
  get: async (path) => {
    try {
      const dbRef = ref(rtdb, path);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() };
      } else {
        return { success: false, error: 'Data not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Query data
  query: async (path, constraints = []) => {
    try {
      let dbQuery = ref(rtdb, path);
      
      constraints.forEach(constraint => {
        switch (constraint.type) {
          case 'orderByChild':
            dbQuery = query(dbQuery, orderByChild(constraint.value));
            break;
          case 'orderByKey':
            dbQuery = query(dbQuery, orderByKey());
            break;
          case 'orderByValue':
            dbQuery = query(dbQuery, orderByValue());
            break;
          case 'startAt':
            dbQuery = query(dbQuery, startAt(constraint.value));
            break;
          case 'endAt':
            dbQuery = query(dbQuery, endAt(constraint.value));
            break;
          case 'equalTo':
            dbQuery = query(dbQuery, equalTo(constraint.value));
            break;
          case 'limitToFirst':
            dbQuery = query(dbQuery, limitToFirst(constraint.value));
            break;
          case 'limitToLast':
            dbQuery = query(dbQuery, limitToLast(constraint.value));
            break;
        }
      });

      const snapshot = await get(dbQuery);
      return { success: true, data: snapshot.val() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Real-time value listener
  onValue: (path, callback) => {
    const dbRef = ref(rtdb, path);
    return onValue(dbRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    });
  },

  // Real-time child added listener
  onChildAdded: (path, callback) => {
    const dbRef = ref(rtdb, path);
    return onChildAdded(dbRef, (snapshot) => {
      callback({
        key: snapshot.key,
        value: snapshot.val()
      });
    });
  },

  // Real-time child changed listener
  onChildChanged: (path, callback) => {
    const dbRef = ref(rtdb, path);
    return onChildChanged(dbRef, (snapshot) => {
      callback({
        key: snapshot.key,
        value: snapshot.val()
      });
    });
  },

  // Real-time child removed listener
  onChildRemoved: (path, callback) => {
    const dbRef = ref(rtdb, path);
    return onChildRemoved(dbRef, (snapshot) => {
      callback({
        key: snapshot.key,
        value: snapshot.val()
      });
    });
  },

  // Remove listener
  off: (path, eventType, callback) => {
    const dbRef = ref(rtdb, path);
    off(dbRef, eventType, callback);
  },

  // Transaction (optimistic locking)
  transaction: async (path, updateFunction) => {
    try {
      const dbRef = ref(rtdb, path);
      let result;
      await runTransaction(dbRef, (currentData) => {
        result = updateFunction(currentData);
        return result;
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Presence system
  presence: {
    // Track user online status
    trackUser: (userId) => {
      const userStatusRef = ref(rtdb, `status/${userId}`);
      const connectedRef = ref(rtdb, '.info/connected');

      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          // User is connected
          set(userStatusRef, {
            state: 'online',
            lastChanged: serverTimestamp()
          });

          // Set disconnect hook
          onDisconnect(userStatusRef).set({
            state: 'offline',
            lastChanged: serverTimestamp()
          });
        }
      });
    },

    // Get user status
    getUserStatus: (userId, callback) => {
      const statusRef = ref(rtdb, `status/${userId}`);
      return onValue(statusRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : { state: 'offline' });
      });
    },

    // Set custom status
    setStatus: (userId, status) => {
      const statusRef = ref(rtdb, `status/${userId}`);
      return set(statusRef, {
        state: status,
        lastChanged: serverTimestamp()
      });
    }
  },

  // Location tracking
  location: {
    // Update user location
    updateLocation: (userId, location) => {
      const locationRef = ref(rtdb, `locations/${userId}`);
      return set(locationRef, {
        ...location,
        timestamp: serverTimestamp()
      });
    },

    // Get user location
    getLocation: (userId, callback) => {
      const locationRef = ref(rtdb, `locations/${userId}`);
      return onValue(locationRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : null);
      });
    },

    // Get nearby users
    getNearbyUsers: (centerLat, centerLng, radiusKm, callback) => {
      // This is a simplified version - in production, use geohashes
      const locationsRef = ref(rtdb, 'locations');
      return onValue(locationsRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const locations = snapshot.val();
        const nearby = [];

        Object.entries(locations).forEach(([userId, data]) => {
          const distance = calculateDistance(
            centerLat, centerLng,
            data.lat, data.lng
          );
          
          if (distance <= radiusKm * 1000) {
            nearby.push({
              userId,
              ...data,
              distance
            });
          }
        });

        callback(nearby);
      });
    }
  },

  // Messaging
  messages: {
    // Send message
    send: (chatId, message) => {
      const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
      const newMessageRef = push(messagesRef);
      return set(newMessageRef, {
        ...message,
        timestamp: serverTimestamp(),
        read: false
      });
    },

    // Listen to messages
    listen: (chatId, callback) => {
      const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
      const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(50));
      
      return onChildAdded(messagesQuery, (snapshot) => {
        callback({
          id: snapshot.key,
          ...snapshot.val()
        });
      });
    },

    // Mark as read
    markAsRead: (chatId, messageId) => {
      const messageRef = ref(rtdb, `chats/${chatId}/messages/${messageId}`);
      return update(messageRef, { read: true });
    },

    // Delete message
    delete: (chatId, messageId) => {
      const messageRef = ref(rtdb, `chats/${chatId}/messages/${messageId}`);
      return remove(messageRef);
    }
  },

  // Notifications
  notifications: {
    // Send notification
    send: (userId, notification) => {
      const notificationsRef = ref(rtdb, `notifications/${userId}`);
      const newNotificationRef = push(notificationsRef);
      return set(newNotificationRef, {
        ...notification,
        timestamp: serverTimestamp(),
        read: false
      });
    },

    // Listen to notifications
    listen: (userId, callback) => {
      const notificationsRef = ref(rtdb, `notifications/${userId}`);
      const notificationsQuery = query(notificationsRef, orderByChild('timestamp'), limitToLast(20));
      
      return onChildAdded(notificationsQuery, (snapshot) => {
        callback({
          id: snapshot.key,
          ...snapshot.val()
        });
      });
    },

    // Mark as read
    markAsRead: (userId, notificationId) => {
      const notificationRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
      return update(notificationRef, { read: true });
    },

    // Mark all as read
    markAllAsRead: (userId) => {
      const notificationsRef = ref(rtdb, `notifications/${userId}`);
      return update(notificationsRef, { read: true });
    },

    // Delete notification
    delete: (userId, notificationId) => {
      const notificationRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
      return remove(notificationRef);
    }
  },

  // Server timestamp
  serverTimestamp: serverTimestamp
};




