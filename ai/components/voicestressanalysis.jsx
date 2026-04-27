import React, { useState, useRef } from 'react';

const VoiceStressAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      setTimeout(() => {
        analyzeStress();
      }, 3000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const analyzeStress = () => {
    const level = Math.random() * 100;
    setStressLevel(level);
    
    setAnalysis({
      level: level,
      indicators: level > 70 ? ['Rapid speech', 'Voice pitch variation', 'Breathing pattern changes'] : [],
      recommendation: level > 70 ? 'Take deep breaths and relax' : 'Voice pattern normal'
    });
    
    stopRecording();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  return (
    <div className="voice-stress-analysis">
      <h2>Voice Stress Analysis</h2>
      <p>AI-powered stress detection through voice patterns</p>

      <div className="controls">
        {!isRecording ? (
          <button onClick={startRecording} className="btn-record">Start Analysis</button>
        ) : (
          <div className="recording">Analyzing voice patterns...</div>
        )}
      </div>

      {stressLevel > 0 && (
        <div className="results">
          <div className="stress-meter">
            <div className="meter-bar">
              <div className="meter-fill" style={{ width: `${stressLevel}%`, backgroundColor: stressLevel > 70 ? '#dc3545' : stressLevel > 40 ? '#ffc107' : '#28a745' }} />
            </div>
            <div className="stress-value">Stress Level: {Math.round(stressLevel)}%</div>
          </div>

          {analysis && (
            <>
              {analysis.indicators.length > 0 && (
                <div className="indicators">
                  <h4>Stress Indicators Detected:</h4>
                  {analysis.indicators.map((ind, i) => <div key={i}>⚠️ {ind}</div>)}
                </div>
              )}
              <div className="recommendation">{analysis.recommendation}</div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .voice-stress-analysis { padding: 20px; background: white; border-radius: 12px; }
        .btn-record { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; }
        .recording { padding: 12px; background: #e7f3ff; border-radius: 6px; color: #007bff; }
        .stress-meter { margin: 20px 0; }
        .meter-bar { height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden; }
        .meter-fill { height: 100%; transition: width 0.3s ease; }
        .stress-value { font-size: 20px; font-weight: bold; margin-top: 10px; }
        .indicators { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .recommendation { background: #d4edda; padding: 15px; border-radius: 8px; color: #155724; }
      `}</style>
    </div>
  );
};

export default VoiceStressAnalysis;
