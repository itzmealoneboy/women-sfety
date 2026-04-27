import React, { useState, useRef, useEffect } from 'react';

const BackgroundNoiseAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [noiseType, setNoiseType] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [audioData, setAudioData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startNoiseAnalysis();
    } else {
      stopNoiseAnalysis();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      setIsRecording(true);
      setLoading(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const startNoiseAnalysis = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const analyzeNoise = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average noise level
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedLevel = (average / 255) * 100;
      setNoiseLevel(Math.round(normalizedLevel));
      
      // Determine noise type based on frequency patterns
      const frequencies = Array.from(dataArray);
      const lowFreq = frequencies.slice(0, 20).reduce((a, b) => a + b, 0) / 20;
      const midFreq = frequencies.slice(20, 100).reduce((a, b) => a + b, 0) / 80;
      const highFreq = frequencies.slice(100).reduce((a, b) => a + b, 0) / (frequencies.length - 100);
      
      let detectedType = 'Ambient';
      if (lowFreq > 150 && lowFreq > midFreq && lowFreq > highFreq) {
        detectedType = 'Mechanical/Rumbling';
      } else if (midFreq > 150 && midFreq > lowFreq && midFreq > highFreq) {
        detectedType = 'Human Voice/Conversation';
      } else if (highFreq > 150 && highFreq > lowFreq && highFreq > midFreq) {
        detectedType = 'Electronic/Static';
      }
      
      setNoiseType(detectedType);
      
      // Store audio data for visualization
      setAudioData(prev => [...prev.slice(-100), normalizedLevel]);
      
      animationFrameRef.current = requestAnimationFrame(analyzeNoise);
    };
    
    analyzeNoise();
  };

  const stopNoiseAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeBackgroundNoise = () => {
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      const analysisResults = {
        overallQuality: noiseLevel < 30 ? 'Excellent' : noiseLevel < 60 ? 'Acceptable' : 'Poor',
        recommendations: [],
        detectedSounds: []
      };
      
      if (noiseLevel > 60) {
        analysisResults.recommendations.push('Find a quieter environment for calls');
        analysisResults.recommendations.push('Use noise-canceling headphones');
      } else if (noiseLevel > 30) {
        analysisResults.recommendations.push('Consider moving to a quieter spot');
      } else {
        analysisResults.recommendations.push('Environment is optimal for communication');
      }
      
      if (noiseType === 'Mechanical/Rumbling') {
        analysisResults.detectedSounds.push('Machine noise detected - may interfere with clarity');
        analysisResults.recommendations.push('Move away from mechanical equipment');
      } else if (noiseType === 'Human Voice/Conversation') {
        analysisResults.detectedSounds.push('Background conversations detected');
        analysisResults.recommendations.push('Find a more private location');
      } else if (noiseType === 'Electronic/Static') {
        analysisResults.detectedSounds.push('Electronic interference detected');
        analysisResults.recommendations.push('Check microphone connections');
      }
      
      setAnalysis(analysisResults);
      setLoading(false);
    }, 2000);
  };

  const getNoiseColor = (level) => {
    if (level < 30) return '#28a745';
    if (level < 60) return '#ffc107';
    return '#dc3545';
  };

  const getNoiseLabel = (level) => {
    if (level < 30) return 'Quiet';
    if (level < 60) return 'Moderate';
    return 'Noisy';
  };

  return (
    <div className="background-noise-analysis">
      <div className="analysis-header">
        <h2>Background Noise Analysis</h2>
        <p>AI-powered audio environment assessment</p>
      </div>

      <div className="noise-meter-container">
        <div className="noise-meter">
          <div className="meter-label">Background Noise Level</div>
          <div className="meter-value" style={{ color: getNoiseColor(noiseLevel) }}>
            {noiseLevel}%
          </div>
          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{
                width: `${noiseLevel}%`,
                backgroundColor: getNoiseColor(noiseLevel)
              }}
            />
          </div>
          <div className="meter-status">
            <span className="status-label">Status:</span>
            <span className="status-value" style={{ color: getNoiseColor(noiseLevel) }}>
              {getNoiseLabel(noiseLevel)}
            </span>
          </div>
          {noiseType && (
            <div className="noise-type">
              <span className="type-label">Detected:</span>
              <span className="type-value">{noiseType}</span>
            </div>
          )}
        </div>

        <div className="audio-visualization">
          <h3>Real-time Audio Waveform</h3>
          <div className="waveform">
            {audioData.map((level, index) => (
              <div
                key={index}
                className="waveform-bar"
                style={{
                  height: `${level}%`,
                  backgroundColor: getNoiseColor(level)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        {!isRecording ? (
          <button onClick={startRecording} className="btn-record">
            🎤 Start Recording
          </button>
        ) : (
          <>
            <button onClick={() => setIsRecording(false)} className="btn-stop">
              ⏹️ Stop Recording
            </button>
            <button onClick={analyzeBackgroundNoise} className="btn-analyze" disabled={loading}>
              {loading ? 'Analyzing...' : '🔍 Analyze Noise'}
            </button>
          </>
        )}
      </div>

      {analysis && (
        <div className="analysis-results">
          <h3>AI Analysis Results</h3>
          <div className="results-card">
            <div className="quality-badge" style={{
              backgroundColor: analysis.overallQuality === 'Excellent' ? '#28a745' :
                             analysis.overallQuality === 'Acceptable' ? '#ffc107' : '#dc3545'
            }}>
              {analysis.overallQuality} Quality
            </div>
            
            {analysis.detectedSounds.length > 0 && (
              <div className="detected-sounds">
                <h4>Detected Sounds:</h4>
                <ul>
                  {analysis.detectedSounds.map((sound, i) => (
                    <li key={i}>{sound}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>✓ {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3>Tips for Better Audio Quality</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎧</div>
            <h4>Use Headphones</h4>
            <p>Reduces echo and improves audio clarity</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔇</div>
            <h4>Mute When Not Speaking</h4>
            <p>Minimizes background noise transmission</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏠</div>
            <h4>Find Quiet Space</h4>
            <p>Move away from doors, windows, and appliances</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <h4>Check Microphone Position</h4>
            <p>Ensure microphone is not obstructed</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .background-noise-analysis {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .analysis-header {
          margin-bottom: 30px;
        }

        .analysis-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .analysis-header p {
          margin: 0;
          color: #666;
        }

        .noise-meter-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .noise-meter {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .meter-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .meter-value {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .meter-bar {
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .meter-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .meter-status, .noise-type {
          margin-top: 10px;
          font-size: 14px;
        }

        .status-label, .type-label {
          color: #666;
          margin-right: 10px;
        }

        .audio-visualization {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .audio-visualization h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .waveform {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 100px;
        }

        .waveform-bar {
          flex: 1;
          transition: height 0.1s ease;
          border-radius: 2px;
        }

        .controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .btn-record, .btn-stop, .btn-analyze {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-record {
          background: #28a745;
          color: white;
        }

        .btn-record:hover {
          background: #218838;
        }

        .btn-stop {
          background: #dc3545;
          color: white;
        }

        .btn-stop:hover {
          background: #c82333;
        }

        .btn-analyze {
          background: #007bff;
          color: white;
        }

        .btn-analyze:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-analyze:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analysis-results {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .analysis-results h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .results-card {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .quality-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .detected-sounds, .recommendations {
          margin-bottom: 20px;
        }

        .detected-sounds h4, .recommendations h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .detected-sounds ul, .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .detected-sounds li, .recommendations li {
          margin-bottom: 5px;
          color: #666;
        }

        .tips-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .tips-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .tip-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tip-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .tip-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .tip-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .noise-meter-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundNoiseAnalysis;
