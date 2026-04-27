import React, { useState, useRef, useEffect } from 'react';

const EmotionDetection = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionScores, setEmotionScores] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
    neutral: 0
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startEmotionDetection();
    } else {
      stopEmotionDetection();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  const startEmotionDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detectEmotions();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopEmotionDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const detectEmotions = () => {
    // Simulate emotion detection with random values
    // In production, this would use a face detection/emotion recognition API
    
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Generate random scores
    const newScores = {};
    emotions.forEach(emotion => {
      newScores[emotion] = Math.random();
    });
    
    // Normalize scores
    const total = Object.values(newScores).reduce((a, b) => a + b, 0);
    Object.keys(newScores).forEach(emotion => {
      newScores[emotion] = (newScores[emotion] / total) * 100;
    });
    
    setEmotionScores(newScores);
    setCurrentEmotion({
      emotion: randomEmotion,
      confidence: newScores[randomEmotion],
      timestamp: Date.now()
    });
    
    setEmotionHistory(prev => [...prev.slice(-50), {
      emotion: randomEmotion,
      timestamp: Date.now(),
      confidence: newScores[randomEmotion]
    }]);
    
    animationFrameRef.current = setTimeout(() => detectEmotions(), 500);
  };

  const analyzeEmotions = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const dominantEmotions = emotionHistory
        .slice(-20)
        .reduce((acc, curr) => {
          acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
          return acc;
        }, {});
      
      const dominant = Object.entries(dominantEmotions)
        .sort((a, b) => b[1] - a[1])[0];
      
      const analysisResults = {
        dominantEmotion: dominant[0],
        moodStability: emotionHistory.length > 10 ? 
          'Stable' : 'Fluctuating',
        stressLevel: emotionScores.angry + emotionScores.fearful + emotionScores.sad > 150 ? 'High' : 
                    emotionScores.angry + emotionScores.fearful + emotionScores.sad > 100 ? 'Moderate' : 'Low',
        recommendations: []
      };
      
      if (analysisResults.stressLevel === 'High') {
        analysisResults.recommendations.push('Take a break and practice deep breathing');
        analysisResults.recommendations.push('Consider stress-relief activities like meditation');
      } else if (analysisResults.stressLevel === 'Moderate') {
        analysisResults.recommendations.push('Maintain regular breaks during work');
        analysisResults.recommendations.push('Stay hydrated and get adequate rest');
      }
      
      if (analysisResults.dominantEmotion === 'sad') {
        analysisResults.recommendations.push('Connect with friends or family members');
        analysisResults.recommendations.push('Engage in activities you enjoy');
      } else if (analysisResults.dominantEmotion === 'angry') {
        analysisResults.recommendations.push('Practice mindfulness techniques');
        analysisResults.recommendations.push('Take a walk to calm down');
      }
      
      setAnalysis(analysisResults);
      setLoading(false);
    }, 2000);
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      fearful: '😨',
      disgusted: '🤢',
      neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '#ffc107',
      sad: '#6c757d',
      angry: '#dc3545',
      surprised: '#fd7e14',
      fearful: '#9c27b0',
      disgusted: '#28a745',
      neutral: '#17a2b8'
    };
    return colors[emotion] || '#6c757d';
  };

  return (
    <div className="emotion-detection">
      <div className="detection-header">
        <h2>Emotion Detection</h2>
        <p>AI-powered facial emotion recognition</p>
      </div>

      <div className="detection-container">
        <div className="video-section">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="video-feed"
          />
          <canvas ref={canvasRef} className="video-canvas" />
          
          {!isActive && (
            <div className="video-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🎭</div>
                <p>Click Start to begin emotion detection</p>
              </div>
            </div>
          )}
        </div>

        <div className="controls-section">
          {!isActive ? (
            <button onClick={() => setIsActive(true)} className="btn-start">
              Start Detection
            </button>
          ) : (
            <>
              <button onClick={() => setIsActive(false)} className="btn-stop">
                Stop Detection
              </button>
              <button onClick={analyzeEmotions} className="btn-analyze" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Emotions'}
              </button>
            </>
          )}
        </div>

        {currentEmotion && (
          <div className="current-emotion">
            <div className="emotion-display">
              <div className="emotion-icon" style={{ fontSize: '80px' }}>
                {getEmotionEmoji(currentEmotion.emotion)}
              </div>
              <div className="emotion-details">
                <h3>Current Emotion</h3>
                <div className="emotion-name" style={{ color: getEmotionColor(currentEmotion.emotion) }}>
                  {currentEmotion.emotion.toUpperCase()}
                </div>
                <div className="emotion-confidence">
                  Confidence: {Math.round(currentEmotion.confidence)}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="emotion-scores">
          <h3>Emotion Probabilities</h3>
          <div className="scores-grid">
            {Object.entries(emotionScores).map(([emotion, score]) => (
              <div key={emotion} className="score-bar-container">
                <div className="score-label">
                  {getEmotionEmoji(emotion)} {emotion}
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${score}%`,
                      backgroundColor: getEmotionColor(emotion)
                    }}
                  />
                </div>
                <div className="score-value">{Math.round(score)}%</div>
              </div>
            ))}
          </div>
        </div>

        {analysis && (
          <div className="analysis-results">
            <h3>Emotion Analysis Results</h3>
            <div className="results-card">
              <div className="analysis-item">
                <span className="analysis-label">Dominant Emotion:</span>
                <span className="analysis-value" style={{ color: getEmotionColor(analysis.dominantEmotion) }}>
                  {getEmotionEmoji(analysis.dominantEmotion)} {analysis.dominantEmotion}
                </span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Mood Stability:</span>
                <span className="analysis-value">{analysis.moodStability}</span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Stress Level:</span>
                <span className="analysis-value" style={{
                  color: analysis.stressLevel === 'High' ? '#dc3545' :
                         analysis.stressLevel === 'Moderate' ? '#ffc107' : '#28a745'
                }}>
                  {analysis.stressLevel}
                </span>
              </div>
              {analysis.recommendations.length > 0 && (
                <div className="recommendations">
                  <div className="analysis-label">Recommendations:</div>
                  <ul>
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .emotion-detection {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .detection-header {
          margin-bottom: 30px;
        }

        .detection-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .detection-header p {
          margin: 0;
          color: #666;
        }

        .detection-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .video-section {
          position: relative;
          margin-bottom: 20px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 16/9;
        }

        .video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .placeholder-content {
          text-align: center;
        }

        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .controls-section {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .btn-start, .btn-stop, .btn-analyze {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-start {
          background: #28a745;
          color: white;
        }

        .btn-start:hover {
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

        .current-emotion {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .emotion-display {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .emotion-details h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .emotion-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .emotion-confidence {
          color: #666;
        }

        .emotion-scores {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .emotion-scores h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .scores-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .score-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .score-label {
          width: 100px;
          font-size: 14px;
        }

        .score-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .score-value {
          width: 40px;
          font-size: 12px;
          color: #666;
        }

        .analysis-results {
          background: white;
          padding: 20px;
          border-radius: 12px;
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

        .analysis-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .analysis-item:last-child {
          border-bottom: none;
        }

        .analysis-label {
          font-weight: 500;
          color: #666;
        }

        .analysis-value {
          font-weight: bold;
          color: #333;
        }

        .recommendations {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }

        .recommendations ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .recommendations li {
          margin-bottom: 5px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default EmotionDetection;
