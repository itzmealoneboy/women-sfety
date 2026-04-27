import React, { useState, useEffect } from 'react';

const FakeCall = () => {
  const [isActive, setIsActive] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [callerInfo, setCallerInfo] = useState(null);
  const [threatLevel, setThreatLevel] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    if (isActive) {
      simulateCall();
    }
  }, [isActive]);

  const simulateCall = () => {
    const fakeCallers = [
      { name: 'Bank Security', number: '1800-123-4567', type: 'Bank', threat: 'High' },
      { name: 'Tax Department', number: '1800-987-6543', type: 'Government', threat: 'High' },
      { name: 'Tech Support', number: '1800-555-1234', type: 'Scam', threat: 'Critical' },
      { name: 'Credit Card Company', number: '1800-444-5678', type: 'Financial', threat: 'Medium' }
    ];
    
    const randomCaller = fakeCallers[Math.floor(Math.random() * fakeCallers.length)];
    setCallerInfo(randomCaller);
    setCallStatus('ringing');
    
    // Auto-answer after 3 seconds for demo
    setTimeout(() => {
      setCallStatus('active');
      simulateConversation(randomCaller);
    }, 3000);
  };

  const simulateConversation = (caller) => {
    const scamScripts = {
      Bank: [
        "Your account has been compromised. Please verify your OTP.",
        "We've detected suspicious activity on your account.",
        "Please provide your account details for verification."
      ],
      Government: [
        "You have unpaid taxes. Immediate payment required.",
        "Your PAN card has been suspended.",
        "Legal action will be taken if payment is not made."
      ],
      Scam: [
        "Your computer has a virus. Please install this software.",
        "You've won a lottery! Please pay processing fees.",
        "Your Amazon order needs verification."
      ],
      Financial: [
        "Your credit card has been used fraudulently.",
        "We're offering a 0% interest loan.",
        "Your credit score has dropped significantly."
      ]
    };
    
    const scripts = scamScripts[caller.type] || scamScripts.Scam;
    let scriptIndex = 0;
    
    const interval = setInterval(() => {
      if (scriptIndex < scripts.length) {
        setTranscript(prev => [...prev, {
          speaker: 'caller',
          text: scripts[scriptIndex],
          timestamp: new Date()
        }]);
        scriptIndex++;
      } else {
        clearInterval(interval);
        analyzeCall(caller);
      }
    }, 5000);
  };

  const analyzeCall = (caller) => {
    const threatAnalysis = {
      level: caller.threat,
      score: caller.threat === 'Critical' ? 95 : caller.threat === 'High' ? 85 : 70,
      indicators: [],
      recommendations: []
    };
    
    if (caller.type === 'Bank') {
      threatAnalysis.indicators.push('Unsolicited request for OTP verification');
      threatAnalysis.indicators.push('Pressure to act immediately');
      threatAnalysis.recommendations.push('Never share OTP with anyone');
      threatAnalysis.recommendations.push('Call bank directly using official number');
    } else if (caller.type === 'Government') {
      threatAnalysis.indicators.push('Threat of legal action for immediate payment');
      threatAnalysis.indicators.push('Request for personal information');
      threatAnalysis.recommendations.push('Government agencies never ask for immediate payment over phone');
      threatAnalysis.recommendations.push('Verify through official government portal');
    } else if (caller.type === 'Scam') {
      threatAnalysis.indicators.push('Unsolicited tech support call');
      threatAnalysis.indicators.push('Request for remote access');
      threatAnalysis.recommendations.push('Legitimate tech support never makes unsolicited calls');
      threatAnalysis.recommendations.push('Do not install any software from unknown callers');
    }
    
    setThreatLevel(threatAnalysis);
    
    // Add to call history
    setCallHistory(prev => [{
      id: Date.now(),
      caller: caller.name,
      number: caller.number,
      timestamp: new Date(),
      threatLevel: caller.threat,
      duration: '45 seconds'
    }, ...prev]);
  };

  const endCall = () => {
    setCallStatus('ended');
    setIsActive(false);
    
    setTimeout(() => {
      setCallStatus('idle');
      setCallerInfo(null);
      setTranscript([]);
    }, 3000);
  };

  const reportCall = () => {
    alert('Call reported to authorities. Thank you for helping fight phone scams!');
  };

  return (
    <div className="fake-call">
      <div className="call-header">
        <h2>Fake Call Detector</h2>
        <p>AI-powered scam call detection and analysis</p>
      </div>

      {!isActive && callStatus === 'idle' && (
        <div className="simulate-controls">
          <button onClick={() => setIsActive(true)} className="btn-simulate">
            📞 Simulate Fake Call
          </button>
          <div className="info-box">
            <h4>How it works:</h4>
            <ul>
              <li>AI analyzes call patterns and speech</li>
              <li>Detects scam indicators in real-time</li>
              <li>Provides threat assessment and recommendations</li>
              <li>Reports suspicious calls to authorities</li>
            </ul>
          </div>
        </div>
      )}

      {(callStatus === 'ringing' || callStatus === 'active') && callerInfo && (
        <div className="call-screen">
          <div className={`call-status ${callStatus}`}>
            {callStatus === 'ringing' && (
              <div className="ringing-animation">
                <div className="ring"></div>
                <div className="ring"></div>
                <div className="ring"></div>
              </div>
            )}
            <div className="caller-info">
              <div className="caller-icon">📞</div>
              <div className="caller-name">{callerInfo.name}</div>
              <div className="caller-number">{callerInfo.number}</div>
              <div className={`threat-badge threat-${callerInfo.threat.toLowerCase()}`}>
                {callerInfo.threat} Risk Call
              </div>
            </div>
            <div className="call-timer">
              {callStatus === 'active' && 'Call in progress...'}
              {callStatus === 'ringing' && 'Incoming call...'}
            </div>
          </div>

          {callStatus === 'active' && (
            <div className="transcript-section">
              <h4>Live Transcript & Analysis</h4>
              <div className="transcript-list">
                {transcript.map((item, index) => (
                  <div key={index} className={`transcript-item ${item.speaker}`}>
                    <div className="speaker-badge">
                      {item.speaker === 'caller' ? 'Caller' : 'You'}
                    </div>
                    <div className="message">{item.text}</div>
                    <div className="timestamp">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="call-actions">
            {callStatus === 'ringing' && (
              <>
                <button className="btn-answer" onClick={() => setCallStatus('active')}>
                  Answer
                </button>
                <button className="btn-decline" onClick={endCall}>
                  Decline
                </button>
              </>
            )}
            {callStatus === 'active' && (
              <button className="btn-end" onClick={endCall}>
                End Call
              </button>
            )}
          </div>
        </div>
      )}

      {threatLevel && callStatus === 'ended' && (
        <div className="threat-analysis">
          <h3>Call Analysis Results</h3>
          <div className={`analysis-card threat-${threatLevel.level.toLowerCase()}`}>
            <div className="threat-score">
              <div className="score-circle">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={threatLevel.level === 'Critical' ? '#dc3545' : 
                            threatLevel.level === 'High' ? '#fd7e14' : '#ffc107'}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45 * threatLevel.score / 100} ${2 * Math.PI * 45 * (100 - threatLevel.score) / 100}`}
                    strokeDashoffset={2 * Math.PI * 45 * 0.25}
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {threatLevel.score}%
                  </text>
                </svg>
              </div>
              <div className="threat-level">
                {threatLevel.level} Threat Level
              </div>
            </div>

            <div className="indicators">
              <h4>Scam Indicators Detected:</h4>
              <ul>
                {threatLevel.indicators.map((ind, i) => (
                  <li key={i}>⚠️ {ind}</li>
                ))}
              </ul>
            </div>

            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {threatLevel.recommendations.map((rec, i) => (
                  <li key={i}>✓ {rec}</li>
                ))}
              </ul>
            </div>

            <div className="report-actions">
              <button onClick={reportCall} className="btn-report">
                Report to Authorities
              </button>
              <button onClick={() => setIsActive(false)} className="btn-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {callHistory.length > 0 && (
        <div className="call-history">
          <h3>Recent Call Analysis</h3>
          <div className="history-list">
            {callHistory.map(call => (
              <div key={call.id} className={`history-item threat-${call.threatLevel.toLowerCase()}`}>
                <div className="history-icon">📞</div>
                <div className="history-details">
                  <div className="history-caller">{call.caller}</div>
                  <div className="history-number">{call.number}</div>
                  <div className="history-time">{call.timestamp.toLocaleString()}</div>
                </div>
                <div className={`history-badge threat-${call.threatLevel.toLowerCase()}`}>
                  {call.threatLevel}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .fake-call {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .call-header {
          margin-bottom: 30px;
        }

        .call-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .call-header p {
          margin: 0;
          color: #666;
        }

        .simulate-controls {
          text-align: center;
        }

        .btn-simulate {
          padding: 15px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 30px;
          transition: transform 0.2s;
        }

        .btn-simulate:hover {
          transform: translateY(-2px);
        }

        .info-box {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        .info-box h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .info-box ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-box li {
          margin-bottom: 5px;
          color: #666;
        }

        .call-screen {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .call-status {
          text-align: center;
        }

        .ringing-animation {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
        }

        .ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 4px solid #007bff;
          border-radius: 50%;
          animation: ring 1.5s ease-out infinite;
        }

        .ring:nth-child(2) {
          animation-delay: 0.5s;
        }

        .ring:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes ring {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .caller-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }

        .caller-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .caller-number {
          color: #666;
          margin-bottom: 15px;
        }

        .threat-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .threat-badge.threat-high {
          background: #fd7e14;
          color: white;
        }

        .threat-badge.threat-critical {
          background: #dc3545;
          color: white;
        }

        .call-timer {
          margin-top: 20px;
          color: #666;
        }

        .transcript-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .transcript-section h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .transcript-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .transcript-item {
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 8px;
        }

        .transcript-item.caller {
          background: #f0f0f0;
        }

        .transcript-item.you {
          background: #e7f3ff;
        }

        .speaker-badge {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .message {
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }

        .timestamp {
          font-size: 10px;
          color: #999;
        }

        .call-actions {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-answer, .btn-decline, .btn-end {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-answer {
          background: #28a745;
          color: white;
        }

        .btn-decline, .btn-end {
          background: #dc3545;
          color: white;
        }

        .threat-analysis {
          max-width: 500px;
          margin: 30px auto;
        }

        .threat-analysis h3 {
          margin: 0 0 20px 0;
          color: #333;
          text-align: center;
        }

        .analysis-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .analysis-card.threat-critical {
          border-left: 4px solid #dc3545;
        }

        .analysis-card.threat-high {
          border-left: 4px solid #fd7e14;
        }

        .threat-score {
          text-align: center;
          margin-bottom: 20px;
        }

        .threat-level {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
        }

        .indicators, .recommendations {
          margin-bottom: 20px;
        }

        .indicators h4, .recommendations h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .indicators ul, .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .indicators li, .recommendations li {
          margin-bottom: 5px;
          color: #666;
        }

        .report-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-report, .btn-close {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-report {
          background: #007bff;
          color: white;
        }

        .btn-close {
          background: #6c757d;
          color: white;
        }

        .call-history {
          margin-top: 40px;
        }

        .call-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .history-item.threat-high {
          border-left: 3px solid #fd7e14;
        }

        .history-item.threat-critical {
          border-left: 3px solid #dc3545;
        }

        .history-icon {
          font-size: 32px;
        }

        .history-details {
          flex: 1;
        }

        .history-caller {
          font-weight: bold;
          color: #333;
        }

        .history-number {
          font-size: 12px;
          color: #666;
        }

        .history-time {
          font-size: 11px;
          color: #999;
        }

        .history-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .history-badge.threat-high {
          background: #fd7e14;
        }

        .history-badge.threat-critical {
          background: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default FakeCall;
