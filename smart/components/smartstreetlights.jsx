import React, { useState, useEffect } from 'react';

const SmartStreetLights = () => {
  const [lights, setLights] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    energySaved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLightsData();
    const interval = setInterval(fetchLightsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLightsData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockLights = [
        { id: 1, location: 'Main Street', status: 'active', brightness: 85, energy: 120, lastMaintenance: '2024-01-10' },
        { id: 2, location: 'Park Avenue', status: 'active', brightness: 90, energy: 135, lastMaintenance: '2024-01-05' },
        { id: 3, location: 'Downtown', status: 'maintenance', brightness: 0, energy: 0, lastMaintenance: '2024-01-15' },
        { id: 4, location: 'Residential Area', status: 'active', brightness: 70, energy: 105, lastMaintenance: '2024-01-08' },
        { id: 5, location: 'Industrial Zone', status: 'active', brightness: 95, energy: 150, lastMaintenance: '2024-01-12' }
      ];

      const mockStats = {
        total: 150,
        active: 142,
        maintenance: 8,
        energySaved: 2340
      };

      setLights(mockLights);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#28a745';
      case 'maintenance': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <div className="smart-streetlights">
      <div className="monitor-header">
        <h2>Smart Street Lights</h2>
        <p>Intelligent lighting system with real-time monitoring</p>
      </div>

      {loading ? (
        <div className="loading">Loading lighting data...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Lights</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Active Lights</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔧</div>
              <div className="stat-info">
                <div className="stat-value">{stats.maintenance}</div>
                <div className="stat-label">Needs Maintenance</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-value">{stats.energySaved} kWh</div>
                <div className="stat-label">Energy Saved</div>
              </div>
            </div>
          </div>

          <div className="lights-list">
            <h3>Street Light Status</h3>
            {lights.map(light => (
              <div key={light.id} className="light-card">
                <div className="light-icon">💡</div>
                <div className="light-info">
                  <div className="light-location">{light.location}</div>
                  <div className="light-details">
                    <span>Brightness: {light.brightness}%</span>
                    <span>Energy: {light.energy} kWh</span>
                    <span>Last Maintenance: {light.lastMaintenance}</span>
                  </div>
                </div>
                <div className="light-status" style={{ backgroundColor: getStatusColor(light.status) }}>
                  {light.status}
                </div>
              </div>
            ))}
          </div>

          <div className="features-section">
            <h3>Smart Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🌙</div>
                <h4>Motion Detection</h4>
                <p>Lights brighten when movement detected, saving energy when area is empty</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Real-time Monitoring</h4>
                <p>Instant alerts for malfunctions and maintenance needs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Energy Optimization</h4>
                <p>Adaptive brightness based on natural light and traffic patterns</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h4>Safety Enhancement</h4>
                <p>Improved visibility in high-traffic and high-risk areas</p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .smart-streetlights {
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
          margin: 0;
          color: #666;
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

        .lights-list {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .lights-list h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .light-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .light-icon {
          font-size: 32px;
        }

        .light-info {
          flex: 1;
        }

        .light-location {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .light-details {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #666;
        }

        .light-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .features-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .features-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .feature-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .feature-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .feature-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default SmartStreetlights;
