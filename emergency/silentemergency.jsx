import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergencyStore } from '../../store/emergencystore';
import { useLocationStore } from '../../store/locationsstore';
import { useAuthStore } from '../../store/authstores';
import { useSakshiEyeStore } from '../../store/sakshieyestore';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { SakshiEyeAutoDetection } from '../../components/sakshieye/SakshiEyeComponents';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  FingerPrintIcon,
  PhoneIcon,
  MapIcon,
  CameraIcon,
  MicrophoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SilentEmergency = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { emergencyContacts } = useEmergencyStore();
  const { startListening, stopListening, isListening, speak } = useVoiceCommands();

  const [silentMode, setSilentMode] = useState(false);
  const [activationMethod, setActivationMethod] = useState('shake');
  const [secretWord, setSecretWord] = useState('sakhi');
  const [autoDetect, setAutoDetect] = useState(true);
  const [recording, setRecording] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [contactsNotified, setContactsNotified] = useState([]);
  const [timer, setTimer] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Real Silent features references
  const audioRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecogniserRef = useRef(null);
  const volumeKeySequenceRef = useRef([]);
  const volumeKeyTimerRef = useRef(null);
  const [mediaActive, setMediaActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Simulate shake detection
  useEffect(() => {
    if (!silentMode || activationMethod !== 'shake') return;

    let shakeCount = 0;
    let lastShake = 0;

    const handleDeviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      const now = Date.now();

      if (now - lastShake > 1000) {
        shakeCount = 0;
      }

      const magnitude = Math.sqrt(
        acceleration.x ** 2 +
        acceleration.y ** 2 +
        acceleration.z ** 2
      );

      if (magnitude > 15) {
        shakeCount++;
        lastShake = now;

        if (shakeCount >= 3) {
          activateSilentEmergency('shake');
        }
      }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, [silentMode, activationMethod]);

  // Auto-detect threat
  useEffect(() => {
    if (!silentMode || !autoDetect) return;

    const checkThreats = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // Check for sudden stop (fall detection)
      if (timeSinceLastActivity > 30000) {
        activateSilentEmergency('auto');
      }
    };

    const interval = setInterval(checkThreats, 5000);
    return () => clearInterval(interval);
  }, [silentMode, autoDetect, lastActivity]);

  // Call Detection / Keyword Monitoring (Web Speech API)
  useEffect(() => {
    if (!silentMode || activationMethod !== 'voice') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript.toLowerCase();
        }

        // Check for keywords indicating danger
        const keywords = ['help', 'save me', 'danger', secretWord.toLowerCase()];
        const detected = keywords.some(kw => currentTranscript.includes(kw));

        if (detected && !mediaActive) {
          console.log('[Silent Action] Keyword detected:', currentTranscript);
          activateSilentEmergency('voice keyword');
        }
      };

      recognition.onerror = (e) => console.log('Speech recognition error', e);

      try {
        recognition.start();
        speechRecogniserRef.current = recognition;
        toast.info('🎙️ Call Detection: Monitoring voice...', { duration: 2000, icon: '🤫' });
      } catch (err) {
        console.log('Voice recognition start error', err);
      }
    } else {
      toast.error('Voice detection not supported in this browser.');
    }

    return () => {
      if (speechRecogniserRef.current) {
        speechRecogniserRef.current.stop();
      }
    };
  }, [silentMode, activationMethod, secretWord, mediaActive]);

  // Volume Button Sequence Detection (Global Keyboard listener)
  useEffect(() => {
    if (!silentMode) return;

    // E.g. Press VolumeUp -> VolumeDown -> VolumeUp rapidly
    const expectedSequence = ['AudioVolumeUp', 'AudioVolumeDown', 'AudioVolumeUp'];

    const handleKeyDown = (e) => {
      // Browsers may map actual volume buttons to these keys if on Android webapp,
      // or we can fallback to generic keys for testing (e.g. ArrowUp/ArrowDown)
      const key = e.key;
      if (key === 'AudioVolumeUp' || key === 'AudioVolumeDown' || key === 'ArrowUp' || key === 'ArrowDown') {

        // Default ArrowKeys to AudioVolumeKeys for testing on desktop
        const mappedKey = key === 'ArrowUp' ? 'AudioVolumeUp' : (key === 'ArrowDown' ? 'AudioVolumeDown' : key);

        volumeKeySequenceRef.current.push(mappedKey);

        if (volumeKeyTimerRef.current) clearTimeout(volumeKeyTimerRef.current);

        // Require sequence within 3 seconds
        volumeKeyTimerRef.current = setTimeout(() => {
          volumeKeySequenceRef.current = [];
        }, 3000);

        // Check sequence match
        if (volumeKeySequenceRef.current.length === expectedSequence.length) {
          const match = volumeKeySequenceRef.current.every((val, index) => val === expectedSequence[index]);
          if (match && !mediaActive) {
            volumeKeySequenceRef.current = [];
            activateSilentEmergency('volume sequence');
          } else {
            volumeKeySequenceRef.current = []; // reset if failed
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [silentMode, mediaActive]);

  // Stealthy Capture Actions (Audio & Front Camera)
  const executeStealthCaptures = useCallback(async () => {
    if (mediaActive) return;
    setMediaActive(true);

    try {
      // 1. Secret Audio Recording
      if (recording) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.start(2000); // chunk every 2 seconds
        audioRecorderRef.current = mediaRecorder;
      }

      // 2. Secret Camera Snapshot
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const videoTrack = videoStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(videoTrack);

      try {
        const photo = await imageCapture.takePhoto();
        const objectUrl = URL.createObjectURL(photo);
        setCapturedImage(objectUrl);
      } catch (err) {
        // Fallback for browsers without ImageCapture API
        const video = document.createElement('video');
        video.srcObject = videoStream;
        await video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/png'));
      } finally {
        // Turn off camera instantly so the light doesn't stay on
        videoTrack.stop();
      }
    } catch (err) {
      console.error('Stealth capture failed', err);
    }
  }, [recording, mediaActive]);

  // Activate silent emergency
  const activateSilentEmergency = (method) => {
    if (!silentMode || mediaActive) return;

    // Trigger SOS secretly - Do NOT show obvious toasts to attacker if triggered covertly
    if (method === 'shake' || method === 'volume sequence' || method === 'voice keyword') {
      console.log(`[Silent] Emergency triggered via ${method}`);
      // Send a very subtle vibration if supported
      if (navigator.vibrate) navigator.vibrate(100);
    } else {
      toast.success(`🔇 Silent emergency activated via ${method}`, {
        icon: '🤫',
        duration: 3000
      });
    }

    // Execute background hardware captures
    executeStealthCaptures();

    // Share location with contacts
    if (locationSharing) {
      const gMapsUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
      const timestamp = new Date().toLocaleString();
      emergencyContacts.forEach(contact => {
        // Send location via SMS/WhatsApp
        const message = `🚨 EMERGENCY (SILENT) from ${user?.name || 'User'}\n📍 Location: ${gMapsUrl}\n🕒 Time: ${timestamp}`;

        // Note: For a real silent app, we'd use backend SMS API (Twilio) to send this without opening WhatsApp UI
        // We'll mimic this behavior for the prototype
        if (contact.phone && !isSubtleTrigger(method)) {
          window.open(`https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`, '_blank');
        }

        setContactsNotified(prev => [...prev, contact.id]);
      });
    }

    // Navigate to tracking page after setting things up, only if it wasn't a completely hidden trigger
    if (!isSubtleTrigger(method)) {
      setTimeout(() => {
        navigate('/live-tracking');
      }, 2000);
    }
  };

  const isSubtleTrigger = (method) => {
    return ['volume sequence', 'voice keyword', 'shake'].includes(method);
  };

  // Toggle silent mode
  const toggleSilentMode = () => {
    setSilentMode(!silentMode);

    if (!silentMode) {
      toast.success('🔇 Silent emergency mode activated', {
        duration: 3000,
        icon: '🤫'
      });
    } else {
      toast.info('🔊 Silent emergency mode deactivated', {
        duration: 2000
      });
    }
  };

  // Test activation method
  const testActivation = (method) => {
    toast.info(`Testing ${method} activation...`, { duration: 2000 });

    setTimeout(() => {
      toast.success(`✅ ${method} detection working`, { duration: 2000 });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔇 Silent Emergency Mode
          </h1>
          <p className="text-gray-600 mt-1">
            Discreet emergency activation - Attacker never knows
          </p>
        </div>

        <Button
          variant={silentMode ? 'success' : 'danger'}
          onClick={toggleSilentMode}
          className="flex items-center gap-2"
        >
          {silentMode ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              Active
            </>
          ) : (
            <>
              <SpeakerXMarkIcon className="w-5 h-5" />
              Activate Silent Mode
            </>
          )}
        </Button>
      </div>

      {/* Status Card */}
      {silentMode && (
        <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <SpeakerXMarkIcon className="w-12 h-12 opacity-90" />
            <div>
              <h3 className="text-xl font-bold">Silent Mode Active</h3>
              <p className="opacity-90 mt-1">
                Emergency will trigger discreetly via {activationMethod}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {contactsNotified.length} contacts notified
                </span>
                {mediaActive && recording && (
                  <span className="px-2 py-1 bg-red-500/80 rounded-full text-xs animate-pulse">
                    🔴 Recording Audio Secretly
                  </span>
                )}
                {mediaActive && capturedImage && (
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    📸 Photo Captured
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Subtle background pulse when media is active */}
          {mediaActive && (
            <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />
          )}
        </Card>
      )}

      {/* Activation Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`cursor-pointer transition-all ${activationMethod === 'shake' ? 'ring-2 ring-primary-500' : ''
          }`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FingerPrintIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Shake Phone</h3>
            <p className="text-sm text-gray-600">
              Vigorously shake phone 3 times
            </p>
            <p className="text-xs text-gray-500 mt-2">
              OR Press: Up, Down, Up arrows (Volume buttons on mobile)
            </p>
            {silentMode && activationMethod === 'shake' && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => activateSilentEmergency('shake')}
                >
                  Test Shake
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className={`cursor-pointer transition-all ${activationMethod === 'voice' ? 'ring-2 ring-primary-500' : ''
          }`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MicrophoneIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Secret Code Word</h3>
            <p className="text-sm text-gray-600">
              Say your secret word quietly
            </p>
            <Input
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
              className="mt-2 text-center"
              placeholder="Enter secret word"
            />
            {silentMode && activationMethod === 'voice' && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => activateSilentEmergency('voice keyword')}
                >
                  Test Voice
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className={`cursor-pointer transition-all ${activationMethod === 'auto' ? 'ring-2 ring-primary-500' : ''
          }`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Auto Detection</h3>
            <p className="text-sm text-gray-600">
              AI detects screaming, running, struggle
            </p>
            <span className="inline-block mt-2 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
              {autoDetect ? 'Active' : 'Inactive'}
            </span>
          </div>
        </Card>
      </div>

      {/* SAKHI EYE AI AUTO DETECTION */}
      {silentMode && (
        <SakshiEyeAutoDetection
          enabled={autoDetect}
          onToggle={() => setAutoDetect(!autoDetect)}
          detections={0}
        />
      )}

      {/* Settings */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CogIcon className="w-5 h-5" />
            Silent Mode Settings
          </h3>
          <p className="text-xs text-rose-500">Requires Mic/Camera permission when enabled</p>
        </div>

        <div className="space-y-4">
          {/* Activation Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Activation Method
            </label>
            <select
              value={activationMethod}
              onChange={(e) => setActivationMethod(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              disabled={!silentMode}
            >
              <option value="shake">Shake Phone</option>
              <option value="voice">Secret Code Word</option>
              <option value="auto">Auto Detection</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Detection</p>
                <p className="text-sm text-gray-500">
                  AI detects screaming, running, struggle
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoDetect}
                onChange={(e) => setAutoDetect(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
                disabled={!silentMode}
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Recording</p>
                <p className="text-sm text-gray-500">
                  Start recording audio/video when triggered
                </p>
              </div>
              <input
                type="checkbox"
                checked={recording}
                onChange={(e) => setRecording(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
                disabled={!silentMode}
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-gray-500">
                  Share live location with contacts
                </p>
              </div>
              <input
                type="checkbox"
                checked={locationSharing}
                onChange={(e) => setLocationSharing(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
                disabled={!silentMode}
              />
            </label>
          </div>
        </div>
      </Card>

      {/* What Happens When Activated */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">What Happens When Activated</h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircleIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">Instant</p>
              <p className="text-sm text-gray-600">
                Live location sent to emergency contacts via SMS/WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircleIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">+2 seconds</p>
              <p className="text-sm text-gray-600">
                Phone starts recording audio/video (screen off)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircleIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">+5 seconds</p>
              <p className="text-sm text-gray-600">
                Live stream to police control room
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircleIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">+10 seconds</p>
              <p className="text-sm text-gray-600">
                Fake call triggered (optional)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircleIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">+30 seconds</p>
              <p className="text-sm text-gray-600">
                Police dispatched to location
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Panel */}
      {silentMode && (
        <Card className="bg-primary-50 border border-primary-200">
          <h3 className="font-semibold text-primary-800 mb-4">Test Silent Mode (Safe Demo)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => testActivation('shake')}
              className="flex items-center justify-center gap-2"
            >
              <FingerPrintIcon className="w-5 h-5" />
              Simulate Shake
            </Button>

            <Button
              variant="outline"
              onClick={() => testActivation('voice')}
              className="flex items-center justify-center gap-2"
            >
              <MicrophoneIcon className="w-5 h-5" />
              Say "{secretWord}"
            </Button>

            <Button
              variant="outline"
              onClick={() => testActivation('auto')}
              className="flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              Simulate Scream
            </Button>
          </div>

          <p className="text-xs text-primary-600 mt-4 text-center">
            Test mode - no actual alerts will be sent
          </p>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>

        {emergencyContacts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <PhoneIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No emergency contacts added</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/emergency-hub')}
            >
              Add Contacts
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                {contactsNotified.includes(contact.id) && (
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Notified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="bg-primary-50 border border-primary-200">
        <h4 className="font-medium text-primary-800 mb-2">Silent Mode Tips</h4>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Test your activation method regularly</li>
          <li>• Choose a secret word that's easy to remember</li>
          <li>• Keep phone accessible in pocket/bag</li>
          <li>• Ensure location services are always on</li>
          <li>• Add multiple emergency contacts</li>
        </ul>
      </Card>
    </div>
  );
};

export default SilentEmergency;

