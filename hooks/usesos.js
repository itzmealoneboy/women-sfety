import { useState, useEffect, useCallback } from 'react';
import { useEmergencyStore } from '../store/emergencystore';
import { useLocationStore } from '../store/locationsstore';
import { useAuthStore } from '../store/authstores';
import { sosService } from '../services/emergency/sosService';

export const useSOS = () => {
  const [activeSOS, setActiveSOS] = useState(null);
  const [sosHistory, setSOSHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [contactsNotified, setContactsNotified] = useState([]);
  const [policeNotified, setPoliceNotified] = useState(false);

  const { user } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { emergencyContacts, loadEmergencyContacts } = useEmergencyStore();

  // Load SOS history
  const loadSOSHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await sosService.getSOSHistory(user.uid);
      
      if (result.success) {
        setSOSHistory(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Trigger SOS
  const triggerSOS = useCallback(async (type = 'manual', message = '') => {
    if (!user) {
      setError('User not authenticated');
      return { success: false };
    }

    if (!currentLocation) {
      setError('Location not available');
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);

      // Start countdown
      setCountdown(10);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Trigger SOS after countdown
      setTimeout(async () => {
        clearInterval(countdownInterval);
        
        const result = await sosService.triggerSOS(type, message);
        
        if (result.success) {
          setActiveSOS(result.data);
          
          // Set up status change listener
          sosService.onStatusChange = (status) => {
            if (status === 'resolved' || status === 'escalated') {
              setActiveSOS(null);
              loadSOSHistory();
            }
          };

          // Set up contact notified listener
          sosService.onContactNotified = (contact) => {
            setContactsNotified(prev => [...prev, contact]);
          };
        } else {
          setError(result.error);
        }
        
        setLoading(false);
      }, 10000);

      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [user, currentLocation]);

  // Cancel SOS
  const cancelSOS = useCallback(async () => {
    if (!activeSOS) return;

    try {
      setLoading(true);
      const result = await sosService.cancelSOS(activeSOS.id);
      
      if (result.success) {
        setActiveSOS(null);
        setCountdown(10);
        setContactsNotified([]);
        setPoliceNotified(false);
        await loadSOSHistory();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSOS]);

  // Resolve SOS
  const resolveSOS = useCallback(async (resolution = {}) => {
    if (!activeSOS) return;

    try {
      setLoading(true);
      const result = await sosService.resolveSOS(activeSOS.id, resolution);
      
      if (result.success) {
        setActiveSOS(null);
        await loadSOSHistory();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSOS]);

  // Test emergency contacts
  const testContacts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load contacts if not loaded
      if (emergencyContacts.length === 0) {
        await loadEmergencyContacts();
      }

      return { 
        success: true, 
        contacts: emergencyContacts,
        count: emergencyContacts.length 
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [emergencyContacts, loadEmergencyContacts]);

  // Simulate SOS (for testing)
  const simulateSOS = useCallback(async () => {
    if (!user || !currentLocation) return;

    setActiveSOS({
      id: 'simulated',
      userId: user.uid,
      userName: user.name,
      location: currentLocation,
      type: 'test',
      timestamp: Date.now(),
      status: 'active',
      simulated: true
    });

    return { success: true, simulated: true };
  }, [user, currentLocation]);

  // Get SOS status
  const getSOSStatus = useCallback(() => {
    if (activeSOS) {
      return {
        active: true,
        type: activeSOS.type,
        timeElapsed: Date.now() - activeSOS.timestamp,
        contactsNotified: contactsNotified.length,
        policeNotified
      };
    }
    return { active: false };
  }, [activeSOS, contactsNotified.length, policeNotified]);

  // Subscribe to active SOS
  const subscribeToActiveSOS = useCallback((callback) => {
    return sosService.subscribeToAllActiveSOS((sosList) => {
      callback(sosList);
    });
  }, []);

  // Subscribe to specific SOS
  const subscribeToSOS = useCallback((sosId, callback) => {
    return sosService.subscribeToSOS(sosId, (data) => {
      callback(data);
    });
  }, []);

  // Load history on mount
  useEffect(() => {
    if (user) {
      loadSOSHistory();
    }
  }, [user, loadSOSHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sosService.cleanup();
    };
  }, []);

  return {
    // State
    activeSOS,
    sosHistory,
    loading,
    error,
    countdown,
    contactsNotified,
    policeNotified,
    
    // Actions
    triggerSOS,
    cancelSOS,
    resolveSOS,
    testContacts,
    simulateSOS,
    loadSOSHistory,
    
    // Getters
    getSOSStatus,
    
    // Subscriptions
    subscribeToActiveSOS,
    subscribeToSOS
  };
};

