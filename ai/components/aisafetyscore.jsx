import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AISafetyScore = () => {
  const [safetyScore, setSafetyScore] = useState(85);
  const [historicalScores, setHistoricalScores] = useState([]);
  const [riskFactors, setRiskFactors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSafetyData();
  }, []);

  const fetchSafetyData = async () => {
    try {
      // Simulate API call for safety data
      const mockHistorical = [
        { date: 'Jan', score: 78 },
        { date: 'Feb', score: 82 },
        { date: 'Mar', score: 85 },
        { date: 'Apr', score: 84 },
        { date: 'May', score: 86 },
        { date: 'Jun', score: 85 }
      ];

      const mockRiskFactors = [
        { name: 'Account Security', score: 92, weight: 25 },
        { name: 'Device Security', score: 78, weight: 20 },
        { name: 'Network Safety', score: 85, weight: 15 },
        { name: 'Behavioral Analysis', score: 88, weight: 20 },
        { name: 'Data Privacy', score: 82, weight: 20 }
      ];

      const mockRecommendations = [
        { priority: 'High', text: 'Enable two-factor authentication', action: 'Enable 2FA' },
        { priority: 'Medium', text: 'Update device security patches', action: 'Update Now' },
        { priority: 'Medium', text: 'Review recent login attempts', action: 'Review' },
        { priority: 'Low', text: 'Clear browser cache and cookies', action: 'Clear' }
      ];

      setHistoricalScores(mockHistorical);
      setRiskFactors(mockRiskFactors);
      setRecommendations(mockRecommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching safety data:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Improvement';
    return 'Critical';
  };

  const COLORS = ['#28a745', '#ffc107', '#fd7e14', '#dc3545', '#6c757d'];

  return (
    <div className="ai-safety-score">
      <div className="score-header">
        <h2>AI Safety Score</h2>
        <p>Real-time security assessment powered by AI</p>
      </div>

      {loading ? (
        <div className="loading">Analyzing security posture...</div>
      ) : (
        <>
          <div className="score-container">
            <div className="current-score">
              <div className="score-circle">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="15"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={getScoreColor(safetyScore)}
                    strokeWidth="15"
                    strokeDasharray={`${2 * Math.PI * 90 * safetyScore / 100} ${2 * Math.PI * 90 * (100 - safetyScore) / 100}`}
                    strokeDashoffset={2 * Math.PI * 90 * 0.25}
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="115"
                    textAnchor="middle"
                    fontSize="48"
                    fontWeight="bold"
                    fill={getScoreColor(safetyScore)}
                  >
                    {safetyScore}
                  </text>
                  <text
                    x="100"
                    y="145"
                    textAnchor="middle"
                    fontSize="16"
                    fill="#666"
                  >
                    Safety Score
                  </text>
                </svg>
              </div>
              <div className="score-grade">
                <h3 style={{ color: getScoreColor(safetyScore) }}>
                  {getScoreGrade(safetyScore)}
                </h3>
                <p>Overall Security Rating</p>
              </div>
            </div>

            <div className="historical-trend">
              <h3>Security Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalScores}>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={{ fill: '#007bff', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="risk-analysis">
            <h3>Risk Factor Analysis</h3>
            <div className="risk-grid">
              {riskFactors.map((factor, index) => (
                <div key={index} className="risk-card">
                  <div className="risk-header">
                    <span className="risk-name">{factor.name}</span>
                    <span className="risk-score" style={{ color: getScoreColor(factor.score) }}>
                      {factor.score}%
                    </span>
                  </div>
                  <div className="risk-bar">
                    <div
                      className="risk-bar-fill"
                      style={{
                        width: `${factor.score}%`,
                        backgroundColor: getScoreColor(factor.score)
                      }}
                    />
                  </div>
                  <div className="risk-weight">
                    Weight: {factor.weight}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations">
            <h3>AI-Generated Recommendations</h3>
            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-item priority-${rec.priority.toLowerCase()}`}>
                  <div className="recommendation-priority">
                    <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="recommendation-text">
                    {rec.text}
                  </div>
                  <button className="recommendation-action">
                    {rec.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-insights">
            <h3>AI Security Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🤖</div>
                <h4>Behavioral Pattern</h4>
                <p>Your usage pattern shows 98% consistency with usual behavior</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🛡️</div>
                <h4>Threat Detection</h4>
                <p>AI has detected 0 active threats in the last 24 hours</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📊</div>
                <h4>Risk Prediction</h4>
                <p>12% chance of security incident in next 30 days based on current metrics</p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .ai-safety-score {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .score-header {
          margin-bottom: 30px;
        }

        .score-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .score-header p {
          margin: 0;
          color: #666;
        }

        .score-container {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .current-score {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .score-grade h3 {
          margin: 20px 0 5px 0;
          font-size: 24px;
        }

        .score-grade p {
          margin: 0;
          color: #666;
        }

        .historical-trend {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .historical-trend h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .risk-analysis {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .risk-analysis h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .risk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .risk-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .risk-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .risk-name {
          font-weight: 500;
          color: #333;
        }

        .risk-score {
          font-weight: bold;
        }

        .risk-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .risk-bar-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .risk-weight {
          font-size: 12px;
          color: #666;
        }

        .recommendations {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .recommendations h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .recommendation-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        .recommendation-item:hover {
          transform: translateX(5px);
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .priority-badge.high {
          background: #dc3545;
          color: white;
        }

        .priority-badge.medium {
          background: #ffc107;
          color: #333;
        }

        .priority-badge.low {
          background: #28a745;
          color: white;
        }

        .recommendation-text {
          flex: 1;
          color: #333;
        }

        .recommendation-action {
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .recommendation-action:hover {
          background: #0056b3;
        }

        .ai-insights {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ai-insights h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .insight-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .insight-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .score-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AISafetyScore;
