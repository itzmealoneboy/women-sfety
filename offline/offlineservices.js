import { openDB } from 'idb';

class OfflineService {
  constructor() {
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.initDB();
    this.setupListeners();
  }

  /**
   * Initialize IndexedDB
   */
  async initDB() {
    try {
      this.db = await openDB('SakhiOfflineDB', 1, {
        upgrade(db) {
          // Create stores for offline data
          if (!db.objectStoreNames.contains('locations')) {
            const locationStore = db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
            locationStore.createIndex('timestamp', 'timestamp');
          }

          if (!db.objectStoreNames.contains('reports')) {
            const reportStore = db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
            reportStore.createIndex('syncStatus', 'syncStatus');
            reportStore.createIndex('timestamp', 'timestamp');
          }

          if (!db.objectStoreNames.contains('emergencyContacts')) {
            const contactStore = db.createObjectStore('emergencyContacts', { keyPath: 'id' });
            contactStore.createIndex('syncStatus', 'syncStatus');
          }

          if (!db.objectStoreNames.contains('messages')) {
            const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            messageStore.createIndex('timestamp', 'timestamp');
            messageStore.createIndex('read', 'read');
          }

          if (!db.objectStoreNames.contains('syncQueue')) {
            const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
            queueStore.createIndex('timestamp', 'timestamp');
            queueStore.createIndex('retryCount', 'retryCount');
          }

          if (!db.objectStoreNames.contains('cache')) {
            const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
            cacheStore.createIndex('timestamp', 'timestamp');
          }
        }
      });

      console.log('Offline DB initialized');
    } catch (error) {
      console.error('Failed to initialize offline DB:', error);
    }
  }

  /**
   * Setup online/offline listeners
   */
  setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Save data for offline use
   */
  async saveOffline(store, data) {
    try {
      const dataWithMeta = {
        ...data,
        syncStatus: 'pending',
        timestamp: Date.now(),
        offlineId: this.generateId()
      };

      const id = await this.db.add(store, dataWithMeta);
      
      // Add to sync queue
      await this.addToSyncQueue({
        store,
        data: dataWithMeta,
        action: 'create',
        offlineId: dataWithMeta.offlineId
      });

      return { success: true, id: dataWithMeta.offlineId };
    } catch (error) {
      console.error('Error saving offline:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get offline data
   */
  async getOffline(store, query = {}) {
    try {
      const tx = this.db.transaction(store, 'readonly');
      const objectStore = tx.objectStore(store);
      
      let results;
      
      if (query.index && query.value) {
        const index = objectStore.index(query.index);
        results = await index.getAll(query.value);
      } else {
        results = await objectStore.getAll();
      }

      return { success: true, data: results };
    } catch (error) {
      console.error('Error getting offline data:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Update offline data
   */
  async updateOffline(store, id, updates) {
    try {
      const tx = this.db.transaction(store, 'readwrite');
      const objectStore = tx.objectStore(store);
      
      const existing = await objectStore.get(id);
      if (!existing) {
        throw new Error('Record not found');
      }

      const updated = {
        ...existing,
        ...updates,
        syncStatus: 'pending',
        updatedAt: Date.now()
      };

      await objectStore.put(updated);

      // Add to sync queue
      await this.addToSyncQueue({
        store,
        data: updated,
        action: 'update',
        offlineId: id
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating offline:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete offline data
   */
  async deleteOffline(store, id) {
    try {
      const tx = this.db.transaction(store, 'readwrite');
      const objectStore = tx.objectStore(store);
      
      await objectStore.delete(id);

      // Add to sync queue
      await this.addToSyncQueue({
        store,
        action: 'delete',
        offlineId: id
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting offline:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(item) {
    try {
      const queueItem = {
        ...item,
        timestamp: Date.now(),
        retryCount: 0,
        lastAttempt: null
      };

      await this.db.add('syncQueue', queueItem);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  /**
   * Process sync queue when online
   */
  async processSyncQueue() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;

    try {
      const tx = this.db.transaction('syncQueue', 'readwrite');
      const queue = await tx.objectStore('syncQueue').getAll();

      for (const item of queue) {
        try {
          await this.syncItem(item);
          await this.db.delete('syncQueue', item.id);
        } catch (error) {
          console.error('Sync failed for item:', item, error);
          
          // Update retry count
          item.retryCount++;
          item.lastAttempt = Date.now();
          
          if (item.retryCount < 5) {
            await this.db.put('syncQueue', item);
          } else {
            // Max retries exceeded, mark as failed
            await this.db.delete('syncQueue', item.id);
          }
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync individual item to server
   */
  async syncItem(item) {
    // Implement actual sync logic here
    // This would make API calls to your backend
    console.log('Syncing item:', item);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Cache data for offline use
   */
  async cacheData(key, data, ttl = 3600000) { // Default 1 hour TTL
    try {
      const cacheItem = {
        key,
        data,
        timestamp: Date.now(),
        ttl
      };

      await this.db.put('cache', cacheItem);
      return { success: true };
    } catch (error) {
      console.error('Error caching data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get cached data
   */
  async getCachedData(key) {
    try {
      const cacheItem = await this.db.get('cache', key);
      
      if (!cacheItem) {
        return { success: false, error: 'Not found' };
      }

      // Check if cache is expired
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await this.db.delete('cache', key);
        return { success: false, error: 'Cache expired' };
      }

      return { success: true, data: cacheItem.data };
    } catch (error) {
      console.error('Error getting cached data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clear expired cache
   */
  async clearExpiredCache() {
    try {
      const tx = this.db.transaction('cache', 'readwrite');
      const cache = await tx.objectStore('cache').getAll();
      
      for (const item of cache) {
        if (Date.now() - item.timestamp > item.ttl) {
          await this.db.delete('cache', item.key);
        }
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    try {
      const pendingCount = await this.db.count('syncQueue');
      const lastSync = await this.getLastSyncTime();

      return {
        isOnline: this.isOnline,
        pendingItems: pendingCount,
        lastSync,
        syncInProgress: this.syncInProgress
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        isOnline: this.isOnline,
        pendingItems: 0,
        lastSync: null,
        syncInProgress: false
      };
    }
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime() {
    try {
      const tx = this.db.transaction('syncQueue', 'readonly');
      const index = tx.objectStore('syncQueue').index('timestamp');
      const lastItem = await index.getAll(null, 1);
      
      return lastItem.length > 0 ? lastItem[0].timestamp : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Clear all offline data
   */
  async clearAllData() {
    try {
      const stores = ['locations', 'reports', 'emergencyContacts', 'messages', 'syncQueue', 'cache'];
      
      const tx = this.db.transaction(stores, 'readwrite');
      
      for (const store of stores) {
        await tx.objectStore(store).clear();
      }

      return { success: true };
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get storage usage
   */
  async getStorageUsage() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage,
          quota: estimate.quota,
          percentage: (estimate.usage / estimate.quota) * 100
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return null;
    }
  }
}

export const offlineService = new OfflineService();
