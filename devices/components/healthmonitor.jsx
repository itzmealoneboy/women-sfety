import React, { useState, useEffect } from 'react';

const HealthMonitor = () => {
  const [healthData, setHealthData] = useState({
    heartRate: [],
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenLevel: 98,
    temperature: 36.6,
    respiratoryRate: 16
  });
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState({});
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    generateHistoricalData();
    const interval = setInterval(simulateDataUpdate, 10000);
    return () => clearInterval(interval);
  }, []);

  const generateHistoricalData = () => {
    const mockHistory = [];
    for (let i = 30; i >= 0; i--) {
      mockHistory.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        heartRate: Math.floor(Math.random() * 30) + 65,
        systolic: Math.floor(Math.random() * 30) + 110,
        diastolic: Math.floor(Math.random() * 20) + 70,
        oxygen: Math.floor(Math.random() * 5) + 95,
        steps: Math.floor(Math.random() * 5000) + 3000
      });
    }
    setHistory(mockHistory);
    calculateTrends(mockHistory);
  };

  const simulateDataUpdate = () => {
    const newHeartRate = Math.floor(Math.random() * 30) + 65;
    setHealthData(prev => ({
      ...prev,
      heartRate: [...prev.heartRate.slice(-20), newHeartRate],
      bloodPressure: {
        systolic: Math.floor(Math.random() * 20) + 110,
        diastolic: Math.floor(Math.random() * 15) + 70
      },
      oxygenLevel: Math.floor(Math.random() * 5) + 95,
      temperature: 36 + Math.random() * 1.5,
      respiratoryRate: Math.floor(Math.random() * 8) + 12
    }));
    
    // Update health score
    const newScore = calculateHealthScore(healthData);
    setHealthScore(newScore);
  };

  const calculateHealthScore = (data) => {
    let score = 100;
    if (data.heartRate > 100 || data.heartRate < 60) score -= 15;
    if (data.bloodPressure.systolic > 140 || data.bloodPressure.systolic < 90) score -= 15;
    if (data.oxygenLevel < 95) score -= 10;
    if (data.temperature > 37.5 || data.temperature < 36) score -= 10;
    return Math.max(0, score);
  };

  const calculateTrends = (data) => {
    const recent = data.slice(-7);
    const avgHeartRate = recent.reduce((sum, d) => sum + d.heartRate, 0) / recent.length;
    const avgSteps = recent.reduce((sum, d) => sum + d.steps, 0) / recent.length;
    setTrends({ avgHeartRate, avgSteps });
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="health-monitor">
      <div className="monitor-header">
        <h3>Health Monitor</h3>
        <div className="health-score" style={{ backgroundColor: getHealthScoreColor(healthScore) }}>
          Health Score: {healthScore}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-info">
            <div className="metric-value">{healthData.heartRate[healthData.heartRate.length - 1] || '--'}</div>
            <div className="metric-label">Heart Rate (bpm)</div>
            <div className="metric-status">Normal: 60-100</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💊</div>
          <div className="metric-info">
            <div className="metric-value">{healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}</div>
            <div className="metric-label">Blood Pressure</div>
            <div className="metric-status">Ideal: 120/80</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🫁</div>
          <div className="metric-info">
            <div className="metric-value">{healthData.oxygenLevel}%</div>
            <div className="metric-label">Oxygen Level</div>
            <div className="metric-status">Normal: >95%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌡️</div>
          <div className="metric-info">
            <div className="metric-value">{healthData.temperature}°C</div>
            <div className="metric-label">Temperature</div>
            <div className="metric-status">Normal: 36.1-37.2°C</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌬️</div>
          <div className="metric-info">
            <div className="metric-value">{healthData.respiratoryRate}</div>
            <div className="metric-label">Respiratory Rate</div>
            <div className="metric-status">Normal: 12-20</div>
          </div>
        </div>
      </div>

      <div className="trends-section">
        <h4>7-Day Trends</h4>
        <div className="trends-grid">
          <div className="trend-item">
            <span className="trend-label">Avg Heart Rate:</span>
            <span className="trend-value">{Math.round(trends.avgHeartRate)} bpm</span>
          </div>
          <div className="trend-item">
            <span className="trend-label">Avg Steps:</span>
            <span className="trend-value">{Math.round(trends.avgSteps).toLocaleString()}</span>
          </div>
          <div className="trend-item">
            <span className="trend-label">Trend:</span>
            <span className="trend-value">
              {trends.avgHeartRate > 75 ? '↑ Slightly Elevated' : '→ Stable'}
            </span>
          </div>
        </div>
      </div>

      <div className="recommendations">
        <h4>Health Recommendations</h4>
        <ul>
          {healthData.heartRate > 100 && <li>⚡ Heart rate elevated. Try deep breathing exercises.</li>}
          {healthData.bloodPressure.systolic > 130 && <li>💊 Blood pressure elevated. Reduce salt intake.</li>}
          {healthData.oxygenLevel < 95 && <li>🫁 Low oxygen levels. Practice deep breathing.</li>}
          {healthData.temperature > 37.2 && <li>🌡️ Mild fever detected. Stay hydrated.</li>}
          {!healthData.heartRate > 100 && !healthData.bloodPressure.systolic > 130 && !healthData.oxygenLevel < 95 && 
            <li>✓ All vitals normal. Maintain healthy lifestyle.</li>
          }
        </ul>
      </div>

      <style jsx>{`
        .health-monitor {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .monitor-header h3 {
          margin: 0;
          color: #333;
        }

        .health-score {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .metric-icon {
          font-size: 32px;
        }

        .metric-info {
          flex: 1;
        }

        .metric-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .metric-label {
          font-size: 12px;
          color: #666;
        }

        .metric-status {
          font-size: 10px;
          color: #999;
          margin-top: 4px;
        }

        .trends-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .trends-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .trends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }

        .trend-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .trend-label {
          color: #666;
        }

        .trend-value {
          font-weight: 500;
          color: #333;
        }

        .recommendations {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
        }

        .recommendations h4 {
          margin: 0 0 10px 0;
          color: #007bff;
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
      `}</style>
    </div>
  );
};

export default HealthMonitor;
