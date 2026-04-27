import React, { useState, useEffect } from 'react';

const FaceMatchResult = ({ faceImage, referenceImage, onVerify }) => {
  const [matchScore, setMatchScore] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (faceImage && referenceImage) {
      analyzeMatch();
    }
  }, [faceImage, referenceImage]);

  const analyzeMatch = async () => {
    setIsVerifying(true);
    
    // Simulate AI face matching analysis
    setTimeout(() => {
      // Generate random match score between 60-100%
      const score = Math.random() * 40 + 60;
      
      const details = {
        overallMatch: score,
        facialFeatures: {
          eyes: score - 5 + Math.random() * 10,
          nose: score - 3 + Math.random() * 8,
          mouth: score - 2 + Math.random() * 12,
          jawline: score - 4 + Math.random() * 9,
          eyebrows: score - 1 + Math.random() * 11
        },
        confidence: score > 85 ? 'High' : score > 70 ? 'Medium' : 'Low',
        recommendations: []
      };
      
      if (score > 85) {
        details.recommendations.push('Strong match - High confidence verification');
        details.recommendations.push('Identity confirmed');
      } else if (score > 70) {
        details.recommendations.push('Moderate match - Additional verification recommended');
        details.recommendations.push('Consider secondary authentication method');
      } else {
        details.recommendations.push('Low match score - Identity verification failed');
        details.recommendations.push('Please try again with better lighting and positioning');
      }
      
      setMatchScore(score);
      setMatchDetails(details);
      setIsVerifying(false);
    }, 2000);
  };

  const handleVerification = (accept) => {
    setVerificationResult({
      accepted: accept,
      timestamp: new Date(),
      matchScore: matchScore
    });
    
    if (onVerify) {
      onVerify(accept, matchScore);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#28a745';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Strong Match';
    if (score >= 70) return 'Moderate Match';
    return 'Weak Match';
  };

  return (
    <div className="face-match-result">
      <div className="result-header">
        <h3>Face Match Analysis</h3>
        <p>AI-powered facial recognition verification</p>
      </div>

      {isVerifying ? (
        <div className="verifying-state">
          <div className="spinner"></div>
          <p>Analyzing facial features...</p>
          <div className="progress-steps">
            <div className="step">📸 Extracting features</div>
            <div className="step">🔍 Comparing patterns</div>
            <div className="step">📊 Calculating confidence</div>
          </div>
        </div>
      ) : matchScore ? (
        <>
          <div className="match-score-container">
            <div className="score-circle">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="12"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke={getScoreColor(matchScore)}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 80 * matchScore / 100} ${2 * Math.PI * 80 * (100 - matchScore) / 100}`}
                  strokeDashoffset={2 * Math.PI * 80 * 0.25}
                  transform="rotate(-90 90 90)"
                />
                <text
                  x="90"
                  y="105"
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill={getScoreColor(matchScore)}
                >
                  {Math.round(matchScore)}%
                </text>
                <text
                  x="90"
                  y="130"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#666"
                >
                  Match Score
                </text>
              </svg>
            </div>
            
            <div className="match-label" style={{ color: getScoreColor(matchScore) }}>
              {getScoreLabel(matchScore)}
            </div>
            <div className="confidence-level">
              Confidence: {matchDetails.confidence}
            </div>
          </div>

          <div className="facial-features">
            <h4>Facial Feature Analysis</h4>
            <div className="features-grid">
              {Object.entries(matchDetails.facialFeatures).map(([feature, score]) => (
                <div key={feature} className="feature-item">
                  <div className="feature-label">
                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                  </div>
                  <div className="feature-bar">
                    <div
                      className="feature-fill"
                      style={{
                        width: `${score}%`,
                        backgroundColor: getScoreColor(score)
                      }}
                    />
                  </div>
                  <div className="feature-score">{Math.round(score)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations">
            <h4>AI Recommendations</h4>
            <ul>
              {matchDetails.recommendations.map((rec, i) => (
                <li key={i}>✓ {rec}</li>
              ))}
            </ul>
          </div>

          {!verificationResult && (
            <div className="verification-actions">
              <button 
                className="btn-accept"
                onClick={() => handleVerification(true)}
              >
                ✓ Accept Match
              </button>
              <button 
                className="btn-reject"
                onClick={() => handleVerification(false)}
              >
                ✗ Reject Match
              </button>
            </div>
          )}

          {verificationResult && (
            <div className={`verification-result ${verificationResult.accepted ? 'accepted' : 'rejected'}`}>
              <div className="result-icon">
                {verificationResult.accepted ? '✓' : '✗'}
              </div>
              <div className="result-text">
                {verificationResult.accepted 
                  ? 'Verification Successful - Identity Confirmed' 
                  : 'Verification Failed - Identity Not Confirmed'}
              </div>
              <div className="result-timestamp">
                {verificationResult.timestamp.toLocaleString()}
              </div>
            </div>
          )}
        </>
      ) : null}

      <style jsx>{`
        .face-match-result {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .result-header {
          margin-bottom: 20px;
          text-align: center;
        }

        .result-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .result-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .verifying-state {
          text-align: center;
          padding: 40px;
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

        .match-score-container {
          text-align: center;
          margin-bottom: 30px;
        }

        .score-circle {
          display: inline-block;
          margin-bottom: 15px;
        }

        .match-label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .confidence-level {
          color: #666;
          font-size: 14px;
        }

        .facial-features {
          margin-bottom: 20px;
        }

        .facial-features h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .features-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-label {
          width: 80px;
          font-size: 13px;
          color: #666;
        }

        .feature-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .feature-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .feature-score {
          width: 40px;
          font-size: 12px;
          color: #666;
          text-align: right;
        }

        .recommendations {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .recommendations h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .recommendations li {
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
        }

        .verification-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-accept, .btn-reject {
          padding: 10px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-accept {
          background: #28a745;
          color: white;
        }

        .btn-accept:hover {
          background: #218838;
        }

        .btn-reject {
          background: #dc3545;
          color: white;
        }

        .btn-reject:hover {
          background: #c82333;
        }

        .verification-result {
          text-align: center;
          padding: 20px;
          border-radius: 8px;
        }

        .verification-result.accepted {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .verification-result.rejected {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
        }

        .result-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .result-text {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .verification-result.accepted .result-text {
          color: #155724;
        }

        .verification-result.rejected .result-text {
          color: #721c24;
        }

        .result-timestamp {
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default FaceMatchResult;
