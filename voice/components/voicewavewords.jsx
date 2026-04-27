import React, { useState, useRef, useEffect } from 'react';

const VoiceWaveWords = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [detectedWords, setDetectedWords] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [wordHistory, setWordHistory] = useState([]);
  const [customWords, setCustomWords] = useState([
    'help', 'emergency', 'police', 'medical', 'fire', 'safety'
  ]);
  
  const recognitionRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart;
          } else {
            interim += transcriptPart;
          }
        }
        
        setInterimTranscript(interim);
        if (final) {
          setTranscript(final);
          processWords(final);
        }
        
        // Calculate confidence
        const avgConfidence = Array.from(event.results).reduce((sum, result) => 
          sum + result[0].confidence, 0) / event.results.length;
        setConfidence(avgConfidence * 100);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }
  }, [isListening]);

  const processWords = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const matchedWords = words.filter(word => customWords.includes(word));
    
    matchedWords.forEach(word => {
      const newWord = {
        id: Date.now(),
        word,
        timestamp: new Date(),
        confidence: confidence
      };
      setWordHistory([newWord, ...wordHistory.slice(0, 19)]);
      
      // Trigger alert for critical words
      if (word === 'emergency' || word === 'help') {
        alert(`Critical word detected: "${word.toUpperCase()}" - Emergency alert triggered!`);
      }
    });
    
    setDetectedWords(matchedWords);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      startWaveAnimation();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      stopWaveAnimation();
    }
  };

  const startWaveAnimation = () => {
    const animate = () => {
      const waves = document.querySelectorAll('.wave-word');
      waves.forEach((wave, i) => {
        const height = Math.sin(Date.now() / 200 + i) * 20 + 30;
        wave.style.height = `${height}px`;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopWaveAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const addCustomWord = () => {
    const word = prompt('Enter custom word to detect:');
    if (word && !customWords.includes(word.toLowerCase())) {
      setCustomWords([...customWords, word.toLowerCase()]);
    }
  };

  const removeCustomWord = (word) => {
    setCustomWords(customWords.filter(w => w !== word));
  };

  return (
    <div className="voice-wave-words">
      <div className="wave-header">
        <h2>Voice Wave Words</h2>
        <p>Real-time voice detection with keyword alerts</p>
      </div>

      <div className="wave-visualization">
        <div className="wave-animation">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="wave-word" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      <div className="voice-controls">
        {!isListening ? (
          <button onClick={startListening} className="start-btn">
            🎤 Start Voice Detection
          </button>
        ) : (
          <button onClick={stopListening} className="stop-btn">
            ⏹️ Stop Detection
          </button>
        )}
      </div>

      {isListening && (
        <div className="transcript-area">
          <div className="confidence-meter">
            <div className="confidence-label">Confidence: {Math.round(confidence)}%</div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>
          
          <div className="interim-transcript">
            {interimTranscript && (
              <div className="interim-text">"{interimTranscript}"</div>
            )}
          </div>
          
          <div className="final-transcript">
            {transcript && (
              <div className="final-text">
                <strong>Detected:</strong> {transcript}
              </div>
            )}
          </div>
          
          {detectedWords.length > 0 && (
            <div className="detected-words">
              <strong>Keywords Detected:</strong>
              {detectedWords.map((word, i) => (
                <span key={i} className="keyword-badge">
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="custom-words">
        <h3>Watch Words</h3>
        <div className="words-list">
          {customWords.map(word => (
            <div key={word} className="word-item">
              <span className="word-text">🔊 {word}</span>
              <button onClick={() => removeCustomWord(word)} className="remove-word">
                ×
              </button>
            </div>
          ))}
          <button onClick={addCustomWord} className="add-word-btn">
            + Add Word
          </button>
        </div>
      </div>

      <div className="word-history">
        <h3>Detection History</h3>
        <div className="history-list">
          {wordHistory.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-word">"{item.word}"</div>
              <div className="history-time">{item.timestamp.toLocaleTimeString()}</div>
              <div className="history-confidence">{Math.round(item.confidence)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tips-section">
        <h3>Voice Detection Tips</h3>
        <div className="tips-list">
          <div className="tip">🎙️ Speak clearly and at a moderate pace</div>
          <div className="tip">🔊 Reduce background noise for better accuracy</div>
          <div className="tip">📱 Add custom words you want to detect</div>
          <div className="tip">🚨 Critical words trigger immediate alerts</div>
        </div>
      </div>

      <style jsx>{`
        .voice-wave-words {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .wave-header {
          margin-bottom: 30px;
        }

        .wave-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .wave-header p {
          margin: 0;
          color: #666;
        }

        .wave-visualization {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 30px;
        }

        .wave-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 80px;
        }

        .wave-word {
          width: 4px;
          height: 40px;
          background: white;
          border-radius: 2px;
          transition: height 0.1s ease;
        }

        .voice-controls {
          text-align: center;
          margin-bottom: 30px;
        }

        .start-btn, .stop-btn {
          padding: 12px 32px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-size: 16px;
        }

        .start-btn {
          background: #28a745;
          color: white;
        }

        .stop-btn {
          background: #dc3545;
          color: white;
        }

        .transcript-area {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .confidence-meter {
          margin-bottom: 20px;
        }

        .confidence-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .confidence-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .interim-transcript {
          margin-bottom: 10px;
        }

        .interim-text {
          color: #999;
          font-style: italic;
        }

        .final-text {
          font-size: 16px;
          color: #333;
          margin-bottom: 15px;
        }

        .detected-words {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .keyword-badge {
          padding: 4px 12px;
          background: #dc3545;
          color: white;
          border-radius: 20px;
          font-size: 12px;
        }

        .custom-words {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .custom-words h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .words-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .word-item {
          background: #e7f3ff;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .word-text {
          color: #007bff;
        }

        .remove-word {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 16px;
        }

        .add-word-btn {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .word-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .word-history h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .history-word {
          font-weight: bold;
          color: #dc3545;
        }

        .history-time {
          font-size: 11px;
          color: #999;
        }

        .history-confidence {
          font-size: 11px;
          color: #28a745;
        }

        .tips-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .tips-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .tip {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default VoiceWaveWords;