import React, { useState, useRef, useEffect } from 'react';

const VoiceWaves = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordings, setRecordings] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Setup recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRecording = {
          id: Date.now(),
          url: audioUrl,
          duration: recordingDuration,
          timestamp: new Date(),
          waveform: audioLevel.slice()
        };
        setRecordings([newRecording, ...recordings.slice(0, 4)]);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone');
    }
  };

  const startVisualization = () => {
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualization = () => {
      if (!isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const normalizedLevel = (average / 255) * 100;
      
      setAudioLevel(prev => [...prev.slice(-50), normalizedLevel]);
      
      // Get frequency data
      const frequencies = Array.from(dataArray.slice(0, 50));
      setFrequencyData(frequencies);
      
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };
    
    updateVisualization();
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      sourceRef.current.disconnect();
      audioContextRef.current.close();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playRecording = (url) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="voice-waves">
      <div className="waves-header">
        <h2>Voice Waves</h2>
        <p>Real-time voice visualization and recording</p>
      </div>

      <div className="visualization-container">
        <div className="waveform-visualization">
          <div className="waveform-title">Audio Waveform</div>
          <div className="waveform-canvas">
            {audioLevel.map((level, index) => (
              <div
                key={index}
                className="wave-bar"
                style={{
                  height: `${level}%`,
                  backgroundColor: `hsl(${level * 2}, 70%, 50%)`
                }}
              />
            ))}
          </div>
        </div>

        <div className="frequency-visualization">
          <div className="waveform-title">Frequency Spectrum</div>
          <div className="frequency-bars">
            {frequencyData.map((freq, index) => (
              <div
                key={index}
                className="freq-bar"
                style={{
                  height: `${(freq / 255) * 100}%`,
                  backgroundColor: `hsl(${index * 5}, 70%, 50%)`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="recording-controls">
        {!isRecording ? (
          <button onClick={startRecording} className="record-btn">
            🎤 Start Recording
          </button>
        ) : (
          <>
            <div className="recording-info">
              <div className="recording-dot"></div>
              <div className="recording-time">{formatTime(recordingDuration)}</div>
            </div>
            <button onClick={stopRecording} className="stop-record-btn">
              ⏹️ Stop Recording
            </button>
          </>
        )}
      </div>

      {recordings.length > 0 && (
        <div className="recordings-list">
          <h3>Recent Recordings</h3>
          {recordings.map(rec => (
            <div key={rec.id} className="recording-item">
              <div className="recording-waveform-mini">
                {rec.waveform.slice(0, 30).map((level, i) => (
                  <div
                    key={i}
                    className="mini-wave"
                    style={{ height: `${level / 2}%` }}
                  />
                ))}
              </div>
              <div className="recording-info">
                <div className="recording-duration">{formatTime(rec.duration)}</div>
                <div className="recording-date">{rec.timestamp.toLocaleString()}</div>
              </div>
              <button onClick={() => playRecording(rec.url)} className="play-btn">
                ▶️ Play
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="voice-info">
        <h3>About Voice Visualization</h3>
        <p>The waveform shows the amplitude of your voice over time, while the frequency spectrum shows the distribution of frequencies in your voice.</p>
      </div>

      <style jsx>{`
        .voice-waves {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .waves-header {
          margin-bottom: 30px;
        }

        .waves-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .waves-header p {
          margin: 0;
          color: #666;
        }

        .visualization-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .waveform-visualization, .frequency-visualization {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .waveform-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
          text-align: center;
        }

        .waveform-canvas {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 150px;
        }

        .wave-bar {
          flex: 1;
          transition: height 0.05s ease;
          border-radius: 2px;
        }

        .frequency-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 150px;
        }

        .freq-bar {
          flex: 1;
          transition: height 0.05s ease;
          border-radius: 2px;
        }

        .recording-controls {
          text-align: center;
          margin-bottom: 30px;
        }

        .record-btn, .stop-record-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-size: 16px;
        }

        .record-btn {
          background: #dc3545;
          color: white;
        }

        .stop-record-btn {
          background: #6c757d;
          color: white;
        }

        .recording-info {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-right: 15px;
          background: white;
          padding: 8px 20px;
          border-radius: 30px;
        }

        .recording-dot {
          width: 12px;
          height: 12px;
          background: #dc3545;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .recording-time {
          font-family: monospace;
          font-size: 18px;
          font-weight: bold;
        }

        .recordings-list {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .recordings-list h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .recording-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .recording-waveform-mini {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          width: 150px;
          height: 40px;
        }

        .mini-wave {
          flex: 1;
          background: #007bff;
          border-radius: 1px;
        }

        .recording-duration {
          font-weight: bold;
          color: #333;
        }

        .recording-date {
          font-size: 11px;
          color: #999;
        }

        .play-btn {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .voice-info {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .voice-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .voice-info p {
          margin: 0;
          color: #666;
        }

        @media (max-width: 768px) {
          .visualization-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceWaves;