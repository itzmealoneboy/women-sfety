import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text.trim()) {
      alert('Please enter text to speak');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = selectedLanguage;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

    const historyEntry = {
      id: Date.now(),
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      timestamp: new Date(),
      voice: voice?.name || 'Default'
    };
    setHistory([historyEntry, ...history.slice(0, 9)]);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const saveToHistory = (savedText) => {
    setText(savedText);
  };

  const downloadAudio = () => {
    alert('Audio download feature would be available in premium version');
  };

  return (
    <div className="text-to-speech">
      <div className="tts-header">
        <h2>Text to Speech</h2>
        <p>Convert text to natural-sounding speech</p>
      </div>

      <div className="tts-container">
        <div className="input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={6}
          />
          <div className="text-controls">
            <div className="char-count">{text.length} characters</div>
            <button onClick={() => setText('')} className="clear-btn">Clear</button>
          </div>
        </div>

        <div className="voice-settings">
          <h3>Voice Settings</h3>
          <div className="settings-grid">
            <div className="setting-group">
              <label>Voice</label>
              <select value={voice?.name || ''} onChange={(e) => {
                const selected = voices.find(v => v.name === e.target.value);
                setVoice(selected);
              }}>
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label>Language</label>
              <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="hi-IN">Hindi</option>
                <option value="ta-IN">Tamil</option>
                <option value="te-IN">Telugu</option>
                <option value="bn-IN">Bengali</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Speed: {rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Pitch: {pitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Volume: {Math.round(volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={speak} disabled={isSpeaking} className="speak-btn">
            {isSpeaking ? 'Speaking...' : '🔊 Speak'}
          </button>
          <button onClick={stopSpeaking} className="stop-btn">
            ⏹️ Stop
          </button>
          <button onClick={downloadAudio} className="download-btn">
            💾 Download Audio
          </button>
        </div>

        <div className="voice-preview">
          <h3>Voice Preview</h3>
          <div className="preview-buttons">
            <button onClick={() => {
              const previewText = "This is a preview of the selected voice. You can hear how it sounds.";
              const utterance = new SpeechSynthesisUtterance(previewText);
              utterance.voice = voice;
              utterance.rate = rate;
              utterance.pitch = pitch;
              window.speechSynthesis.speak(utterance);
            }} className="preview-btn">
              Preview Voice
            </button>
          </div>
        </div>

        <div className="history-section">
          <h3>Recent Speeches</h3>
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-text">{item.text}</div>
                <div className="history-meta">
                  <span className="history-voice">{item.voice}</span>
                  <span className="history-time">{item.timestamp.toLocaleTimeString()}</span>
                  <button onClick={() => saveToHistory(item.text)} className="reuse-btn">
                    Reuse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-to-speech {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .tts-header {
          margin-bottom: 30px;
        }

        .tts-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .tts-header p {
          margin: 0;
          color: #666;
        }

        .tts-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .input-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .input-section textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .text-controls {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .char-count {
          color: #999;
          font-size: 12px;
        }

        .clear-btn {
          padding: 4px 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .voice-settings {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .voice-settings h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-group label {
          font-size: 13px;
          color: #666;
        }

        .setting-group select, .setting-group input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .speak-btn, .stop-btn, .download-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .speak-btn {
          background: #28a745;
          color: white;
        }

        .stop-btn {
          background: #dc3545;
          color: white;
        }

        .download-btn {
          background: #007bff;
          color: white;
        }

        .voice-preview {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .voice-preview h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .preview-btn {
          padding: 8px 16px;
          background: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .history-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .history-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .history-text {
          font-size: 13px;
          color: #333;
          margin-bottom: 5px;
        }

        .history-meta {
          display: flex;
          gap: 15px;
          align-items: center;
          font-size: 11px;
          color: #999;
        }

        .reuse-btn {
          padding: 2px 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TextToSpeech;