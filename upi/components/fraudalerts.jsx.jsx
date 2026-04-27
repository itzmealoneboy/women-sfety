import React, { useState, useEffect } from 'react';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    blocked: 0,
    investigated: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockAlerts = [
        {
          id: 1,
          type: 'Suspicious Transaction',
          amount: '₹25,000',
          merchant: 'Unknown Merchant',
          time: '2 minutes ago',
          riskLevel: 'high',
          status: 'pending',
          description: 'Unusual transaction amount from new device',
          recommendedAction: 'Block transaction immediately'
        },
        {
          id: 2,
          type: 'Multiple Failed Attempts',
          amount: '₹0',
          merchant: 'UPI App',
          time: '5 minutes ago',
          riskLevel: 'medium',
          status: 'investigating',
          description: '3 failed login attempts detected',
          recommendedAction: 'Change UPI PIN immediately'
        },
        {
          id: 3,
          type: 'New Device Login',
          amount: '₹0',
          merchant: 'Unknown Device',
          time: '15 minutes ago',
          riskLevel: 'medium',
          status: 'pending',
          description: 'Login from unrecognized device',
          recommendedAction: 'Verify device authorization'
        },
        {
          id: 4,
          type: 'Phishing Attempt',
          amount: '₹0',
          merchant: 'Fake Website',
          time: '1 hour ago',
          riskLevel: 'high',
          status: 'blocked',
          description: 'Suspicious link clicked via SMS',
          recommendedAction: 'Do not share OTP with anyone'
        }
      ];

      const mockStats = {
        totalAlerts: 12,
        blocked: 8,
        investigated: 3,
        resolved: 1
      };

      setAlerts(mockAlerts);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  };

  const handleAction = (alertId, action) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: action === 'block' ? 'blocked' : 'investigated' } : alert
    ));
    alert(`Alert ${action === 'block' ? 'blocked' : 'marked for investigation'}`);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'blocked': return '#28a745';
      case 'investigating': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="fraud-alerts">
      <div className="alerts-header">
        <h2>UPI Fraud Alerts</h2>
        <p>Real-time fraud detection and prevention</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalAlerts}</div>
          <div className="stat-label">Total Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.blocked}</div>
          <div className="stat-label">Blocked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.investigated}</div>
          <div className="stat-label">Investigating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Scanning for fraud alerts...</div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-card" style={{ borderLeftColor: getRiskColor(alert.riskLevel) }}>
              <div className="alert-header">
                <div className="alert-type">{alert.type}</div>
                <div className="alert-risk" style={{ backgroundColor: getRiskColor(alert.riskLevel) }}>
                  {alert.riskLevel.toUpperCase()} RISK
                </div>
              </div>
              <div className="alert-details">
                {alert.amount !== '₹0' && <div className="alert-amount">💰 {alert.amount}</div>}
                <div className="alert-merchant">🏪 {alert.merchant}</div>
                <div className="alert-time">🕒 {alert.time}</div>
                <div className="alert-description">{alert.description}</div>
                <div className="alert-action">🔔 Recommended: {alert.recommendedAction}</div>
              </div>
              <div className="alert-status" style={{ backgroundColor: getStatusColor(alert.status) }}>
                {alert.status.toUpperCase()}
              </div>
              <div className="alert-actions">
                {alert.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(alert.id, 'block')} className="block-btn">
                      Block Transaction
                    </button>
                    <button onClick={() => handleAction(alert.id, 'investigate')} className="investigate-btn">
                      Investigate
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedAlert(alert)} className="details-btn">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAlert(null)}>×</button>
            <h3>Alert Details</h3>
            <div className="alert-detail-section">
              <div className="detail-row">
                <strong>Type:</strong> {selectedAlert.type}
              </div>
              <div className="detail-row">
                <strong>Amount:</strong> {selectedAlert.amount}
              </div>
              <div className="detail-row">
                <strong>Merchant:</strong> {selectedAlert.merchant}
              </div>
              <div className="detail-row">
                <strong>Time:</strong> {selectedAlert.time}
              </div>
              <div className="detail-row">
                <strong>Risk Level:</strong> 
                <span style={{ color: getRiskColor(selectedAlert.riskLevel) }}> {selectedAlert.riskLevel.toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <strong>Description:</strong> {selectedAlert.description}
              </div>
              <div className="detail-row">
                <strong>Recommended Action:</strong> {selectedAlert.recommendedAction}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span style={{ color: getStatusColor(selectedAlert.status) }}> {selectedAlert.status.toUpperCase()}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="report-btn">Report as Fraud</button>
              <button className="safe-btn">Mark as Safe</button>
            </div>
          </div>
        </div>
      )}

      <div className="safety-tips">
        <h3>Fraud Prevention Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">🔒 Never share OTP with anyone</div>
          <div className="tip-card">📱 Verify merchant before payment</div>
          <div className="tip-card">⚠️ Don't click on suspicious links</div>
          <div className="tip-card">🔄 Regularly update UPI PIN</div>
          <div className="tip-card">📞 Report fraud immediately to bank</div>
        </div>
      </div>

      <style jsx>{`
        .fraud-alerts {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .alerts-header {
          margin-bottom: 30px;
        }

        .alerts-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .alerts-header p {
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
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .alert-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .alert-type {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .alert-risk {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .alert-details {
          margin-bottom: 15px;
        }

        .alert-amount, .alert-merchant, .alert-time {
          margin-bottom: 5px;
          color: #666;
        }

        .alert-description {
          margin: 10px 0;
          color: #666;
        }

        .alert-action {
          background: #fff3cd;
          padding: 8px;
          border-radius: 6px;
          color: #856404;
          font-size: 13px;
        }

        .alert-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .alert-actions {
          display: flex;
          gap: 10px;
        }

        .block-btn, .investigate-btn, .details-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .block-btn {
          background: #dc3545;
          color: white;
        }

        .investigate-btn {
          background: #ffc107;
          color: #333;
        }

        .details-btn {
          background: #007bff;
          color: white;
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

        .alert-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
        }

        .modal-close {
          float: right;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .alert-detail-section {
          margin: 20px 0;
        }

        .detail-row {
          margin-bottom: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .report-btn, .safe-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .report-btn {
          background: #dc3545;
          color: white;
        }

        .safe-btn {
          background: #28a745;
          color: white;
        }

        .safety-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .safety-tips h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .tip-card {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default FraudAlerts;