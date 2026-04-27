import React, { useState, useRef } from 'react';

const VoiceSettings = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceInput, setVoiceInput] = useState(true);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('female');
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceCommands, setVoiceCommands] = useState([
    { command: "Open cases", action: "Navigate to cases" },
    { command: "Report incident", action: "Open reporting form" },
    { command: "Emergency help", action: "Call emergency services" },
    { command: "Search evidence", action: "Open search" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const recognitionRef = useRef(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const processVoiceCommand = (command) => {
    const foundCommand = voiceCommands.find(vc => 
      command.toLowerCase().includes(vc.command.toLowerCase())
    );
    if (foundCommand) {
      alert(`Command recognized: ${foundCommand.command}\nAction: ${foundCommand.action}`);
    } else {
      alert('Command not recognized. Try one of the listed commands.');
    }
  };

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Voice recognition is working correctly");
      utterance.rate = speechRate;
      utterance.voice = selectedVoice === 'female' ? 
        speechSynthesis.getVoices().find(v => v.name.includes('Google UK English Female')) : 
        speechSynthesis.getVoices().find(v => v.name.includes('Google UK English Male'));
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="voice-settings">
      <div className="settings-header">
        <h2>Voice Settings</h2>
        <p>Configure voice input and output preferences</p>
      </div>

      <div className="voice-toggle">
        <div className="toggle-info">
          <div className="toggle-icon">🎤</div>
          <div>
            <h3>Voice Assistant</h3>
            <p>Enable voice commands and responses</p>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {voiceEnabled && (
        <>
          <div className="voice-input-output">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={voiceInput}
                onChange={(e) => setVoiceInput(e.target.checked)}
              />
              Voice Input (Speech Recognition)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={voiceOutput}
                onChange={(e) => setVoiceOutput(e.target.checked)}
              />
              Voice Output (Text-to-Speech)
            </label>
          </div>

          <div className="voice-preferences">
            <h3>Voice Preferences</h3>
            
            <div className="preference-group">
              <label>Voice Type</label>
              <div className="voice-options">
                <button
                  className={`voice-option ${selectedVoice === 'male' ? 'active' : ''}`}
                  onClick={() => setSelectedVoice('male')}
                >
                  👨 Male Voice
                </button>
                <button
                  className={`voice-option ${selectedVoice === 'female' ? 'active' : ''}`}
                  onClick={() => setSelectedVoice('female')}
                >
                  👩 Female Voice
                </button>
              </div>
            </div>

            <div className="preference-group">
              <label>Speech Rate</label>
              <div className="rate-control">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                />
                <span className="rate-value">{speechRate}x</span>
              </div>
            </div>

            <button onClick={testVoice} className="test-btn">
              Test Voice
            </button>
          </div>

          <div className="voice-commands-section">
            <h3>Voice Commands</h3>
            <div className="commands-list">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="command-card">
                  <div className="command-phrase">"{cmd.command}"</div>
                  <div className="command-action">→ {cmd.action}</div>
                </div>
              ))}
            </div>
          </div>

          {voiceInput && (
            <div className="voice-test">
              <h3>Test Voice Recognition</h3>
              <button onClick={startListening} disabled={isListening} className="listen-btn">
                {isListening ? 'Listening...' : 'Start Listening'}
              </button>
              {transcript && (
                <div className="transcript">
                  <strong>Recognized:</strong> "{transcript}"
                </div>
              )}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .voice-settings {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .settings-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .settings-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0;
          color: #666;
        }

        .voice-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .toggle-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .toggle-icon {
          font-size: 32px;
        }

        .toggle-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .toggle-info p {
          margin: 0;
          color: #666;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #28a745;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .voice-input-output {
          margin-bottom: 24px;
          display: flex;
          gap: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .voice-preferences {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .voice-preferences h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .preference-group {
          margin-bottom: 20px;
        }

        .preference-group label {
          display: block;
          margin-bottom: 8px;
          color: #666;
        }

        .voice-options {
          display: flex;
          gap: 10px;
        }

        .voice-option {
          flex: 1;
          padding: 10px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-option.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .rate-control {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .rate-control input {
          flex: 1;
        }

        .rate-value {
          color: #666;
        }

        .test-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .voice-commands-section {
          margin-bottom: 24px;
        }

        .voice-commands-section h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .commands-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
        }

        .command-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
        }

        .command-phrase {
          font-family: monospace;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 5px;
        }

        .command-action {
          font-size: 12px;
          color: #666;
        }

        .voice-test {
          background: #e7f3ff;
          padding: 20px;
          border-radius: 8px;
        }

        .voice-test h3 {
          margin: 0 0 15px 0;
          color: #007bff;
        }

        .listen-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .listen-btn:disabled {
          background: #6c757d;
        }

        .transcript {
          margin-top: 15px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default VoiceSettings;
