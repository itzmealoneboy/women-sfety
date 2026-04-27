import { Platform } from 'react-native';

class SOSService {
  constructor() {
    this.emergencyContacts = [];
    this.locationInterval = null;
    this.sosActive = false;
    this.timer = null;
    this.countdown = 5;
    this.onSOSTriggered = null;
    this.onLocationUpdate = null;
  }

  // Initialize SOS Service
  init = async (config = {}) => {
    try {
      // Load emergency contacts from storage
      await this.loadEmergencyContacts();
      
      // Request necessary permissions
      await this.requestPermissions();
      
      // Setup location tracking
      if (config.enableLocationTracking) {
        this.setupLocationTracking();
      }
      
      console.log('SOS Service initialized successfully');
      return true;
    } catch (error) {
      console.error('SOS Service initialization failed:', error);
      return false;
    }
  };

  // Request permissions for SOS features
  requestPermissions = async () => {
    if (Platform.OS === 'web') {
      // Web permissions
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }
      
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    } else {
      // React Native permissions would go here
      // This is a placeholder for mobile permissions
      console.log('Requesting mobile permissions...');
    }
  };

  // Load emergency contacts from storage
  loadEmergencyContacts = async () => {
    try {
      const stored = localStorage.getItem('emergency_contacts');
      if (stored) {
        this.emergencyContacts = JSON.parse(stored);
      } else {
        // Default emergency contacts
        this.emergencyContacts = [
          { id: 1, name: 'Police', number: '100', type: 'emergency', enabled: true },
          { id: 2, name: 'Ambulance', number: '102', type: 'medical', enabled: true },
          { id: 3, name: 'Women Helpline', number: '181', type: 'support', enabled: true },
          { id: 4, name: 'Fire Brigade', number: '101', type: 'emergency', enabled: true }
        ];
        await this.saveEmergencyContacts();
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  // Save emergency contacts to storage
  saveEmergencyContacts = async () => {
    try {
      localStorage.setItem('emergency_contacts', JSON.stringify(this.emergencyContacts));
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  };

  // Get emergency contacts
  getEmergencyContacts = () => {
    return this.emergencyContacts;
  };

  // Add emergency contact
  addEmergencyContact = async (contact) => {
    const newContact = {
      id: Date.now(),
      name: contact.name,
      number: contact.number,
      type: contact.type || 'personal',
      enabled: true,
      relation: contact.relation || '',
      email: contact.email || '',
      notifySMS: contact.notifySMS !== false,
      notifyEmail: contact.notifyEmail || false
    };
    
    this.emergencyContacts.push(newContact);
    await this.saveEmergencyContacts();
    return newContact;
  };

  // Update emergency contact
  updateEmergencyContact = async (id, updates) => {
    const index = this.emergencyContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.emergencyContacts[index] = { ...this.emergencyContacts[index], ...updates };
      await this.saveEmergencyContacts();
      return this.emergencyContacts[index];
    }
    return null;
  };

  // Remove emergency contact
  removeEmergencyContact = async (id) => {
    this.emergencyContacts = this.emergencyContacts.filter(c => c.id !== id);
    await this.saveEmergencyContacts();
  };

  // Trigger SOS with countdown
  triggerSOS = async (options = {}) => {
    if (this.sosActive) {
      console.log('SOS already active');
      return;
    }
    
    this.sosActive = true;
    this.countdown = options.countdown || 5;
    
    // Start countdown
    this.timer = setInterval(() => {
      this.countdown--;
      
      if (this.onSOSTriggered) {
        this.onSOSTriggered({ countdown: this.countdown, status: 'countdown' });
      }
      
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.executeSOS(options);
      }
    }, 1000);
    
    return { success: true, message: 'SOS countdown started' };
  };

  // Execute SOS - send alerts to all emergency contacts
  executeSOS = async (options = {}) => {
    try {
      // Get current location
      const location = await this.getCurrentLocation();
      
      // Create SOS message
      const sosMessage = this.createSOSMessage(location, options.message);
      
      // Send alerts to all enabled contacts
      const activeContacts = this.emergencyContacts.filter(c => c.enabled);
      const results = [];
      
      for (const contact of activeContacts) {
        try {
          if (contact.notifySMS !== false) {
            await this.sendSMSAlert(contact.number, sosMessage);
            results.push({ contact: contact.name, method: 'SMS', success: true });
          }
          
          if (contact.notifyEmail) {
            await this.sendEmailAlert(contact.email, sosMessage);
            results.push({ contact: contact.name, method: 'Email', success: true });
          }
        } catch (error) {
          results.push({ contact: contact.name, method: 'SMS', success: false, error: error.message });
        }
      }
      
      // Also call emergency services if specified
      if (options.callEmergency !== false) {
        await this.callEmergencyServices();
      }
      
      // Log SOS event
      await this.logSOSEvent({
        timestamp: new Date(),
        location,
        contacts: activeContacts.map(c => ({ name: c.name, number: c.number })),
        results
      });
      
      if (this.onSOSTriggered) {
        this.onSOSTriggered({ 
          status: 'executed', 
          message: 'SOS alerts sent successfully',
          results 
        });
      }
      
      this.sosActive = false;
      return { success: true, results };
      
    } catch (error) {
      console.error('Error executing SOS:', error);
      this.sosActive = false;
      return { success: false, error: error.message };
    }
  };

  // Cancel SOS
  cancelSOS = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.sosActive = false;
    this.countdown = 5;
    
    if (this.onSOSTriggered) {
      this.onSOSTriggered({ status: 'cancelled', message: 'SOS cancelled' });
    }
    
    return { success: true };
  };

  // Get current location
  getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp),
            googleMapsUrl: `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // Setup continuous location tracking
  setupLocationTracking = () => {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
    
    this.locationInterval = setInterval(async () => {
      try {
        const location = await this.getCurrentLocation();
        if (this.onLocationUpdate) {
          this.onLocationUpdate(location);
        }
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    }, 5000); // Update every 5 seconds
  };

  // Stop location tracking
  stopLocationTracking = () => {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
    }
  };

  // Create SOS message with location
  createSOSMessage = (location, customMessage = '') => {
    const baseMessage = '🚨 EMERGENCY SOS ALERT 🚨\n\n';
    const locationText = location 
      ? `📍 Location: ${location.lat}, ${location.lng}\n🔗 Map: ${location.googleMapsUrl}\n`
      : '📍 Location: Unable to get location\n';
    const timeText = `🕐 Time: ${new Date().toLocaleString()}\n`;
    const customText = customMessage ? `📝 Message: ${customMessage}\n` : '';
    const helpText = '⚠️ This is an emergency. Please contact me immediately! ⚠️';
    
    return baseMessage + locationText + timeText + customText + helpText;
  };

  // Send SMS alert (simulated - would use actual SMS API in production)
  sendSMSAlert = async (phoneNumber, message) => {
    // Simulate SMS sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`SMS sent to ${phoneNumber}: ${message.substring(0, 100)}...`);
        resolve({ success: true });
      }, 500);
    });
  };

  // Send Email alert (simulated)
  sendEmailAlert = async (email, message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${email}`);
        resolve({ success: true });
      }, 500);
    });
  };

  // Call emergency services
  callEmergencyServices = async () => {
    // In a real app, this would trigger a phone call
    console.log('Calling emergency services...');
    return { success: true };
  };

  // Log SOS event to history
  logSOSEvent = async (event) => {
    try {
      const history = JSON.parse(localStorage.getItem('sos_history') || '[]');
      history.unshift(event);
      // Keep only last 50 events
      const trimmedHistory = history.slice(0, 50);
      localStorage.setItem('sos_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error logging SOS event:', error);
    }
  };

  // Get SOS history
  getSOSHistory = async () => {
    try {
      return JSON.parse(localStorage.getItem('sos_history') || '[]');
    } catch (error) {
      console.error('Error getting SOS history:', error);
      return [];
    }
  };

  // Test SOS system
  testSOS = async () => {
    console.log('Testing SOS system...');
    const location = await this.getCurrentLocation();
    const testMessage = this.createSOSMessage(location, 'TEST SOS - No action required');
    console.log('Test message:', testMessage);
    return { success: true, message: testMessage };
  };

  // Set callback for SOS trigger events
  setSOSCallback = (callback) => {
    this.onSOSTriggered = callback;
  };

  // Set callback for location updates
  setLocationCallback = (callback) => {
    this.onLocationUpdate = callback;
  };

  // Check if SOS is active
  isSOSActive = () => {
    return this.sosActive;
  };

  // Get current countdown value
  getCountdown = () => {
    return this.countdown;
  };
}

// Create singleton instance
const sosService = new SOSService();

export default sosService;