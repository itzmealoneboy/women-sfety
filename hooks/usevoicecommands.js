import { useEffect, useState, useCallback } from 'react';
import { voiceService } from '../services/voice/voiceservices';
import { useAuthStore } from '../store/authstores';
import { useLocationStore } from '../store/locationsstore';
import { useEmergencyStore } from '../store/emergencystore';

export const useVoiceCommands = (options = {}) => {
  const {
    language = 'en-US',
    autoStart = false,
    onCommand,
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  const { user } = useAuthStore();
  const { currentLocation, startTracking, stopTracking } = useLocationStore();
  const { triggerSOS } = useEmergencyStore();

  // Initialize voice service
  useEffect(() => {
    const init = async () => {
      const supported = voiceService.initRecognition(language);
      setSupported(supported);

      if (supported) {
        await voiceService.loadVoices();
        voiceService.setVoice(language);
      }
    };

    init();

    return () => {
      if (isListening) {
        voiceService.stopListening();
      }
    };
  }, [language]);

  // Set up callbacks
  useEffect(() => {
    voiceService.onResult = handleResult;
    voiceService.onError = handleError;
  }, []);

  // Auto start if enabled
  useEffect(() => {
    if (autoStart && supported) {
      startListening();
    }
  }, [autoStart, supported]);

  // Handle voice recognition result
  const handleResult = (result) => {
    setTranscript(result.transcript);
    setConfidence(result.confidence);

    if (result.isFinal) {
      processCommand(result.transcript.toLowerCase());
    }

    onResult?.(result);
  };

  // Handle error
  const handleError = (error) => {
    console.error('Voice recognition error:', error);
    setIsListening(false);
    onError?.(error);
  };

  // Process voice command
  const processCommand = useCallback(async (text) => {
    const commands = {
      // Emergency commands
      'help': () => handleEmergency('help'),
      'emergency': () => handleEmergency('emergency'),
      'sos': () => handleEmergency('sos'),
      'bachao': () => handleEmergency('bachao'),
      'save me': () => handleEmergency('save me'),
      
      // Safety commands
      'start tracking': () => handleTracking('start'),
      'stop tracking': () => handleTracking('stop'),
      'where am i': () => handleLocation(),
      'my location': () => handleLocation(),
      'safety score': () => handleSafetyScore(),
      
      // Call commands
      'call police': () => handleCall('police'),
      'call ambulance': () => handleCall('ambulance'),
      'call mother': () => handleCall('mother'),
      'fake call': () => handleFakeCall(),
      
      // Mode commands
      'silent mode': () => handleMode('silent'),
      'normal mode': () => handleMode('normal'),
      
      // Information commands
      'find police': () => handleFind('police'),
      'find hospital': () => handleFind('hospital'),
      'find atm': () => handleFind('atm'),
      'find shelter': () => handleFind('shelter'),
      
      // Voice navigation commands
      'open safety navigation': () => ({ action: 'navigate', page: 'safety-navigation' }),
      'show safety navigation': () => ({ action: 'navigate', page: 'safety-navigation' }),
      'open live tracking': () => ({ action: 'navigate', page: 'live-tracking' }),
      'open share location': () => ({ action: 'navigate', page: 'share-location' }),
      'open family tracking': () => ({ action: 'navigate', page: 'safety-navigation' }),
      'open voice hub': () => ({ action: 'navigate', page: 'voice-hub' }),
      'open dashboard': () => ({ action: 'navigate', page: 'dashboard' }),
      
      // Family commands
      'locate family': () => handleFamily('locate'),
      'message mother': () => handleFamily('message', 'mother'),
      'track sister': () => handleFamily('track', 'sister'),
      'where is family': () => handleFamily('locate'),
      'share location': () => handleFamily('share')
    };

    // Check for exact match
    for (const [command, handler] of Object.entries(commands)) {
      if (text.includes(command)) {
        setLastCommand(command);
        const result = await handler();
        onCommand?.({ command, result, confidence });
        return;
      }
    }

    // Check for emergency keywords
    const emergency = voiceService.checkEmergencyKeywords(text);
    if (emergency.detected) {
      setLastCommand('emergency_keyword');
      const result = await handleEmergency(emergency.keyword);
      onCommand?.({ command: 'emergency_keyword', result, confidence });
    }
  }, [currentLocation]);

  // Handle emergency commands
  const handleEmergency = async (type) => {
    const result = await triggerSOS('voice', type);
    
    // Speak confirmation
    voiceService.speak('Emergency alert triggered. Help is on the way.');
    
    return result;
  };

  // Handle tracking commands
  const handleTracking = (action) => {
    if (action === 'start') {
      startTracking();
      voiceService.speak('Live tracking started');
      return { action: 'started' };
    } else {
      stopTracking();
      voiceService.speak('Live tracking stopped');
      return { action: 'stopped' };
    }
  };

  // Handle location commands
  const handleLocation = () => {
    if (!currentLocation) {
      voiceService.speak('Unable to get your location');
      return null;
    }

    const message = `You are at latitude ${currentLocation.lat.toFixed(4)} degrees north, longitude ${currentLocation.lng.toFixed(4)} degrees east`;
    voiceService.speak(message);
    
    return currentLocation;
  };

  // Handle safety score
  const handleSafetyScore = () => {
    // This would calculate actual safety score
    const score = 85;
    voiceService.speak(`Current safety score is ${score} percent`);
    return { score };
  };

  // Handle call commands
  const handleCall = (target) => {
    const numbers = {
      police: '100',
      ambulance: '108',
      mother: '9876543210'
    };

    const number = numbers[target];
    if (number) {
      window.location.href = `tel:${number}`;
      voiceService.speak(`Calling ${target}`);
      return { target, number };
    }
  };

  // Handle fake call
  const handleFakeCall = () => {
    voiceService.speak('Initiating fake call');
    // Trigger fake call logic
    return { action: 'fake_call_triggered' };
  };

  // Handle mode changes
  const handleMode = (mode) => {
    voiceService.speak(`${mode} mode activated`);
    return { mode };
  };

  // Handle find commands
  const handleFind = async (type) => {
    voiceService.speak(`Searching for nearby ${type}`);
    // Trigger search
    return { type, searching: true };
  };

  // Handle family commands
  const handleFamily = (action, member) => {
    voiceService.speak(`${action} ${member}`);
    return { action, member };
  };

  // Start listening
  const startListening = () => {
    if (!supported) {
      console.error('Voice recognition not supported');
      return false;
    }

    const started = voiceService.startListening();
    setIsListening(started);
    return started;
  };

  // Stop listening
  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  // Speak text
  const speak = (text, options = {}) => {
    return voiceService.speak(text, options);
  };

  // Stop speaking
  const stopSpeaking = () => {
    voiceService.stop();
  };

  // Get available voices
  const getVoices = (lang = null) => {
    return voiceService.getVoices(lang);
  };

  // Set voice
  const setVoice = (language, name) => {
    voiceService.setVoice(language, name);
  };

  return {
    // State
    isListening,
    lastCommand,
    confidence,
    transcript,
    supported,
    
    // Actions
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getVoices,
    setVoice,
    
    // Status
    isSpeaking: voiceService.isSpeaking.bind(voiceService)
  };
};
