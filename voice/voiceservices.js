// Voice recognition and synthesis service

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.voice = null;
    this.voices = [];
    this.speaking = false;
  }

  // Initialize speech recognition
  initRecognition(language = 'en-US') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;
    this.recognition.maxAlternatives = 1;

    // Set up event handlers
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
    this.recognition.onstart = this.handleStart.bind(this);

    return true;
  }

  // Start listening
  startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      return false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Handle recognition result
  handleResult(event) {
    const results = Array.from(event.results);
    const transcript = results
      .map(result => result[0].transcript)
      .join(' ');
    
    const isFinal = results.every(result => result.isFinal);

    if (this.onResult) {
      this.onResult({
        transcript,
        isFinal,
        confidence: results[0]?.[0]?.confidence || 0
      });
    }
  }

  // Handle recognition error
  handleError(event) {
    if (this.onError) {
      this.onError(event.error);
    }
    this.isListening = false;
  }

  // Handle recognition end
  handleEnd() {
    this.isListening = false;
  }

  // Handle recognition start
  handleStart() {
    this.isListening = true;
  }

  // Load available voices
  loadVoices() {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        this.voices = voices;
        resolve(voices);
      } else {
        this.synthesis.onvoiceschanged = () => {
          this.voices = this.synthesis.getVoices();
          resolve(this.voices);
        };
      }
    });
  }

  // Set voice by language and name
  setVoice(language = 'en-US', preferredName = null) {
    if (this.voices.length === 0) {
      this.loadVoices().then(() => this.setVoice(language, preferredName));
      return;
    }

    // Filter voices by language
    const langVoices = this.voices.filter(v => v.lang.startsWith(language));
    
    if (langVoices.length === 0) {
      // Fallback to any voice
      this.voice = this.voices[0];
      return;
    }

    // Try to find preferred voice by name
    if (preferredName) {
      const preferred = langVoices.find(v => v.name.includes(preferredName));
      if (preferred) {
        this.voice = preferred;
        return;
      }
    }

    // Use first voice for language
    this.voice = langVoices[0];
  }

  // Speak text
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return false;
    }

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (options.voice) {
      utterance.voice = options.voice;
    } else if (this.voice) {
      utterance.voice = this.voice;
    }

    // Set options
    utterance.lang = options.lang || 'en-US';
    utterance.pitch = options.pitch || 1;
    utterance.rate = options.rate || 1;
    utterance.volume = options.volume || 1;

    // Event handlers
    utterance.onstart = () => {
      this.speaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.speaking = false;
      options.onEnd?.();
    };

    utterance.onerror = (error) => {
      this.speaking = false;
      options.onError?.(error);
    };

    utterance.onpause = () => options.onPause?.();
    utterance.onresume = () => options.onResume?.();
    utterance.onmark = (event) => options.onMark?.(event);
    utterance.onboundary = (event) => options.onBoundary?.(event);

    this.synthesis.speak(utterance);
    return true;
  }

  // Stop speaking
  stop() {
    if (this.synthesis && this.speaking) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }

  // Pause speaking
  pause() {
    if (this.synthesis && this.speaking) {
      this.synthesis.pause();
    }
  }

  // Resume speaking
  resume() {
    if (this.synthesis && this.speaking) {
      this.synthesis.resume();
    }
  }

  // Check if speaking
  isSpeaking() {
    return this.speaking;
  }

  // Get available voices
  getVoices(lang = null) {
    if (lang) {
      return this.voices.filter(v => v.lang.startsWith(lang));
    }
    return this.voices;
  }

  // Get voice by name
  getVoiceByName(name) {
    return this.voices.find(v => v.name === name);
  }

  // Convert text to speech audio file
  async textToSpeech(text, options = {}) {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: options.model || 'tts-1',
          input: text,
          voice: options.voice || 'nova',
          response_format: options.format || 'mp3',
          speed: options.speed || 1.0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return {
        success: true,
        audioUrl,
        blob: audioBlob
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Convert speech to text
  async speechToText(audioBlob, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', options.model || 'whisper-1');
      formData.append('language', options.language || 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      
      return {
        success: true,
        text: data.text,
        confidence: data.confidence
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check for emergency keywords
  checkEmergencyKeywords(text) {
    const emergencyKeywords = {
      'en': ['help', 'emergency', 'sos', 'danger', 'save me', 'police', 'ambulance'],
      'ta': ['உதவி', 'அவசரம்', 'காப்பாற்றுங்கள்', 'போலீஸ்', 'ஆம்புலன்ஸ்'],
      'hi': ['मदद', 'आपातकाल', 'बचाओ', 'पुलिस', 'एम्बुलेंस']
    };

    const lowerText = text.toLowerCase();
    
    for (const [lang, keywords] of Object.entries(emergencyKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return {
            detected: true,
            keyword,
            language: lang,
            confidence: 0.9
          };
        }
      }
    }

    return { detected: false };
  }

  // Get voice commands for app
  getVoiceCommands() {
    return {
      'help': 'Trigger SOS',
      'emergency': 'Trigger SOS',
      'sakhi': 'Activate voice assistant',
      'police': 'Call police',
      'tracking': 'Start live tracking',
      'fake call': 'Trigger fake call',
      'silent mode': 'Activate silent mode',
      'threat detected': 'Report threat',
      'where am i': 'Get current location',
      'safety score': 'Get safety score',
      'check area': 'Analyze area safety',
      'locate family': 'Show family locations',
      'start tracking': 'Begin location tracking',
      'stop tracking': 'End location tracking',
      'find police': 'Find nearby police stations',
      'find hospital': 'Find nearby hospitals',
      'find atm': 'Find nearby ATMs',
      'find shelter': 'Find nearby shelters',
      'open safety navigation': 'Open the safety navigation page',
      'open live tracking': 'Open the live tracking page',
      'open share location': 'Open the share location page',
      'open family tracking': 'Open family tracking',
      'open voice hub': 'Open the voice command center',
      'open dashboard': 'Open the dashboard',
      'emergency contacts': 'Show emergency contacts'
    };
  }
}

// Create singleton instance
export const voiceService = new VoiceService();
