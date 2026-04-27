import { useState, useEffect, useCallback } from 'react';
import { realtimeService } from '../services/firebase/realtime';

export const useRealtimeDB = (path, initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read data
  const readData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await realtimeService.get(path);
      
      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  // Write data
  const writeData = useCallback(async (value) => {
    try {
      setError(null);
      
      const result = await realtimeService.set(path, value);
      
      if (result.success) {
        setData(value);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [path]);

  // Push data
  const pushData = useCallback(async (value) => {
    try {
      setError(null);
      
      const result = await realtimeService.push(path, value);
      
      if (result.success) {
        return { success: true, key: result.key };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [path]);

  // Update data
  const updateData = useCallback(async (updates) => {
    try {
      setError(null);
      
      const result = await realtimeService.update(path, updates);
      
      if (result.success) {
        setData(prev => ({ ...prev, ...updates }));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [path]);

  // Remove data
  const removeData = useCallback(async () => {
    try {
      setError(null);
      
      const result = await realtimeService.remove(path);
      
      if (result.success) {
        setData(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [path]);

  // Query data
  const queryData = useCallback(async (constraints = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await realtimeService.query(path, constraints);
      
      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  // Subscribe to real-time updates
  const subscribe = useCallback((callback) => {
    return realtimeService.onValue(path, (newData) => {
      setData(newData);
      setLoading(false);
      callback?.(newData);
    });
  }, [path]);

  // Subscribe to child added
  const subscribeToChildAdded = useCallback((callback) => {
    return realtimeService.onChildAdded(path, (child) => {
      setData(prev => {
        if (Array.isArray(prev)) {
          return [...prev, child];
        } else if (typeof prev === 'object' && prev !== null) {
          return { ...prev, [child.key]: child.value };
        }
        return prev;
      });
      callback?.(child);
    });
  }, [path]);

  // Subscribe to child changed
  const subscribeToChildChanged = useCallback((callback) => {
    return realtimeService.onChildChanged(path, (child) => {
      setData(prev => {
        if (Array.isArray(prev)) {
          return prev.map(item => 
            item.key === child.key ? { ...item, ...child.value } : item
          );
        } else if (typeof prev === 'object' && prev !== null) {
          return { ...prev, [child.key]: child.value };
        }
        return prev;
      });
      callback?.(child);
    });
  }, [path]);

  // Subscribe to child removed
  const subscribeToChildRemoved = useCallback((callback) => {
    return realtimeService.onChildRemoved(path, (child) => {
      setData(prev => {
        if (Array.isArray(prev)) {
          return prev.filter(item => item.key !== child.key);
        } else if (typeof prev === 'object' && prev !== null) {
          const { [child.key]: removed, ...rest } = prev;
          return rest;
        }
        return prev;
      });
      callback?.(child);
    });
  }, [path]);

  // Unsubscribe
  const unsubscribe = useCallback((eventType, callback) => {
    realtimeService.off(path, eventType, callback);
  }, [path]);

  // Load on mount
  useEffect(() => {
    readData();
  }, [readData]);

  return {
    // State
    data,
    loading,
    error,
    
    // Actions
    readData,
    writeData,
    pushData,
    updateData,
    removeData,
    queryData,
    subscribe,
    subscribeToChildAdded,
    subscribeToChildChanged,
    subscribeToChildRemoved,
    unsubscribe,
    
    // Utilities
    serverTimestamp: realtimeService.serverTimestamp
  };
};
