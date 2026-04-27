import React, { useState, useEffect } from 'react';

const WearableDevices = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState({
    heartRate: 72,
    steps: 8452,
    calories: 320,
    sleep: 7.2,
    battery: 85,
    connected: false
  });
  const [alerts, setAlerts] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchDevices();
    if (deviceData.connected) {
      simulateDataStream();
    }
  }, [deviceData.connected]);

  const fetchDevices = () => {
    const mockDevices = [
      { id: 1, name: 'SmartWatch Pro', type: 'watch', connected: true, battery: 85, lastSync: new Date() },
      { id: 2, name: 'Fitness Tracker', type: 'band', connected: false, battery: 0, lastSync: new Date(2024, 0, 14) },
      { id: 3, name: 'Health Ring', type: 'ring', connected: false, battery: 45, lastSync: new Date(2024, 0, 13) }
    ];
    setDevices(mockDevices);
    setSelectedDevice(mockDevices[0]);
    setDeviceData(prev => ({ ...prev, connected: true }));
  };

  const simulateDataStream = () => {
    const interval = setInterval(() => {
      setDeviceData(prev => ({
        ...prev,
        heartRate: Math.floor(Math.random() * 40) + 60,
        steps: prev.steps + Math.floor(Math.random() * 50),
        calories: prev.calories + Math.floor(Math.random() * 5),
        battery: Math.max(0, prev.battery - 0.1)
      }));
      
      // Check for abnormal readings
      if (deviceData.heartRate > 100) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'High Heart Rate',
          message: `Heart rate elevated to ${deviceData.heartRate} bpm`,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]);
      } else if (deviceData.heartRate < 50) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'Low Heart Rate',
          message: `Heart rate dropped to ${deviceData.heartRate} bpm`,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  };

  const syncDevice = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setDeviceData(prev => ({
        ...prev,
        lastSync: new Date(),
        steps: prev.steps + Math.floor(Math.random() * 100)
      }));
      setIsSyncing(false);
    }, 2000);
  };

  const connectDevice = (device) => {
    setSelectedDevice(device);
    setDeviceData(prev => ({ ...prev, connected: true, battery: device.battery }));
    alert(`Connected to ${device.name}`);
  };

  const getHeartRateStatus = (rate) => {
    if (rate > 100) return { text: 'Elevated', color: '#dc3545' };
    if (rate > 85) return { text: 'High', color: '#fd7e14' };
    if (rate > 60) return { text: 'Normal', color: '#28a745' };
    if (rate > 50) return { text: 'Low', color: '#ffc107' };
    return { text: 'Critical', color: '#dc3545' };
  };

  const getStepGoal = () => {
    const goal = 10000;
    const progress = (deviceData.steps / goal) * 100;
    return { progress, remaining: goal - deviceData.steps };
  };

  const stepGoal = getStepGoal();

  return (
    <div className="wearable-devices">
      <div className="devices-header">
        <h2>Wearable Devices</h2>
        <p>Monitor your health and activity data from connected devices</p>
      </div>

      <div className="devices-grid">
        <div className="devices-list-section">
          <h3>Connected Devices</h3>
          <div className="devices-list">
            {devices.map(device => (
              <div 
                key={device.id} 
                className={`device-item ${selectedDevice?.id === device.id ? 'active' : ''} ${device.connected ? 'connected' : 'disconnected'}`}
                onClick={() => device.connected && setSelectedDevice(device)}
              >
                <div className="device-icon">
                  {device.type === 'watch' ? '⌚' : device.type === 'band' ? '📿' : '💍'}
                </div>
                <div className="device-info">
                  <div className="device-name">{device.name}</div>
                  <div className="device-status">{device.connected ? 'Connected' : 'Disconnected'}</div>
                </div>
                {!device.connected && (
                  <button onClick={() => connectDevice(device)} className="connect-btn">Connect</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedDevice && deviceData.connected && (
          <div className="device-data-section">
            <div className="data-header">
              <h3>{selectedDevice.name}</h3>
              <div className="battery-indicator">
                🔋 {Math.round(deviceData.battery)}%
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">❤️</div>
                <div className="metric-info">
                  <div className="metric-value" style={{ color: getHeartRateStatus(deviceData.heartRate).color }}>
                    {deviceData.heartRate}
                  </div>
                  <div className="metric-label">Heart Rate (bpm)</div>
                  <div className="metric-status">{getHeartRateStatus(deviceData.heartRate).text}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">👟</div>
                <div className="metric-info">
                  <div className="metric-value">{deviceData.steps.toLocaleString()}</div>
                  <div className="metric-label">Steps</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${stepGoal.progress}%` }} />
                    </div>
                    <div className="progress-text">{Math.round(stepGoal.progress)}% to goal</div>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">🔥</div>
                <div className="metric-info">
                  <div className="metric-value">{deviceData.calories}</div>
                  <div className="metric-label">Calories Burned</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">😴</div>
                <div className="metric-info">
                  <div className="metric-value">{deviceData.sleep}</div>
                  <div className="metric-label">Sleep (hours)</div>
                </div>
              </div>
            </div>

            <div className="device-actions">
              <button onClick={syncDevice} disabled={isSyncing} className="sync-btn">
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <button className="settings-btn">Device Settings</button>
            </div>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Health Alerts</h3>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className="alert-card">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <div className="alert-title">{alert.type}</div>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{alert.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .wearable-devices {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .devices-header {
          margin-bottom: 30px;
        }

        .devices-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .devices-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .devices-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .devices-list-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .devices-list-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .device-item.active {
          background: #e7f3ff;
          border-left: 3px solid #007bff;
        }

        .device-item.connected {
          background: #f8f9fa;
        }

        .device-item.disconnected {
          opacity: 0.6;
        }

        .device-icon {
          font-size: 32px;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-weight: 500;
          color: #333;
        }

        .device-status {
          font-size: 12px;
          color: #666;
        }

        .connect-btn {
          padding: 4px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .device-data-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .data-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .data-header h3 {
          margin: 0;
          color: #333;
        }

        .battery-indicator {
          padding: 4px 12px;
          background: #e0e0e0;
          border-radius: 20px;
          font-size: 12px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .metric-icon {
          font-size: 36px;
        }

        .metric-info {
          flex: 1;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
        }

        .metric-label {
          font-size: 12px;
          color: #666;
        }

        .metric-status {
          font-size: 11px;
          margin-top: 4px;
        }

        .metric-progress {
          margin-top: 8px;
        }

        .progress-bar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
        }

        .progress-text {
          font-size: 10px;
          color: #666;
        }

        .device-actions {
          display: flex;
          gap: 10px;
        }

        .sync-btn, .settings-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .sync-btn {
          background: #007bff;
          color: white;
        }

        .settings-btn {
          background: #6c757d;
          color: white;
        }

        .alerts-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          padding: 12px;
          background: #fff3cd;
          border-radius: 8px;
          border-left: 3px solid #ffc107;
        }

        .alert-icon {
          font-size: 20px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-weight: bold;
          color: #856404;
        }

        .alert-message {
          font-size: 13px;
          color: #856404;
          margin: 4px 0;
        }

        .alert-time {
          font-size: 11px;
          color: #856404;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .devices-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default WearableDevices;
