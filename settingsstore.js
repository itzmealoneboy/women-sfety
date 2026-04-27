class SettingsStore {
  constructor() {
    this.settings = {
      // App Settings
      app: {
        theme: 'light',
        language: 'en',
        fontSize: 'medium',
        notifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        autoSave: true,
        offlineMode: false
      },
      
      // Privacy Settings
      privacy: {
        locationSharing: true,
        anonymousMode: false,
        dataCollection: true,
        shareAnalytics: false,
        clearDataOnExit: false
      },
      
      // Security Settings
      security: {
        biometricEnabled: false,
        twoFactorEnabled: false,
        autoLock: true,
        lockTimeout: 5, // minutes
        sessionTimeout: 30, // minutes
        loginAlerts: true
      },
      
      // Notification Settings
      notifications: {
        email: {
          enabled: true,
          caseUpdates: true,
          reportAlerts: true,
          securityAlerts: true,
          weeklyDigest: false
        },
        push: {
          enabled: true,
          urgentAlerts: true,
          messages: true,
          systemUpdates: false
        },
        sms: {
          enabled: false,
          emergencyOnly: true
        }
      },
      
      // Emergency Settings
      emergency: {
        sosEnabled: true,
        autoDial: true,
        shareLocation: true,
        sosMessage: "I'm in danger! Please help!",
        emergencyContacts: [],
        sosDelay: 5 // seconds
      },
      
      // Voice Settings
      voice: {
        enabled: true,
        wakeWord: 'Hey Assistant',
        language: 'en-US',
        voiceType: 'female',
        speechRate: 1.0,
        commandsEnabled: true
      },
      
      // Display Settings
      display: {
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        largeText: false,
        colorBlindMode: 'none'
      },
      
      // Data & Storage
      data: {
        autoBackup: true,
        backupFrequency: 'weekly',
        cloudSync: false,
        compressData: true,
        cacheSize: 100 // MB
      }
    };
    
    this.listeners = {};
    this.initialized = false;
  }

  // Initialize settings store
  init = async () => {
    try {
      await this.loadSettings();
      this.initialized = true;
      console.log('SettingsStore initialized');
      return true;
    } catch (error) {
      console.error('SettingsStore initialization failed:', error);
      return false;
    }
  };

  // Load settings from storage
  loadSettings = async () => {
    try {
      const stored = localStorage.getItem('app_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = this.mergeSettings(this.settings, parsed);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save settings to storage
  saveSettings = async () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(this.settings));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Deep merge settings
  mergeSettings = (defaultSettings, userSettings) => {
    const result = { ...defaultSettings };
    
    for (const key in userSettings) {
      if (userSettings[key] && typeof userSettings[key] === 'object' && !Array.isArray(userSettings[key])) {
        result[key] = this.mergeSettings(result[key] || {}, userSettings[key]);
      } else {
        result[key] = userSettings[key];
      }
    }
    
    return result;
  };

  // Get all settings
  getSettings = () => {
    return { ...this.settings };
  };

  // Get specific setting by path (e.g., 'app.theme')
  getSetting = (path, defaultValue = null) => {
    try {
      const keys = path.split('.');
      let value = this.settings;
      
      for (const key of keys) {
        if (value === undefined || value === null) {
          return defaultValue;
        }
        value = value[key];
      }
      
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      console.error('Error getting setting:', error);
      return defaultValue;
    }
  };

  // Update a setting
  updateSetting = async (path, value) => {
    try {
      const keys = path.split('.');
      let current = this.settings;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Update the value
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;
      
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  // Update multiple settings at once
  updateSettings = async (updates) => {
    try {
      for (const [path, value] of Object.entries(updates)) {
        await this.updateSetting(path, value);
      }
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  // Reset settings to defaults
  resetSettings = async (section = null) => {
    try {
      if (section && this.settings[section]) {
        // Reset specific section
        const defaultSection = this.getDefaultSettings()[section];
        if (defaultSection) {
          this.settings[section] = JSON.parse(JSON.stringify(defaultSection));
        }
      } else {
        // Reset all settings
        this.settings = this.getDefaultSettings();
      }
      
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error resetting settings:', error);
      return false;
    }
  };

  // Get default settings
  getDefaultSettings = () => {
    return {
      app: {
        theme: 'light',
        language: 'en',
        fontSize: 'medium',
        notifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        autoSave: true,
        offlineMode: false
      },
      privacy: {
        locationSharing: true,
        anonymousMode: false,
        dataCollection: true,
        shareAnalytics: false,
        clearDataOnExit: false
      },
      security: {
        biometricEnabled: false,
        twoFactorEnabled: false,
        autoLock: true,
        lockTimeout: 5,
        sessionTimeout: 30,
        loginAlerts: true
      },
      notifications: {
        email: {
          enabled: true,
          caseUpdates: true,
          reportAlerts: true,
          securityAlerts: true,
          weeklyDigest: false
        },
        push: {
          enabled: true,
          urgentAlerts: true,
          messages: true,
          systemUpdates: false
        },
        sms: {
          enabled: false,
          emergencyOnly: true
        }
      },
      emergency: {
        sosEnabled: true,
        autoDial: true,
        shareLocation: true,
        sosMessage: "I'm in danger! Please help!",
        emergencyContacts: [],
        sosDelay: 5
      },
      voice: {
        enabled: true,
        wakeWord: 'Hey Assistant',
        language: 'en-US',
        voiceType: 'female',
        speechRate: 1.0,
        commandsEnabled: true
      },
      display: {
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        largeText: false,
        colorBlindMode: 'none'
      },
      data: {
        autoBackup: true,
        backupFrequency: 'weekly',
        cloudSync: false,
        compressData: true,
        cacheSize: 100
      }
    };
  };

  // Export settings (for backup)
  exportSettings = () => {
    return JSON.stringify(this.settings, null, 2);
  };

  // Import settings (from backup)
  importSettings = async (settingsJson) => {
    try {
      const imported = JSON.parse(settingsJson);
      this.settings = this.mergeSettings(this.settings, imported);
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  };

  // Clear all settings
  clearAllSettings = async () => {
    try {
      localStorage.removeItem('app_settings');
      this.settings = this.getDefaultSettings();
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error clearing settings:', error);
      return false;
    }
  };

  // Subscribe to settings changes
  subscribe = (callback, section = null) => {
    const id = Date.now().toString();
    this.listeners[id] = { callback, section };
    return () => {
      delete this.listeners[id];
    };
  };

  // Notify all listeners of changes
  notifyListeners = () => {
    for (const [id, listener] of Object.entries(this.listeners)) {
      try {
        if (listener.section) {
          listener.callback(this.settings[listener.section]);
        } else {
          listener.callback(this.settings);
        }
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    }
  };

  // Get app theme
  getTheme = () => {
    return this.getSetting('app.theme', 'light');
  };

  // Set app theme
  setTheme = async (theme) => {
    await this.updateSetting('app.theme', theme);
    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Get language
  getLanguage = () => {
    return this.getSetting('app.language', 'en');
  };

  // Set language
  setLanguage = async (language) => {
    await this.updateSetting('app.language', language);
  };

  // Check if notifications are enabled
  areNotificationsEnabled = () => {
    return this.getSetting('app.notifications', true);
  };

  // Get emergency settings
  getEmergencySettings = () => {
    return this.getSetting('emergency', {});
  };

  // Update emergency contacts
  updateEmergencyContacts = async (contacts) => {
    await this.updateSetting('emergency.emergencyContacts', contacts);
  };

  // Get SOS message
  getSOSMessage = () => {
    return this.getSetting('emergency.sosMessage', "I'm in danger! Please help!");
  };

  // Check if biometric is enabled
  isBiometricEnabled = () => {
    return this.getSetting('security.biometricEnabled', false);
  };

  // Check if two-factor is enabled
  isTwoFactorEnabled = () => {
    return this.getSetting('security.twoFactorEnabled', false);
  };

  // Get voice settings
  getVoiceSettings = () => {
    return this.getSetting('voice', {});
  };

  // Check if voice commands are enabled
  areVoiceCommandsEnabled = () => {
    return this.getSetting('voice.commandsEnabled', true);
  };

  // Get notification preferences
  getNotificationPreferences = () => {
    return this.getSetting('notifications', {});
  };

  // Check if location sharing is enabled
  isLocationSharingEnabled = () => {
    return this.getSetting('privacy.locationSharing', true);
  };

  // Check if auto backup is enabled
  isAutoBackupEnabled = () => {
    return this.getSetting('data.autoBackup', true);
  };
}

// Create singleton instance
const settingsStore = new SettingsStore();

export default settingsStore;