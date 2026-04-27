import React, { useState, useEffect } from 'react';

const CrowdDensity = () => {
  const [locations, setLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState('list');

  useEffect(() => {
    fetchCrowdData();
    const interval = setInterval(fetchCrowdData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCrowdData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockLocations = [
        { id: 1, name: 'Central Station', density: 85, capacity: 1000, current: 850, trend: 'increasing', status: 'critical' },
        { id: 2, name: 'Shopping Mall', density: 72, capacity: 5000, current: 3600, trend: 'stable', status: 'high' },
        { id: 3, name: 'City Park', density: 45, capacity: 2000, current: 900, trend: 'decreasing', status: 'moderate' },
        { id: 4, name: 'Convention Center', density: 92, capacity: 800, current: 736, trend: 'increasing', status: 'critical' },
        { id: 5, name: 'Metro Station', density: 38, capacity: 600, current: 228, trend: 'stable', status: 'low' }
      ];

      const mockAlerts = [
        { id: 1, location: 'Central Station', message: 'Extremely crowded. Avoid if possible.', severity: 'critical' },
        { id: 2, location: 'Convention Center', message: 'Venue at capacity. Entry restricted.', severity: 'critical' },
        { id: 3, location: 'Shopping Mall', message: 'High foot traffic. Expect delays.', severity: 'warning' }
      ];

      setLocations(mockLocations);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  };

  const getDensityColor = (density) => {
    if (density >= 80) return '#dc3545';
    if (density >= 60) return '#fd7e14';
    if (density >= 40) return '#ffc107';
    return '#28a745';
  };

  const getStatusText = (density) => {
    if (density >= 80) return 'Critical - Avoid';
    if (density >= 60) return 'High - Caution';
    if (density >= 40) return 'Moderate';
    return 'Low - Safe';
  };

  return (
    <div className="crowd-density">
      <div className="monitor-header">
        <h2>Crowd Density Monitor</h2>
        <p>Real-time crowd density analytics for public spaces</p>
        <div className="view-toggle">
          <button className={mapView === 'list' ? 'active' : ''} onClick={() => setMapView('list')}>List View</button>
          <button className={mapView === 'map' ? 'active' : ''} onClick={() => setMapView('map')}>Map View</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Analyzing crowd density...</div>
      ) : (
        <>
          {alerts.length > 0 && (
            <div className="alerts-banner">
              <div className="alert-icon">🚨</div>
              <div className="alert-content">
                <h3>Crowd Alerts</h3>
                {alerts.map(alert => (
                  <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                    <strong>{alert.location}:</strong> {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mapView === 'list' ? (
            <div className="locations-grid">
              {locations.map(location => (
                <div key={location.id} className="location-card">
                  <div className="location-header">
                    <div className="location-name">{location.name}</div>
                    <div className="location-status" style={{ backgroundColor: getDensityColor(location.density) }}>
                      {getStatusText(location.density)}
                    </div>
                  </div>
                  <div className="density-meter">
                    <div className="density-bar">
                      <div className="density-fill" style={{ width: `${location.density}%`, backgroundColor: getDensityColor(location.density) }} />
                    </div>
                    <div className="density-value">{location.density}% Capacity</div>
                  </div>
                  <div className="location-stats">
                    <div>👥 {location.current} / {location.capacity}</div>
                    <div className={`trend-${location.trend}`}>
                      {location.trend === 'increasing' ? '↑ Increasing' : location.trend === 'decreasing' ? '↓ Decreasing' : '→ Stable'}
                    </div>
                  </div>
                  <div className="recommendation">
                    {location.density >= 80 ? '⚠️ Avoid this area if possible' :
                     location.density >= 60 ? '⚠️ Expect delays and crowds' :
                     location.density >= 40 ? '✓ Moderate crowds' :
                     '✓ Low crowds - Good time to visit'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <div className="map-text">Interactive map view would display here</div>
              <div className="map-note">Showing real-time crowd density heatmap</div>
            </div>
          )}

          <div className="recommendations-section">
            <h3>AI Recommendations</h3>
            <div className="rec-grid">
              <div className="rec-card">
                <div className="rec-icon">🚶</div>
                <h4>Best Time to Visit</h4>
                <p>Early morning (6-9 AM) and late evening (8-10 PM) have lowest crowd density</p>
              </div>
              <div className="rec-card">
                <div className="rec-icon">⚠️</div>
                <h4>Avoid Peak Hours</h4>
                <p>Peak crowd times: 12 PM - 3 PM and 5 PM - 7 PM</p>
              </div>
              <div className="rec-card">
                <div className="rec-icon">🚇</div>
                <h4>Alternative Routes</h4>
                <p>Consider using metro stations with lower crowd density for commute</p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .crowd-density {
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

        .view-toggle {
          display: flex;
          gap: 10px;
        }

        .view-toggle button {
          padding: 8px 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
        }

        .view-toggle button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .alerts-banner {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .alert-icon {
          font-size: 32px;
        }

        .alert-content h3 {
          margin: 0 0 10px 0;
          color: #721c24;
        }

        .alert-item {
          margin-bottom: 5px;
          color: #721c24;
        }

        .alert-critical {
          font-weight: bold;
        }

        .locations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .location-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .location-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .location-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .location-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .density-meter {
          margin-bottom: 15px;
        }

        .density-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .density-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .density-value {
          font-size: 14px;
          color: #666;
        }

        .location-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .trend-increasing {
          color: #dc3545;
        }

        .trend-decreasing {
          color: #28a745;
        }

        .trend-stable {
          color: #ffc107;
        }

        .recommendation {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 13px;
          color: #666;
        }

        .map-placeholder {
          background: white;
          padding: 60px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .map-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .map-text {
          font-size: 18px;
          color: #666;
          margin-bottom: 10px;
        }

        .map-note {
          font-size: 12px;
          color: #999;
        }

        .recommendations-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .recommendations-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .rec-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .rec-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .rec-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .rec-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default CrowdDensity;
