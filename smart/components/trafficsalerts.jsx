import React, { useState, useEffect } from 'react';

const TrafficAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState('');

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrafficData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockAlerts = [
        { id: 1, type: 'accident', location: 'Highway 101', severity: 'high', message: 'Accident reported, heavy delays expected', time: '5 min ago' },
        { id: 2, type: 'congestion', location: 'Downtown', severity: 'medium', message: 'Heavy traffic in central area', time: '10 min ago' },
        { id: 3, type: 'roadwork', location: 'Main Street', severity: 'low', message: 'Road construction ahead, lane closed', time: '15 min ago' }
      ];

      const mockTraffic = [
        { road: 'Highway 101', speed: 25, congestion: 'heavy', travelTime: 45 },
        { road: 'Downtown Expressway', speed: 45, congestion: 'moderate', travelTime: 25 },
        { road: 'Ring Road', speed: 60, congestion: 'light', travelTime: 15 }
      ];

      setAlerts(mockAlerts);
      setTrafficData(mockTraffic);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getCongestionColor = (congestion) => {
    switch(congestion) {
      case 'heavy': return '#dc3545';
      case 'moderate': return '#ffc107';
      default: return '#28a745';
    }
  };

  return (
    <div className="traffic-alerts">
      <div className="monitor-header">
        <h2>Traffic Alerts</h2>
        <p>Real-time traffic conditions and incident reports</p>
        <div className="route-input">
          <input
            type="text"
            placeholder="Enter your route for personalized alerts..."
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />
          <button>Get Alerts</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Fetching traffic data...</div>
      ) : (
        <>
          <div className="alerts-section">
            <h3>Active Alerts</h3>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className="alert-card" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
                  <div className="alert-type">
                    {alert.type === 'accident' ? '🚗 Accident' : alert.type === 'congestion' ? '🚦 Congestion' : '🚧 Roadwork'}
                  </div>
                  <div className="alert-location">{alert.location}</div>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="traffic-conditions">
            <h3>Current Traffic Conditions</h3>
            {trafficData.map((item, i) => (
              <div key={i} className="traffic-card">
                <div className="traffic-road">{item.road}</div>
                <div className="traffic-stats">
                  <span>Speed: {item.speed} km/h</span>
                  <span style={{ color: getCongestionColor(item.congestion) }}>
                    {item.congestion.toUpperCase()} Traffic
                  </span>
                  <span>Travel Time: {item.travelTime} min</span>
                </div>
                <div className="traffic-bar">
                  <div className="traffic-fill" style={{ width: `${(item.speed / 80) * 100}%`, backgroundColor: getCongestionColor(item.congestion) }} />
                </div>
              </div>
            ))}
          </div>

          <div className="alternative-routes">
            <h3>Alternative Routes</h3>
            <div className="routes-list">
              <div className="route-card">
                <div className="route-name">Via Service Road</div>
                <div className="route-time">+5 min</div>
                <div className="route-condition">Light traffic</div>
              </div>
              <div className="route-card">
                <div className="route-name">Via Expressway</div>
                <div className="route-time">+8 min</div>
                <div className="route-condition">Moderate traffic</div>
              </div>
            </div>
          </div>

          <div className="tips-section">
            <h3>Travel Tips</h3>
            <div className="tips-list">
              <div className="tip">🕐 Peak hours: 8-10 AM, 5-7 PM - Expect delays</div>
              <div className="tip">🚗 Consider public transport during heavy congestion</div>
              <div className="tip">📱 Use navigation apps for real-time rerouting</div>
              <div className="tip">⚠️ Stay updated on road closures and events</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .traffic-alerts {
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

        .route-input {
          display: flex;
          gap: 10px;
        }

        .route-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .route-input button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
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
          gap: 15px;
        }

        .alert-card {
          padding: 15px;
          border-left: 4px solid;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .alert-type {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .alert-location {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .alert-message {
          font-size: 13px;
          margin-bottom: 5px;
        }

        .alert-time {
          font-size: 11px;
          color: #999;
        }

        .traffic-conditions {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .traffic-conditions h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .traffic-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .traffic-road {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .traffic-stats {
          display: flex;
          gap: 15px;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .traffic-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .traffic-fill {
          height: 100%;
        }

        .alternative-routes {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .alternative-routes h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .routes-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .route-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .route-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .route-time {
          color: #28a745;
          margin-bottom: 5px;
        }

        .route-condition {
          font-size: 12px;
          color: #666;
        }

        .tips-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .tips-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tip {
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default TrafficAlerts;
