import React, { useState, useEffect } from 'react';

const DeviceVerifications = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      // Simulate API call
      const mockDevices = [
        {
          id: 1,
          name: 'Chrome on Windows',
          type: 'browser',
          lastActive: new Date(2024, 0, 15, 10, 30),
          verified: true,
          location: 'New York, USA',
          ip: '192.168.1.1'
        },
        {
          id: 2,
          name: 'Safari on iPhone',
          type: 'mobile',
          lastActive: new Date(2024, 0, 14, 18, 20),
          verified: true,
          location: 'New York, USA',
          ip: '192.168.1.2'
        },
        {
          id: 3,
          name: 'Firefox on Mac',
          type: 'browser',
          lastActive: new Date(2024, 0, 13, 9, 15),
          verified: false,
          location: 'Unknown',
          ip: '203.0.113.5'
        }
      ];
      setDevices(mockDevices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setLoading(false);
    }
  };

  const verifyDevice = async (deviceId) => {
    try {
      // Simulate device verification
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { ...device, verified: true }
          : device
      ));
      setShowVerificationModal(false);
    } catch (error) {
      console.error('Error verifying device:', error);
    }
  };

  const removeDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to remove this device?')) {
      try {
        setDevices(devices.filter(device => device.id !== deviceId));
      } catch (error) {
        console.error('Error removing device:', error);
      }
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'browser': return '💻';
      case 'mobile': return '📱';
      case 'tablet': return '📲';
      default: return '🖥️';
    }
  };

  return (
    <div className="device-verifications">
      <div className="device-header">
        <h2>Device Management</h2>
        <p>Manage and verify devices that have access to your account</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading devices...</div>
      ) : (
        <div className="devices-list">
          {devices.map(device => (
            <div key={device.id} className={`device-card ${!device.verified ? 'unverified' : ''}`}>
              <div className="device-icon">
                {getDeviceIcon(device.type)}
              </div>
              <div className="device-info">
                <div className="device-name">
                  {device.name}
                  {!device.verified && (
                    <span className="unverified-badge">Unverified</span>
                  )}
                </div>
                <div className="device-details">
                  <span>📍 {device.location}</span>
                  <span>🔌 {device.ip}</span>
                  <span>🕒 Last active: {device.lastActive.toLocaleString()}</span>
                </div>
              </div>
              <div className="device-actions">
                {!device.verified ? (
                  <button 
                    onClick={() => {
                      setSelectedDevice(device);
                      setShowVerificationModal(true);
                    }}
                    className="btn-verify"
                  >
                    Verify
                  </button>
                ) : (
                  <button 
                    onClick={() => removeDevice(device.id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showVerificationModal && selectedDevice && (
        <div className="modal-overlay">
          <div className="verification-modal">
            <h3>Verify Device</h3>
            <p>Are you trying to log in from {selectedDevice.name}?</p>
            <p>Location: {selectedDevice.location}</p>
            <p>IP: {selectedDevice.ip}</p>
            <div className="modal-actions">
              <button onClick={() => verifyDevice(selectedDevice.id)} className="btn-verify">
                Yes, Verify Device
              </button>
              <button onClick={() => setShowVerificationModal(false)} className="btn-cancel">
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .device-verifications {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .device-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .device-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .device-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .device-card {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .device-card.unverified {
          background-color: #fff9e6;
          border-color: #ffd700;
        }

        .device-icon {
          font-size: 32px;
          margin-right: 15px;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .unverified-badge {
          background: #ffd700;
          color: #333;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 10px;
        }

        .device-details {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #666;
        }

        .device-actions {
          margin-left: 15px;
        }

        .btn-verify {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-verify:hover {
          background: #218838;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #c82333;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 10px;
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

        .verification-modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default DeviceVerifications;
