import React, { useState, useEffect } from 'react';

const SafetyParkings = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParkingData();
    getUserLocation();
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

  const fetchParkingData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockParkingSpots = [
        {
          id: 1,
          name: 'Central Mall Parking',
          location: { lat: 28.6139, lng: 77.2090 },
          address: 'Downtown Shopping District',
          totalSpots: 200,
          availableSpots: 45,
          safetyRating: 4.8,
          lighting: 'excellent',
          surveillance: '24/7 CCTV',
          securityGuard: true,
          emergencyButton: true,
          price: '₹40/hour',
          features: ['Covered', 'EV Charging', 'Emergency Call Box']
        },
        {
          id: 2,
          name: 'Metro Station Parking',
          location: { lat: 28.6239, lng: 77.2190 },
          address: 'Metro Station Complex',
          totalSpots: 150,
          availableSpots: 12,
          safetyRating: 4.5,
          lighting: 'good',
          surveillance: 'CCTV',
          securityGuard: true,
          emergencyButton: true,
          price: '₹30/hour',
          features: ['Multi-level', 'Well-lit', 'Security Patrol']
        },
        {
          id: 3,
          name: 'City Hospital Parking',
          location: { lat: 28.6039, lng: 77.1990 },
          address: 'Hospital Campus',
          totalSpots: 80,
          availableSpots: 23,
          safetyRating: 4.9,
          lighting: 'excellent',
          surveillance: '24/7 CCTV',
          securityGuard: true,
          emergencyButton: true,
          price: '₹50/hour',
          features: ['Emergency Access', 'Ambulance Bay', 'Security Booth']
        }
      ];
      setParkingSpots(mockParkingSpots);
      setLoading(false);
    }, 1500);
  };

  const getSafetyIcon = (rating) => {
    if (rating >= 4.8) return '🟢 Excellent';
    if (rating >= 4.5) return '🟡 Good';
    return '🟠 Moderate';
  };

  const getLightingIcon = (level) => {
    switch(level) {
      case 'excellent': return '💡 Well-lit';
      case 'good': return '🔆 Adequate';
      default: return '🔅 Moderate';
    }
  };

  return (
    <div className="safety-parkings">
      <div className="monitor-header">
        <h2>Safety Parking</h2>
        <p>Find safe and secure parking spots near you</p>
      </div>

      {loading ? (
        <div className="loading">Finding safe parking spots...</div>
      ) : (
        <>
          <div className="parking-stats">
            <div className="stat-card">
              <div className="stat-value">{parkingSpots.length}</div>
              <div className="stat-label">Safe Parking Spots</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{parkingSpots.reduce((sum, p) => sum + p.availableSpots, 0)}</div>
              <div className="stat-label">Available Spots</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">4.7</div>
              <div className="stat-label">Avg Safety Rating</div>
            </div>
          </div>

          <div className="parking-grid">
            {parkingSpots.map(spot => (
              <div key={spot.id} className="parking-card" onClick={() => setSelectedSpot(spot)}>
                <div className="parking-header">
                  <div className="parking-name">{spot.name}</div>
                  <div className="safety-rating">⭐ {spot.safetyRating}</div>
                </div>
                <div className="parking-address">📍 {spot.address}</div>
                <div className="availability">
                  <div className="available-spots">🚗 {spot.availableSpots} spots available</div>
                  <div className="total-spots">of {spot.totalSpots} total</div>
                </div>
                <div className="safety-features">
                  <span className="feature-badge">{getSafetyIcon(spot.safetyRating)}</span>
                  <span className="feature-badge">{getLightingIcon(spot.lighting)}</span>
                  {spot.securityGuard && <span className="feature-badge">👮 Security Guard</span>}
                  {spot.emergencyButton && <span className="feature-badge">🆘 Emergency Button</span>}
                </div>
                <div className="parking-price">💰 {spot.price}</div>
                <button className="navigate-btn">Navigate →</button>
              </div>
            ))}
          </div>

          {selectedSpot && (
            <div className="modal-overlay" onClick={() => setSelectedSpot(null)}>
              <div className="parking-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedSpot(null)}>×</button>
                <h3>{selectedSpot.name}</h3>
                <div className="modal-details">
                  <div className="detail-row">
                    <strong>Address:</strong> {selectedSpot.address}
                  </div>
                  <div className="detail-row">
                    <strong>Availability:</strong> {selectedSpot.availableSpots} / {selectedSpot.totalSpots} spots
                  </div>
                  <div className="detail-row">
                    <strong>Safety Rating:</strong> ⭐ {selectedSpot.safetyRating} - {getSafetyIcon(selectedSpot.safetyRating)}
                  </div>
                  <div className="detail-row">
                    <strong>Security Features:</strong>
                    <ul>
                      <li>📹 {selectedSpot.surveillance}</li>
                      <li>💡 {getLightingIcon(selectedSpot.lighting)}</li>
                      {selectedSpot.securityGuard && <li>👮 Security Guard on duty</li>}
                      {selectedSpot.emergencyButton && <li>🆘 Emergency call button</li>}
                    </ul>
                  </div>
                  <div className="detail-row">
                    <strong>Features:</strong>
                    <div className="features-list">
                      {selectedSpot.features.map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-row">
                    <strong>Price:</strong> {selectedSpot.price}
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="reserve-btn">Reserve Spot</button>
                  <button className="navigate-btn">Get Directions</button>
                  <button className="report-btn">Report Issue</button>
                </div>
              </div>
            </div>
          )}

          <div className="safety-tips">
            <h3>Parking Safety Tips</h3>
            <div className="tips-grid">
              <div className="tip">🔒 Lock doors immediately after parking</div>
              <div className="tip">💡 Park in well-lit areas</div>
              <div className="tip">📱 Share location with trusted contact</div>
              <div className="tip">🚶 Walk confidently to your destination</div>
              <div className="tip">🆘 Keep emergency numbers handy</div>
              <div className="tip">🎥 Park near surveillance cameras when possible</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .safety-parkings {
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

        .parking-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #28a745;
        }

        .parking-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .parking-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .parking-card:hover {
          transform: translateY(-2px);
        }

        .parking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .parking-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .safety-rating {
          color: #ffc107;
          font-weight: bold;
        }

        .parking-address {
          color: #666;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .availability {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
        }

        .available-spots {
          color: #28a745;
          font-weight: bold;
        }

        .total-spots {
          color: #999;
        }

        .safety-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .feature-badge {
          padding: 4px 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 11px;
          color: #666;
        }

        .parking-price {
          color: #007bff;
          margin-bottom: 15px;
        }

        .navigate-btn {
          width: 100%;
          padding: 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
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

        .parking-modal {
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

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }

        .feature-tag {
          padding: 4px 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .reserve-btn, .report-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .reserve-btn {
          background: #28a745;
          color: white;
        }

        .report-btn {
          background: #dc3545;
          color: white;
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

        .tip {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default SafetyParkings;
