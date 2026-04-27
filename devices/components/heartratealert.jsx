import React, { useState, useEffect } from 'react';

const HeartRateAlert = () => {
  const [currentHeartRate, setCurrentHeartRate] = useState(72);
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertThresholds, setAlertThresholds] = useState({
    high: 100,
    low: 50
  });
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertSound, setAlertSound] = useState(true);

  useEffect(() => {
    const interval = setInterval(simulateHeartRate, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateHeartRate = () => {
    let newRate = currentHeartRate + (Math.random() - 0.5) * 10;
    newRate = Math.min(150, Math.max(40, newRate));
    setCurrentHeartRate(Math.round(newRate));
    
    checkForAlert(Math.round(newRate));
  };

  const checkForAlert = (rate) => {
    if (!alertEnabled) return;
    
    if (rate > alertThresholds.high) {
      triggerAlert('High Heart Rate', `Heart rate elevated to ${rate} bpm`, 'high');
    } else if (rate < alertThresholds.low) {
      triggerAlert('Low Heart Rate', `Heart rate dropped to ${rate} bpm`, 'low');
    }
  };

  const triggerAlert = (type, message, severity) => {
    const alert = {
      id: Date.now(),
      type,
      message,
      severity,
      heartRate: currentHeartRate,
      timestamp: new Date()
    };
    
    setAlertHistory(prev => [alert, ...prev].slice(0, 20));
    
    if (alertSound) {
      playAlertSound(severity);
    }
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(type, { body: message });
    }
  };

  const playAlertSound = (severity) => {
    // Simulate sound - in production use actual audio
    console.log(`Playing ${severity} alert sound`);
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const getHeartRateStatus = (rate) => {
    if (rate > alertThresholds.high) return { text: 'Critical High', color: '#dc3545' };
    if (rate > 100) return { text: 'Elevated', color: '#fd7e14' };
    if (rate > 60) return { text: 'Normal', color: '#28a745' };
    if (rate > alertThresholds.low) return { text: 'Low', color: '#ffc107' };
    return { text: 'Critical Low', color: '#dc3545' };
  };

  const status = getHeartRateStatus(currentHeartRate);

  return (
    <div className="heart-rate-alert">
      <div className="alert-header">
        <h3>Heart Rate Monitor</h3>
        <div className="alert-controls">
          <label>
            <input 
              type="checkbox" 
              checked={alertEnabled} 
              onChange={(e) => setAlertEnabled(e.target.checked)} 
            />
            Enable Alerts
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={alertSound} 
              onChange={(e) => setAlertSound(e.target.checked)} 
            />
            Sound Alerts
          </label>
          <button onClick={requestNotificationPermission} className="notify-btn">
            Enable Notifications
          </button>
        </div>
      </div>

      <div className="heart-rate-display">
        <div className="heart-rate-value" style={{ color: status.color }}>
          {currentHeartRate}
        </div>
        <div className="heart-rate-label">Beats per minute</div>
        <div className="heart-rate-status" style={{ color: status.color }}>
          {status.text}
        </div>
      </div>

      <div className="threshold-settings">
        <h4>Alert Thresholds</h4>
        <div className="threshold-inputs">
          <div className="threshold-item">
            <label>High Alert (> bpm)</label>
            <input 
              type="number" 
              value={alertThresholds.high}
              onChange={(e) => setAlertThresholds({...alertThresholds, high: parseInt(e.target.value)})}
              min={60}
              max={200}
            />
          </div>
          <div className="threshold-item">
            <label>Low Alert (< bpm)</label>
            <input 
              type="number" 
              value={alertThresholds.low}
              onChange={(e) => setAlertThresholds({...alertThresholds, low: parseInt(e.target.value)})}
              min={30}
              max={80}
            />
          </div>
        </div>
      </div>

      {alertHistory.length > 0 && (
        <div className="alert-history">
          <h4>Alert History</h4>
          <div className="history-list">
            {alertHistory.map(alert => (
              <div key={alert.id} className={`history-item ${alert.severity}`}>
                <div className="history-icon">⚠️</div>
                <div className="history-content">
                  <div className="history-title">{alert.type}</div>
                  <div className="history-message">{alert.message}</div>
                  <div className="history-time">{alert.timestamp.toLocaleTimeString()}</div>
                </div>
                <div className="history-rate">{alert.heartRate} bpm</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .heart-rate-alert {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }

        .alert-header h3 {
          margin: 0;
          color: #333;
        }

        .alert-controls {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .alert-controls label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #666;
        }

        .notify-btn {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .heart-rate-display {
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .heart-rate-value {
          font-size: 72px;
          font-weight: bold;
        }

        .heart-rate-label {
          font-size: 14px;
          color: #666;
          margin: 10px 0;
        }

        .heart-rate-status {
          font-size: 18px;
          font-weight: 500;
        }

        .threshold-settings {
          margin-bottom: 20px;
        }

        .threshold-settings h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .threshold-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .threshold-item label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .threshold-item input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .alert-history h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .history-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 6px;
        }

        .history-item.high {
          background: #f8d7da;
          border-left: 3px solid #dc3545;
        }

        .history-item.low {
          background: #fff3cd;
          border-left: 3px solid #ffc107;
        }

        .history-icon {
          font-size: 20px;
        }

        .history-content {
          flex: 1;
        }

        .history-title {
          font-weight: bold;
          font-size: 13px;
        }

        .history-message {
          font-size: 12px;
          margin: 2px 0;
        }

        .history-time {
          font-size: 10px;
          color: #999;
        }

        .history-rate {
          font-weight: bold;
          font-size: 16px;
        }

        .history-item.high .history-rate {
          color: #dc3545;
        }

        .history-item.low .history-rate {
          color: #ffc107;
        }
      `}</style>
    </div>
  );
};

export default HeartRateAlert;
