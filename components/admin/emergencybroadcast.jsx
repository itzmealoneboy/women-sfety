import React, { useState, useEffect } from 'react';

const EmergencyBroadcast = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    severity: 'medium',
    audience: 'all',
    location: '',
    scheduledTime: ''
  });
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    const mockBroadcasts = [
      {
        id: 1,
        title: 'Severe Weather Alert',
        message: 'Heavy rainfall expected in coastal areas. Please stay indoors.',
        severity: 'high',
        audience: 'coastal region',
        status: 'active',
        sentAt: new Date(2024, 0, 15, 10, 30),
        recipients: 12500,
        acknowledged: 8920
      },
      {
        id: 2,
        title: 'Public Safety Advisory',
        message: 'Increased police patrolling in downtown area due to festival.',
        severity: 'medium',
        audience: 'downtown',
        status: 'active',
        sentAt: new Date(2024, 0, 14, 9, 0),
        recipients: 5400,
        acknowledged: 4100
      },
      {
        id: 3,
        title: 'Missing Person Alert',
        message: 'Please report any information about missing individual.',
        severity: 'critical',
        audience: 'all',
        status: 'expired',
        sentAt: new Date(2024, 0, 10, 15, 0),
        recipients: 15000,
        acknowledged: 12800
      }
    ];
    setBroadcasts(mockBroadcasts);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setSending(true);
    
    setTimeout(() => {
      const broadcast = {
        ...newBroadcast,
        id: Date.now(),
        status: 'active',
        sentAt: new Date(),
        recipients: Math.floor(Math.random() * 15000),
        acknowledged: 0
      };
      setBroadcasts([broadcast, ...broadcasts]);
      setShowForm(false);
      setNewBroadcast({
        title: '',
        message: '',
        severity: 'medium',
        audience: 'all',
        location: '',
        scheduledTime: ''
      });
      setSending(false);
      alert('Emergency broadcast sent successfully!');
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <div className="emergency-broadcast">
      <div className="broadcast-header">
        <h2>Emergency Broadcast System</h2>
        <p>Send urgent alerts and notifications to users</p>
        <button onClick={() => setShowForm(true)} className="new-broadcast-btn">
          + New Broadcast
        </button>
      </div>

      {/* Active Broadcast Banner */}
      {broadcasts.filter(b => b.status === 'active').length > 0 && (
        <div className="active-broadcast-banner">
          <div className="banner-icon">📢</div>
          <div className="banner-content">
            <h3>Active Emergency Broadcasts</h3>
            <p>{broadcasts.filter(b => b.status === 'active').length} active alert{broadcasts.filter(b => b.status === 'active').length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Broadcast List */}
      <div className="broadcasts-list">
        <h3>Broadcast History</h3>
        {broadcasts.map(broadcast => (
          <div key={broadcast.id} className={`broadcast-card severity-${broadcast.severity}`}>
            <div className="broadcast-header-info">
              <div className="broadcast-icon">{getSeverityIcon(broadcast.severity)}</div>
              <div className="broadcast-info">
                <h4>{broadcast.title}</h4>
                <p className="broadcast-message">{broadcast.message}</p>
                <div className="broadcast-meta">
                  <span className="meta-audience">👥 {broadcast.audience}</span>
                  <span className="meta-time">🕒 {new Date(broadcast.sentAt).toLocaleString()}</span>
                  <span className="meta-recipients">📨 {broadcast.recipients.toLocaleString()} recipients</span>
                  <span className="meta-acknowledged">✓ {broadcast.acknowledged.toLocaleString()} acknowledged</span>
                </div>
              </div>
              <div className={`broadcast-status status-${broadcast.status}`}>
                {broadcast.status}
              </div>
            </div>
            {broadcast.status === 'active' && (
              <div className="broadcast-actions">
                <button className="btn-update">Update</button>
                <button className="btn-cancel">Cancel Broadcast</button>
                <button className="btn-view">View Details</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Broadcast Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="broadcast-form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Emergency Broadcast</h3>
            <form onSubmit={handleSendBroadcast}>
              <div className="form-group">
                <label>Alert Title *</label>
                <input
                  type="text"
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                  required
                  placeholder="E.g., Severe Weather Warning"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={newBroadcast.message}
                  onChange={(e) => setNewBroadcast({...newBroadcast, message: e.target.value})}
                  rows={4}
                  required
                  placeholder="Detailed emergency message..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Severity *</label>
                  <select value={newBroadcast.severity} onChange={(e) => setNewBroadcast({...newBroadcast, severity: e.target.value})}>
                    <option value="critical">Critical - Immediate Action Required</option>
                    <option value="high">High - Urgent Attention</option>
                    <option value="medium">Medium - Important Information</option>
                    <option value="low">Low - Informational</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Audience *</label>
                  <select value={newBroadcast.audience} onChange={(e) => setNewBroadcast({...newBroadcast, audience: e.target.value})}>
                    <option value="all">All Users</option>
                    <option value="location">Specific Location</option>
                    <option value="role">Specific User Role</option>
                  </select>
                </div>
              </div>

              {newBroadcast.audience === 'location' && (
                <div className="form-group">
                  <label>Location/Region</label>
                  <input
                    type="text"
                    value={newBroadcast.location}
                    onChange={(e) => setNewBroadcast({...newBroadcast, location: e.target.value})}
                    placeholder="E.g., North District, Coastal Area"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Schedule (Optional)</label>
                <input
                  type="datetime-local"
                  value={newBroadcast.scheduledTime}
                  onChange={(e) => setNewBroadcast({...newBroadcast, scheduledTime: e.target.value})}
                />
              </div>

              <div className="preview-section">
                <h4>Preview</h4>
                <div className={`preview-card severity-${newBroadcast.severity}`}>
                  <div className="preview-icon">{getSeverityIcon(newBroadcast.severity)}</div>
                  <div className="preview-content">
                    <strong>{newBroadcast.title || 'Alert Title'}</strong>
                    <p>{newBroadcast.message || 'Your message will appear here...'}</p>
                    <small>Audience: {newBroadcast.audience}</small>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={sending} className="submit-btn">
                  {sending ? 'Sending...' : 'Send Broadcast'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .emergency-broadcast {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .broadcast-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .broadcast-header h2 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 28px;
        }

        .broadcast-header p {
          margin: 0;
          color: #666;
        }

        .new-broadcast-btn {
          padding: 10px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .active-broadcast-banner {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .banner-icon {
          font-size: 40px;
        }

        .banner-content h3 {
          margin: 0 0 5px 0;
        }

        .banner-content p {
          margin: 0;
          opacity: 0.9;
        }

        .broadcasts-list h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .broadcast-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .broadcast-card.severity-critical { border-left-color: #dc3545; }
        .broadcast-card.severity-high { border-left-color: #fd7e14; }
        .broadcast-card.severity-medium { border-left-color: #ffc107; }
        .broadcast-card.severity-low { border-left-color: #28a745; }

        .broadcast-header-info {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .broadcast-icon {
          font-size: 32px;
        }

        .broadcast-info {
          flex: 1;
        }

        .broadcast-info h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .broadcast-message {
          color: #666;
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .broadcast-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          font-size: 12px;
          color: #999;
        }

        .broadcast-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          height: fit-content;
        }

        .broadcast-status.status-active {
          background: #d4edda;
          color: #155724;
        }

        .broadcast-status.status-expired {
          background: #e0e0e0;
          color: #666;
        }

        .broadcast-actions {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-update, .btn-cancel, .btn-view {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-update {
          background: #007bff;
          color: white;
        }

        .btn-cancel {
          background: #dc3545;
          color: white;
        }

        .btn-view {
          background: #6c757d;
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

        .broadcast-form-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .broadcast-form-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
          font-weight: 500;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .preview-section {
          margin: 20px 0;
        }

        .preview-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .preview-card {
          padding: 15px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
          background: #f8f9fa;
        }

        .preview-card.severity-critical { background: #f8d7da; border-left: 4px solid #dc3545; }
        .preview-card.severity-high { background: #fff3cd; border-left: 4px solid #fd7e14; }
        .preview-card.severity-medium { background: #fff3cd; border-left: 4px solid #ffc107; }
        .preview-card.severity-low { background: #d4edda; border-left: 4px solid #28a745; }

        .preview-icon {
          font-size: 28px;
        }

        .preview-content {
          flex: 1;
        }

        .preview-content strong {
          display: block;
          margin-bottom: 5px;
        }

        .preview-content p {
          margin: 0 0 5px 0;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .submit-btn, .cancel-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .submit-btn {
          background: #dc3545;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .broadcast-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyBroadcast;
