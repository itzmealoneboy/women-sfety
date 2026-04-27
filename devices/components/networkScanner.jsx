import React, { useState } from 'react';

const NetworkScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState({
    ssid: 'Home Network',
    signalStrength: 85,
    securityType: 'WPA2-PSK',
    connectedDevices: 0
  });

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    setScanProgress(0);
    
    // Simulate network scan
    const mockDevices = [
      { id: 1, name: 'Laptop', ip: '192.168.1.101', mac: 'AA:BB:CC:DD:EE:FF', type: 'computer', manufacturer: 'Dell', signal: 92 },
      { id: 2, name: 'Smartphone', ip: '192.168.1.102', mac: '11:22:33:44:55:66', type: 'phone', manufacturer: 'Samsung', signal: 88 },
      { id: 3, name: 'Smart TV', ip: '192.168.1.105', mac: '77:88:99:AA:BB:CC', type: 'tv', manufacturer: 'LG', signal: 75 },
      { id: 4, name: 'Unknown Device', ip: '192.168.1.110', mac: 'FF:EE:DD:CC:BB:AA', type: 'unknown', manufacturer: 'Unknown', signal: 45, suspicious: true }
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < mockDevices.length) {
        setDevices(prev => [...prev, mockDevices[step]]);
        setScanProgress((step + 1) / mockDevices.length * 100);
        step++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setNetworkInfo(prev => ({ ...prev, connectedDevices: mockDevices.length }));
      }
    }, 1000);
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'computer': return '💻';
      case 'phone': return '📱';
      case 'tv': return '📺';
      default: return '❓';
    }
  };

  return (
    <div className="network-scanner">
      <div className="scanner-header">
        <h3>Network Scanner</h3>
        <p>Detect and monitor devices on your network</p>
      </div>

      <div className="network-info">
        <div className="info-card">
          <div className="info-icon">📡</div>
          <div className="info-details">
            <div className="info-label">Network</div>
            <div className="info-value">{networkInfo.ssid}</div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📶</div>
          <div className="info-details">
            <div className="info-label">Signal Strength</div>
            <div className="info-value">{networkInfo.signalStrength}%</div>
            <div className="signal-bar">
              <div className="signal-fill" style={{ width: `${networkInfo.signalStrength}%` }} />
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">🔒</div>
          <div className="info-details">
            <div className="info-label">Security</div>
            <div className="info-value">{networkInfo.securityType}</div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📱</div>
          <div className="info-details">
            <div className="info-label">Connected Devices</div>
            <div className="info-value">{networkInfo.connectedDevices}</div>
          </div>
        </div>
      </div>

      <div className="scan-controls">
        <button onClick={startScan} disabled={isScanning} className="scan-btn">
          {isScanning ? 'Scanning...' : 'Start Network Scan'}
        </button>
        {isScanning && (
          <div className="scan-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="progress-text">{Math.round(scanProgress)}%</div>
          </div>
        )}
      </div>

      {devices.length > 0 && (
        <div className="devices-list">
          <h4>Detected Devices ({devices.length})</h4>
          <div className="device-grid">
            {devices.map(device => (
              <div key={device.id} className={`device-card ${device.suspicious ? 'suspicious' : ''}`}>
                <div className="device-icon">{getDeviceIcon(device.type)}</div>
                <div className="device-info">
                  <div className="device-name">{device.name}</div>
                  <div className="device-ip">IP: {device.ip}</div>
                  <div className="device-mac">MAC: {device.mac}</div>
                  <div className="device-manufacturer">{device.manufacturer}</div>
                  <div className="device-signal">Signal: {device.signal}%</div>
                </div>
                {device.suspicious && (
                  <div className="suspicious-badge">
                    ⚠️ Unknown Device
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="security-tips">
        <h4>Network Security Tips</h4>
        <ul>
          <li>✓ Change default router password</li>
          <li>✓ Enable WPA3 encryption if available</li>
          <li>✓ Disable WPS feature</li>
          <li>✓ Regularly check connected devices</li>
          <li>✓ Update router firmware regularly</li>
        </ul>
      </div>

      <style jsx>{`
        .network-scanner {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .scanner-header {
          margin-bottom: 20px;
        }

        .scanner-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .scanner-header p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .network-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-icon {
          font-size: 28px;
        }

        .info-details {
          flex: 1;
        }

        .info-label {
          font-size: 11px;
          color: #666;
        }

        .info-value {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .signal-bar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 5px;
        }

        .signal-fill {
          height: 100%;
          background: #28a745;
        }

        .scan-controls {
          margin-bottom: 20px;
        }

        .scan-btn {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .scan-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .scan-progress {
          margin-top: 10px;
        }

        .progress-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .devices-list h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .device-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .device-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          position: relative;
        }

        .device-card.suspicious {
          background: #fff3cd;
          border-left: 3px solid #ffc107;
        }

        .device-icon {
          font-size: 32px;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-weight: bold;
          color: #333;
        }

        .device-ip, .device-mac, .device-manufacturer, .device-signal {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }

        .suspicious-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 11px;
          color: #856404;
        }

        .security-tips {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
        }

        .security-tips h4 {
          margin: 0 0 10px 0;
          color: #007bff;
        }

        .security-tips ul {
          margin: 0;
          padding-left: 20px;
        }

        .security-tips li {
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default NetworkScanner;
