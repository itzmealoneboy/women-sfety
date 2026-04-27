import React, { useState, useEffect } from 'react';

const WomenOnlyTransports = () => {
  const [transportOptions, setTransportOptions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocation();
    fetchTransportData();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchTransportData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockTransport = [
        {
          id: 1,
          type: 'Women Only Metro',
          route: 'Line 1 - Central to North',
          timing: '6:00 AM - 10:00 PM',
          stops: ['Central Station', 'Downtown', 'North End'],
          safetyFeatures: ['CCTV', 'Female Staff', 'Emergency Button'],
          rating: 4.8,
          frequency: '5 mins'
        },
        {
          id: 2,
          type: 'Women Only Bus',
          route: 'Route 42 - East to West',
          timing: '7:00 AM - 9:00 PM',
          stops: ['East Mall', 'City Center', 'West Complex'],
          safetyFeatures: ['GPS Tracking', 'Female Driver', 'Panic Button'],
          rating: 4.6,
          frequency: '15 mins'
        },
        {
          id: 3,
          type: 'Women Only Auto',
          service: 'Pink Auto Service',
          timing: '24/7',
          areas: ['All Major Areas'],
          safetyFeatures: ['GPS Tracking', 'Emergency Contact', 'Share Trip'],
          rating: 4.7,
          availability: 'On-demand'
        }
      ];
      setTransportOptions(mockTransport);
      setLoading(false);
    }, 1500);
  };

  const requestRide = (transport) => {
    alert(`Request sent for ${transport.type}. You will receive confirmation shortly.`);
  };

  return (
    <div className="women-only-transports">
      <div className="monitor-header">
        <h2>Women-Only Transport</h2>
        <p>Safe and secure transportation options for women</p>
        <div className="emergency-banner">
          <span className="emergency-icon">🚨</span>
          <span>Emergency Helpline: 181 (Women's Helpline)</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Finding safe transport options...</div>
      ) : (
        <>
          <div className="transport-grid">
            {transportOptions.map(transport => (
              <div key={transport.id} className="transport-card" onClick={() => setSelectedTransport(transport)}>
                <div className="transport-type">{transport.type}</div>
                <div className="transport-route">{transport.route || transport.service}</div>
                <div className="transport-timing">⏰ {transport.timing}</div>
                <div className="transport-rating">⭐ {transport.rating}</div>
                <div className="safety-badges">
                  {transport.safetyFeatures.slice(0, 3).map((feature, i) => (
                    <span key={i} className="safety-badge">✓ {feature}</span>
                  ))}
                </div>
                <button className="request-btn" onClick={(e) => { e.stopPropagation(); requestRide(transport); }}>
                  Request Ride
                </button>
              </div>
            ))}
          </div>

          <div className="safety-features-section">
            <h3>Safety Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📹</div>
                <h4>24/7 CCTV Surveillance</h4>
                <p>Continuous monitoring for your safety</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👮</div>
                <h4>Trained Female Staff</h4>
                <p>All staff members are trained in safety protocols</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🆘</div>
                <h4>Emergency Buttons</h4>
                <p>Instant alert system in all vehicles</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📍</div>
                <h4>GPS Tracking</h4>
                <p>Real-time location sharing with trusted contacts</p>
              </div>
            </div>
          </div>

          <div className="tips-section">
            <h3>Safety Tips</h3>
            <div className="tips-list">
              <div className="tip">📱 Share your trip details with family/friends</div>
              <div className="tip">🚨 Know the emergency numbers and button locations</div>
              <div className="tip">👀 Stay aware of your surroundings</div>
              <div className="tip">💺 Sit near the driver or in well-lit areas</div>
              <div className="tip">📞 Save emergency contacts on speed dial</div>
            </div>
          </div>

          {selectedTransport && (
            <div className="modal-overlay" onClick={() => setSelectedTransport(null)}>
              <div className="transport-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedTransport(null)}>×</button>
                <h3>{selectedTransport.type}</h3>
                <div className="modal-details">
                  <div className="detail-row">
                    <strong>Route/Service:</strong> {selectedTransport.route || selectedTransport.service}
                  </div>
                  <div className="detail-row">
                    <strong>Timing:</strong> {selectedTransport.timing}
                  </div>
                  <div className="detail-row">
                    <strong>Frequency/Availability:</strong> {selectedTransport.frequency || selectedTransport.availability}
                  </div>
                  <div className="detail-row">
                    <strong>Stops/Areas:</strong> {selectedTransport.stops ? selectedTransport.stops.join(', ') : selectedTransport.areas}
                  </div>
                  <div className="detail-row">
                    <strong>Safety Features:</strong>
                    <ul>
                      {selectedTransport.safetyFeatures.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-row">
                    <strong>Rating:</strong> ⭐ {selectedTransport.rating}/5
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="request-ride-btn">Request Ride</button>
                  <button className="share-trip-btn">Share Trip Details</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .women-only-transports {
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

        .emergency-banner {
          background: #f8d7da;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #721c24;
        }

        .emergency-icon {
          font-size: 20px;
        }

        .transport-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .transport-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .transport-card:hover {
          transform: translateY(-2px);
        }

        .transport-type {
          font-size: 20px;
          font-weight: bold;
          color: #d63384;
          margin-bottom: 10px;
        }

        .transport-route {
          color: #666;
          margin-bottom: 8px;
        }

        .transport-timing {
          color: #28a745;
          margin-bottom: 8px;
        }

        .transport-rating {
          color: #ffc107;
          margin-bottom: 10px;
        }

        .safety-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .safety-badge {
          padding: 4px 8px;
          background: #e7f3ff;
          border-radius: 4px;
          font-size: 11px;
          color: #007bff;
        }

        .request-btn {
          width: 100%;
          padding: 8px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .safety-features-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .safety-features-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .feature-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .feature-card h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .feature-card p {
          margin: 0;
          color: #666;
          font-size: 12px;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .tip {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .transport-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-close {
          float: right;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .detail-row {
          margin-bottom: 15px;
        }

        .detail-row ul {
          margin: 5px 0 0 20px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .request-ride-btn, .share-trip-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .request-ride-btn {
          background: #28a745;
          color: white;
        }

        .share-trip-btn {
          background: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default WomenOnlyTransports;
