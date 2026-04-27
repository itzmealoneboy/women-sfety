import React, { useState } from 'react';

const FakeProfileDetectors = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const analyzeProfile = async () => {
    if (!profileUrl) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        score: Math.random() * 100,
        indicators: [],
        recommendations: [],
        profileDetails: {
          name: 'John Doe',
          joinDate: '2024-01-15',
          friends: Math.floor(Math.random() * 1000),
          posts: Math.floor(Math.random() * 50),
          photos: Math.floor(Math.random() * 20)
        }
      };
      
      // Randomly generate indicators
      const possibleIndicators = [
        'Recently created account',
        'Limited profile information',
        'Stock photo detected in profile picture',
        'Suspicious friend-to-post ratio',
        'Inconsistent personal information',
        'No personal posts or interactions',
        'Follower-to-following ratio imbalance',
        'Profile completeness score low',
        'Email domain appears suspicious',
        'Location information inconsistent'
      ];
      
      const numIndicators = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numIndicators; i++) {
        const indicator = possibleIndicators[Math.floor(Math.random() * possibleIndicators.length)];
        if (!mockResults.indicators.includes(indicator)) {
          mockResults.indicators.push(indicator);
        }
      }
      
      if (mockResults.score < 30) {
        mockResults.recommendations = [
          'Profile highly likely to be fake - block and report',
          'Do not share personal information',
          'Report to platform administrators'
        ];
      } else if (mockResults.score < 60) {
        mockResults.recommendations = [
          'Profile shows suspicious signs - proceed with caution',
          'Verify identity through other channels',
          'Request video call to confirm authenticity'
        ];
      } else {
        mockResults.recommendations = [
          'Profile appears legitimate',
          'Exercise normal caution when interacting',
          'Continue monitoring for unusual behavior'
        ];
      }
      
      setResults(mockResults);
      
      // Add to history
      setScanHistory(prev => [{
        id: Date.now(),
        url: profileUrl,
        score: mockResults.score,
        timestamp: new Date(),
        indicators: mockResults.indicators.length
      }, ...prev.slice(0, 9)]);
      
      setAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#28a745';
    if (score >= 40) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Likely Legitimate';
    if (score >= 40) return 'Suspicious';
    return 'Likely Fake';
  };

  return (
    <div className="fake-profile-detector">
      <div className="detector-header">
        <h2>Fake Profile Detector</h2>
        <p>AI-powered social media profile authenticity analysis</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label>Profile URL or Username</label>
          <input
            type="text"
            placeholder="Enter profile URL or username..."
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
        </div>
        <button 
          onClick={analyzeProfile} 
          disabled={!profileUrl || analyzing}
          className="btn-analyze"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Profile'}
        </button>
      </div>

      {analyzing && (
        <div className="analyzing-state">
          <div className="spinner"></div>
          <p>AI is analyzing profile data...</p>
          <div className="progress-steps">
            <div className="step">📸 Checking profile images</div>
            <div className="step">📝 Analyzing content patterns</div>
            <div className="step">👥 Examining network connections</div>
            <div className="step">🔍 Cross-referencing databases</div>
          </div>
        </div>
      )}

      {results && !analyzing && (
        <div className="results-section">
          <div className="score-container">
            <div className="score-circle">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="12"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke={getScoreColor(results.score)}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 65 * results.score / 100} ${2 * Math.PI * 65 * (100 - results.score) / 100}`}
                  strokeDashoffset={2 * Math.PI * 65 * 0.25}
                  transform="rotate(-90 75 75)"
                />
                <text
                  x="75"
                  y="88"
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="bold"
                  fill={getScoreColor(results.score)}
                >
                  {Math.round(results.score)}%
                </text>
              </svg>
            </div>
            <div className="score-label" style={{ color: getScoreColor(results.score) }}>
              {getScoreLabel(results.score)}
            </div>
          </div>

          <div className="profile-details">
            <h4>Profile Analysis</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{results.profileDetails.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Join Date:</span>
                <span className="detail-value">{results.profileDetails.joinDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Friends/Followers:</span>
                <span className="detail-value">{results.profileDetails.friends}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Posts:</span>
                <span className="detail-value">{results.profileDetails.posts}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Photos:</span>
                <span className="detail-value">{results.profileDetails.photos}</span>
              </div>
            </div>
          </div>

          <div className="indicators">
            <h4>⚠️ Suspicious Indicators Found</h4>
            <ul>
              {results.indicators.map((indicator, i) => (
                <li key={i}>{indicator}</li>
              ))}
            </ul>
          </div>

          <div className="recommendations">
            <h4>✅ AI Recommendations</h4>
            <ul>
              {results.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            <button className="btn-report" onClick={() => alert('Profile reported to platform')}>
              Report Profile
            </button>
            <button className="btn-block" onClick={() => alert('Profile blocked')}>
              Block User
            </button>
            <button className="btn-new" onClick={() => {
              setProfileUrl('');
              setResults(null);
            }}>
              Analyze Another
            </button>
          </div>
        </div>
      )}

      {scanHistory.length > 0 && (
        <div className="scan-history">
          <h3>Recent Scans</h3>
          <div className="history-list">
            {scanHistory.map(scan => (
              <div key={scan.id} className="history-item">
                <div className="history-url">{scan.url}</div>
                <div className="history-score" style={{ color: getScoreColor(scan.score) }}>
                  {Math.round(scan.score)}%
                </div>
                <div className="history-indicators">
                  {scan.indicators} indicators found
                </div>
                <div className="history-time">
                  {scan.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .fake-profile-detector {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .detector-header {
          margin-bottom: 30px;
        }

        .detector-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .detector-header p {
          margin: 0;
          color: #666;
        }

        .input-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .btn-analyze {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-analyze:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-analyze:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analyzing-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-steps {
          margin-top: 20px;
        }

        .step {
          padding: 5px 0;
          color: #666;
          font-size: 14px;
        }

        .results-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .score-container {
          text-align: center;
          margin-bottom: 30px;
        }

        .score-circle {
          display: inline-block;
          margin-bottom: 15px;
        }

        .score-label {
          font-size: 20px;
          font-weight: bold;
        }

        .profile-details {
          margin-bottom: 20px;
        }

        .profile-details h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .detail-label {
          color: #666;
        }

        .detail-value {
          font-weight: 500;
          color: #333;
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
          margin-bottom: 8px;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-report, .btn-block, .btn-new {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-report {
          background: #dc3545;
          color: white;
        }

        .btn-block {
          background: #6c757d;
          color: white;
        }

        .btn-new {
          background: #28a745;
          color: white;
        }

        .scan-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .scan-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 14px;
        }

        .history-url {
          flex: 1;
          color: #333;
          word-break: break-all;
        }

        .history-score {
          font-weight: bold;
          margin: 0 15px;
        }

        .history-indicators {
          color: #666;
          margin: 0 15px;
        }

        .history-time {
          color: #999;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default FakeProfileDetectors;
