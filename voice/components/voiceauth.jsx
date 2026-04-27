import React, { useState, useRef, useEffect } from 'react';

const VoiceAuth = () => {
  const [enrolled, setEnrolled] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [voiceprint, setVoiceprint] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check if user has enrolled
    const savedVoiceprint = localStorage.getItem('voiceprint');
    if (savedVoiceprint) {
      setVoiceprint(JSON.parse(savedVoiceprint));
      setEnrolled(true);
    }
  }, []);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          processAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setRecording(true);
        
        timerRef.current = setInterval(() => {
          setRecordingTime(t => t + 1);
        }, 1000);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access for voice authentication');
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }
  };

  const processAudio = (audioBlob) => {
    // Simulate voiceprint extraction and matching
    setTimeout(() => {
      if (enrolling) {
        // Enrollment phase
        const newVoiceprint = {
          id: Date.now(),
          timestamp: new Date(),
          features: Array.from({ length: 128 }, () => Math.random())
        };
        setVoiceprint(newVoiceprint);
        localStorage.setItem('voiceprint', JSON.stringify(newVoiceprint));
        setEnrolled(true);
        setEnrolling(false);
        setAuthResult({ success: true, message: 'Voice enrolled successfully!' });
      } else if (authenticating) {
        // Authentication phase
        if (voiceprint) {
          const matchScore = Math.random() * 100;
          const isMatch = matchScore > 70;
          
          setAuthResult({
            success: isMatch,
            score: Math.round(matchScore),
            message: isMatch ? 'Authentication successful!' : 'Voice does not match. Please try again.',
            confidence: isMatch ? 'High' : 'Low'
          });
          setAuthenticating(false);
        } else {
          setAuthResult({
            success: false,
            message: 'No voiceprint found. Please enroll first.'
          });
          setAuthenticating(false);
        }
      }
    }, 2000);
  };

  const startEnrollment = () => {
    setEnrolling(true);
    setAuthenticating(false);
    setAuthResult(null);
    startRecording();
  };

  const startAuthentication = () => {
    if (!enrolled) {
      alert('Please enroll your voice first');
      return;
    }
    setAuthenticating(true);
    setEnrolling(false);
    setAuthResult(null);
    startRecording();
  };

  const formatTime = (seconds) => {
    const secs = seconds % 60;
    return `${secs}s`;
  };

  return (
    <div className="voice-auth">
      <div className="auth-header">
        <h2>Voice Authentication</h2>
        <p>Secure access using your unique voiceprint</p>
      </div>

      <div className="auth-status">
        <div className={`status-indicator ${enrolled ? 'enrolled' : 'not-enrolled'}`}>
          <div className="status-icon">{enrolled ? '✓' : '⚠️'}</div>
          <div className="status-text">
            {enrolled ? 'Voiceprint enrolled' : 'Voiceprint not enrolled'}
          </div>
        </div>
      </div>

      <div className="auth-actions">
        {!enrolled ? (
          <button onClick={startEnrollment} disabled={recording} className="enroll-btn">
            {recording ? `Recording... ${formatTime(recordingTime)}` : 'Enroll Voiceprint'}
          </button>
        ) : (
          <>
            <button onClick={startAuthentication} disabled={recording} className="authenticate-btn">
              {recording ? `Recording... ${formatTime(recordingTime)}` : 'Authenticate'}
            </button>
            <button onClick={startEnrollment} disabled={recording} className="re-enroll-btn">
              Re-enroll
            </button>
          </>
        )}
        
        {recording && (
          <button onClick={stopRecording} className="stop-btn">
            Stop Recording
          </button>
        )}
      </div>

      {recording && (
        <div className="recording-indicator">
          <div className="wave-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <div className="recording-time">{formatTime(recordingTime)}</div>
        </div>
      )}

      {authResult && (
        <div className={`auth-result ${authResult.success ? 'success' : 'failure'}`}>
          <div className="result-icon">{authResult.success ? '✓' : '✗'}</div>
          <div className="result-message">{authResult.message}</div>
          {authResult.score && (
            <div className="result-score">
              Match Score: {authResult.score}% - {authResult.confidence} Confidence
            </div>
          )}
        </div>
      )}

      <div className="voice-tips">
        <h3>Voice Authentication Tips</h3>
        <div className="tips-list">
          <div className="tip">🎤 Use a clear, quiet environment</div>
          <div className="tip">🗣️ Speak at your normal volume and pace</div>
          <div className="tip">🔊 Keep microphone close to your mouth</div>
          <div className="tip">🔄 Re-enroll if your voice changes due to illness</div>
        </div>
      </div>

      <style jsx>{`
        .voice-auth {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .auth-header {
          margin-bottom: 30px;
        }

        .auth-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .auth-header p {
          margin: 0;
          color: #666;
        }

        .auth-status {
          margin-bottom: 30px;
        }

        .status-indicator {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .status-indicator.enrolled {
          border-left: 4px solid #28a745;
        }

        .status-indicator.not-enrolled {
          border-left: 4px solid #ffc107;
        }

        .status-icon {
          font-size: 32px;
        }

        .status-text {
          font-size: 16px;
          font-weight: 500;
        }

        .auth-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .enroll-btn, .authenticate-btn, .re-enroll-btn, .stop-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .enroll-btn {
          background: #28a745;
          color: white;
        }

        .authenticate-btn {
          background: #007bff;
          color: white;
        }

        .re-enroll-btn {
          background: #ffc107;
          color: #333;
        }

        .stop-btn {
          background: #dc3545;
          color: white;
        }

        .recording-indicator {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }

        .wave-animation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          height: 60px;
          margin-bottom: 15px;
        }

        .wave {
          width: 8px;
          height: 40px;
          background: #dc3545;
          border-radius: 4px;
          animation: wave 1s ease-in-out infinite;
        }

        .wave:nth-child(1) { animation-delay: 0s; }
        .wave:nth-child(2) { animation-delay: 0.2s; }
        .wave:nth-child(3) { animation-delay: 0.4s; }
        .wave:nth-child(4) { animation-delay: 0.6s; }

        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 60px; }
        }

        .recording-time {
          font-size: 18px;
          font-weight: bold;
          color: #dc3545;
        }

        .auth-result {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-result.success {
          border-left: 4px solid #28a745;
        }

        .auth-result.failure {
          border-left: 4px solid #dc3545;
        }

        .result-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .auth-result.success .result-icon {
          color: #28a745;
        }

        .auth-result.failure .result-icon {
          color: #dc3545;
        }

        .result-message {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .result-score {
          font-size: 13px;
          color: #666;
        }

        .voice-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .voice-tips h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

export default VoiceAuth;