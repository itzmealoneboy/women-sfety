import React, { useState } from 'react';

const TransactionLimitsAlerts = () => {
  const [limits, setLimits] = useState({
    daily: 50000,
    perTransaction: 10000,
    weekly: 200000,
    monthly: 500000
  });
  const [usage, setUsage] = useState({
    today: 12500,
    thisWeek: 45000,
    thisMonth: 125000
  });
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Daily limit 75% used', percentage: 75, type: 'warning' },
    { id: 2, message: 'Large transaction detected', amount: 8500, type: 'info' }
  ]);
  const [editing, setEditing] = useState(false);
  const [newLimits, setNewLimits] = useState(limits);

  const handleUpdateLimits = () => {
    setLimits(newLimits);
    setEditing(false);
    alert('Transaction limits updated successfully');
  };

  const getPercentageColor = (used, limit) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return '#dc3545';
    if (percentage >= 70) return '#ffc107';
    return '#28a745';
  };

  const calculatePercentage = (used, limit) => {
    return Math.min(100, (used / limit) * 100);
  };

  return (
    <div className="transaction-limits">
      <div className="limits-header">
        <h2>Transaction Limits & Alerts</h2>
        <p>Manage your transaction limits and receive alerts</p>
        {!editing && (
          <button onClick={() => setEditing(true)} className="edit-btn">Edit Limits</button>
        )}
      </div>

      <div className="limits-grid">
        <div className="limit-card">
          <div className="limit-title">Daily Limit</div>
          <div className="limit-value">₹{limits.daily.toLocaleString()}</div>
          <div className="limit-usage">
            <div className="usage-bar">
              <div className="usage-fill" style={{ 
                width: `${calculatePercentage(usage.today, limits.daily)}%`,
                backgroundColor: getPercentageColor(usage.today, limits.daily)
              }} />
            </div>
            <div className="usage-text">
              Used: ₹{usage.today.toLocaleString()} / ₹{limits.daily.toLocaleString()}
              ({Math.round((usage.today / limits.daily) * 100)}%)
            </div>
          </div>
        </div>

        <div className="limit-card">
          <div className="limit-title">Per Transaction</div>
          <div className="limit-value">₹{limits.perTransaction.toLocaleString()}</div>
          <div className="limit-note">Maximum amount per single transaction</div>
        </div>

        <div className="limit-card">
          <div className="limit-title">Weekly Limit</div>
          <div className="limit-value">₹{limits.weekly.toLocaleString()}</div>
          <div className="limit-usage">
            <div className="usage-bar">
              <div className="usage-fill" style={{ 
                width: `${calculatePercentage(usage.thisWeek, limits.weekly)}%`,
                backgroundColor: getPercentageColor(usage.thisWeek, limits.weekly)
              }} />
            </div>
            <div className="usage-text">
              Used: ₹{usage.thisWeek.toLocaleString()} / ₹{limits.weekly.toLocaleString()}
              ({Math.round((usage.thisWeek / limits.weekly) * 100)}%)
            </div>
          </div>
        </div>

        <div className="limit-card">
          <div className="limit-title">Monthly Limit</div>
          <div className="limit-value">₹{limits.monthly.toLocaleString()}</div>
          <div className="limit-usage">
            <div className="usage-bar">
              <div className="usage-fill" style={{ 
                width: `${calculatePercentage(usage.thisMonth, limits.monthly)}%`,
                backgroundColor: getPercentageColor(usage.thisMonth, limits.monthly)
              }} />
            </div>
            <div className="usage-text">
              Used: ₹{usage.thisMonth.toLocaleString()} / ₹{limits.monthly.toLocaleString()}
              ({Math.round((usage.thisMonth / limits.monthly) * 100)}%)
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="edit-limits-modal">
          <h3>Edit Transaction Limits</h3>
          <div className="edit-form">
            <div className="form-group">
              <label>Daily Limit (₹)</label>
              <input
                type="number"
                value={newLimits.daily}
                onChange={(e) => setNewLimits({...newLimits, daily: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Per Transaction Limit (₹)</label>
              <input
                type="number"
                value={newLimits.perTransaction}
                onChange={(e) => setNewLimits({...newLimits, perTransaction: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Weekly Limit (₹)</label>
              <input
                type="number"
                value={newLimits.weekly}
                onChange={(e) => setNewLimits({...newLimits, weekly: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Monthly Limit (₹)</label>
              <input
                type="number"
                value={newLimits.monthly}
                onChange={(e) => setNewLimits({...newLimits, monthly: parseInt(e.target.value)})}
              />
            </div>
            <div className="edit-actions">
              <button onClick={handleUpdateLimits} className="save-btn">Save Changes</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item alert-${alert.type}`}>
              <div className="alert-icon">{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                {alert.percentage && <div className="alert-percentage">{alert.percentage}% of limit used</div>}
                {alert.amount && <div className="alert-amount">Amount: ₹{alert.amount.toLocaleString()}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="notification-settings">
        <h3>Alert Settings</h3>
        <div className="settings-options">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Notify at 50% usage
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Notify at 75% usage
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Notify at 90% usage
          </label>
          <label className="checkbox-label">
            <input type="checkbox" /> Notify for large transactions above ₹10,000
          </label>
        </div>
      </div>

      <style jsx>{`
        .transaction-limits {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .limits-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .limits-header h2 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 28px;
        }

        .limits-header p {
          margin: 0;
          color: #666;
        }

        .edit-btn {
          padding: 8px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .limits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .limit-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .limit-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .limit-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }

        .limit-note {
          font-size: 12px;
          color: #999;
        }

        .usage-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .usage-fill {
          height: 100%;
        }

        .usage-text {
          font-size: 12px;
          color: #666;
        }

        .edit-limits-modal {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .edit-limits-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .edit-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .edit-actions {
          grid-column: span 2;
          display: flex;
          gap: 10px;
        }

        .save-btn, .cancel-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
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
          gap: 10px;
        }

        .alert-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
        }

        .alert-warning {
          background: #fff3cd;
          border-left: 3px solid #ffc107;
        }

        .alert-info {
          background: #d4edda;
          border-left: 3px solid #28a745;
        }

        .alert-icon {
          font-size: 20px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-message {
          margin-bottom: 5px;
        }

        .alert-percentage, .alert-amount {
          font-size: 12px;
          color: #666;
        }

        .notification-settings {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .notification-settings h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .settings-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default TransactionLimitsAlerts;