import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CrimeMonitors = () => {
  const [crimeStats, setCrimeStats] = useState({
    total: 0,
    violent: 0,
    property: 0,
    cyber: 0
  });
  const [hotspots, setHotspots] = useState([]);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchCrimeData();
    const interval = setInterval(fetchCrimeData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchCrimeData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockStats = {
        total: 342,
        violent: 87,
        property: 198,
        cyber: 57
      };

      const mockHotspots = [
        { area: 'Downtown', risk: 85, incidents: 23 },
        { area: 'Shopping District', risk: 72, incidents: 18 },
        { area: 'Railway Station', risk: 68, incidents: 15 },
        { area: 'University Area', risk: 45, incidents: 9 },
        { area: 'Residential North', risk: 32, incidents: 6 }
      ];

      const mockTrends = [
        { day: 'Mon', crimes: 42, arrests: 28 },
        { day: 'Tue', crimes: 38, arrests: 25 },
        { day: 'Wed', crimes: 45, arrests: 31 },
        { day: 'Thu', crimes: 52, arrests: 35 },
        { day: 'Fri', crimes: 58, arrests: 42 },
        { day: 'Sat', crimes: 65, arrests: 48 },
        { day: 'Sun', crimes: 48, arrests: 32 }
      ];

      const mockAlerts = [
        { id: 1, type: 'High Risk', area: 'Downtown', message: 'Increased theft activity reported', time: '5 min ago' },
        { id: 2, type: 'Medium Risk', area: 'Shopping District', message: 'Suspicious vehicle spotted', time: '15 min ago' },
        { id: 3, type: 'Low Risk', area: 'Railway Station', message: 'Patrol recommended', time: '30 min ago' }
      ];

      setCrimeStats(mockStats);
      setHotspots(mockHotspots);
      setTrends(mockTrends);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (risk) => {
    if (risk >= 70) return '#dc3545';
    if (risk >= 50) return '#fd7e14';
    if (risk >= 30) return '#ffc107';
    return '#28a745';
  };

  return (
    <div className="crime-monitor">
      <div className="monitor-header">
        <h2>Crime Monitor</h2>
        <p>Real-time crime analytics and hotspot detection</p>
        <div className="timeframe-selector">
          <button className={timeframe === 'day' ? 'active' : ''} onClick={() => setTimeframe('day')}>Day</button>
          <button className={timeframe === 'week' ? 'active' : ''} onClick={() => setTimeframe('week')}>Week</button>
          <button className={timeframe === 'month' ? 'active' : ''} onClick={() => setTimeframe('month')}>Month</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Analyzing crime patterns...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{crimeStats.total}</div>
                <div className="stat-label">Total Incidents</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <div className="stat-value">{crimeStats.violent}</div>
                <div className="stat-label">Violent Crimes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-info">
                <div className="stat-value">{crimeStats.property}</div>
                <div className="stat-label">Property Crimes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💻</div>
              <div className="stat-info">
                <div className="stat-value">{crimeStats.cyber}</div>
                <div className="stat-label">Cyber Crimes</div>
              </div>
            </div>
          </div>

          <div className="trends-section">
            <h3>Crime Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="crimes" stroke="#dc3545" name="Reported Crimes" />
                <Line type="monotone" dataKey="arrests" stroke="#28a745" name="Arrests Made" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="hotspots-section">
            <h3>Crime Hotspots</h3>
            <div className="hotspots-list">
              {hotspots.map((spot, i) => (
                <div key={i} className="hotspot-card">
                  <div className="hotspot-info">
                    <div className="hotspot-area">{spot.area}</div>
                    <div className="hotspot-incidents">{spot.incidents} incidents</div>
                  </div>
                  <div className="hotspot-risk">
                    <div className="risk-bar">
                      <div className="risk-fill" style={{ width: `${spot.risk}%`, backgroundColor: getRiskColor(spot.risk) }} />
                    </div>
                    <div className="risk-value" style={{ color: getRiskColor(spot.risk) }}>{spot.risk}% Risk</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alerts-section">
            <h3>Active Alerts</h3>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-card alert-${alert.type.toLowerCase().replace(' ', '-')}`}>
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-area">{alert.area}</div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="safety-tips">
            <h3>Safety Recommendations</h3>
            <div className="tips-grid">
              <div className="tip-card">🔒 Avoid poorly lit areas at night</div>
              <div className="tip-card">👥 Travel in groups in high-risk zones</div>
              <div className="tip-card">📱 Keep emergency contacts handy</div>
              <div className="tip-card">🚗 Park in well-lit, monitored areas</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .crime-monitor {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .monitor-header {
          margin-bottom: 30px;
        }

        .monitor-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .monitor-header p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .timeframe-selector {
          display: flex;
          gap: 10px;
        }

        .timeframe-selector button {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
        }

        .timeframe-selector button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #007bff;
        }

        .trends-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .trends-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .hotspots-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .hotspots-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .hotspots-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .hotspot-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .hotspot-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .hotspot-area {
          font-weight: bold;
          color: #333;
        }

        .hotspot-incidents {
          color: #666;
        }

        .risk-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .risk-fill {
          height: 100%;
        }

        .risk-value {
          font-size: 12px;
          font-weight: 500;
        }

        .alerts-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .alerts-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .alert-card {
          display: flex;
          gap: 12px;
          padding: 15px;
          border-radius: 8px;
        }

        .alert-high-risk {
          background: #f8d7da;
          border-left: 3px solid #dc3545;
        }

        .alert-medium-risk {
          background: #fff3cd;
          border-left: 3px solid #ffc107;
        }

        .alert-low-risk {
          background: #d4edda;
          border-left: 3px solid #28a745;
        }

        .alert-icon {
          font-size: 20px;
        }

        .alert-area {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .alert-message {
          font-size: 13px;
          margin-bottom: 4px;
        }

        .alert-time {
          font-size: 11px;
          color: #999;
        }

        .safety-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .safety-tips h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .tip-card {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CrimeMonitors;
