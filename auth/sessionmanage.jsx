import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const SessionManage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sessionToTerminate, setSessionToTerminate] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // Simulate API call
      const mockSessions = [
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'New York, USA',
          ip: '192.168.1.1',
          browser: 'Chrome 120',
          os: 'Windows 11',
          lastActive: new Date(2024, 0, 15, 14, 30),
          isCurrent: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'New York, USA',
          ip: '192.168.1.2',
          browser: 'Safari 17',
          os: 'iOS 17',
          lastActive: new Date(2024, 0, 14, 9, 15),
          isCurrent: false
        },
        {
          id: 3,
          device: 'Firefox on Mac',
          location: 'Los Angeles, USA',
          ip: '203.0.113.5',
          browser: 'Firefox 121',
          os: 'macOS 14',
          lastActive: new Date(2024, 0, 13, 22, 45),
          isCurrent: false
        }
      ];
      setSessions(mockSessions);
      setCurrentSessionId(mockSessions.find(s => s.isCurrent)?.id);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSessions(sessions.filter(session => session.id !== sessionId));
      setShowConfirmModal(false);
      setSessionToTerminate(null);
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  const terminateAllOtherSessions = async () => {
    if (window.confirm('Are you sure you want to terminate all other sessions? You will be logged out from all other devices.')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSessions(sessions.filter(session => session.isCurrent));
        setShowConfirmModal(false);
      } catch (error) {
        console.error('Error terminating all sessions:', error);
      }
    }
  };

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('windows')) return '🪟';
    if (device.toLowerCase().includes('mac')) return '🍎';
    if (device.toLowerCase().includes('iphone')) return '📱';
    if (device.toLowerCase().includes('android')) return '🤖';
    return '💻';
  };

  return (
    <div className="session-manage">
      <div className="session-header">
        <h2>Active Sessions</h2>
        <p>Manage devices where you're currently logged in</p>
      </div>

      <div className="session-actions">
        <button onClick={terminateAllOtherSessions} className="btn-terminate-all">
          Terminate All Other Sessions
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading sessions...</div>
      ) : (
        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session.id} className={`session-card ${session.isCurrent ? 'current' : ''}`}>
              <div className="session-icon">
                {getDeviceIcon(session.device)}
              </div>
              <div className="session-info">
                <div className="session-device">
                  {session.device}
                  {session.isCurrent && <span className="current-badge">Current Session</span>}
                </div>
                <div className="session-details">
                  <span>📍 {session.location}</span>
                  <span>🔌 {session.ip}</span>
                  <span>🌐 {session.browser}</span>
                  <span>🖥️ {session.os}</span>
                </div>
                <div className="session-last-active">
                  Last active {formatDistanceToNow(session.lastActive)} ago
                </div>
              </div>
              {!session.isCurrent && (
                <div className="session-actions">
                  <button 
                    onClick={() => {
                      setSessionToTerminate(session.id);
                      setShowConfirmModal(true);
                    }}
                    className="btn-terminate"
                  >
                    Terminate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Terminate Session</h3>
            <p>Are you sure you want to terminate this session? You will be logged out from this device.</p>
            <div className="modal-actions">
              <button onClick={() => terminateSession(sessionToTerminate)} className="btn-confirm">
                Yes, Terminate
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .session-manage {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .session-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .session-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .session-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .session-actions {
          margin-bottom: 20px;
          text-align: right;
        }

        .btn-terminate-all {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-terminate-all:hover {
          background: #c82333;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .session-card {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .session-card.current {
          background-color: #e7f3ff;
          border-color: #007bff;
        }

        .session-icon {
          font-size: 32px;
          margin-right: 15px;
        }

        .session-info {
          flex: 1;
        }

        .session-device {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .current-badge {
          background: #28a745;
          color: white;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 10px;
        }

        .session-details {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .session-last-active {
          font-size: 12px;
          color: #999;
        }

        .btn-terminate {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 12px;
        }

        .btn-terminate:hover {
          background: #c82333;
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

        .confirm-modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
        }

        .confirm-modal h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .confirm-modal p {
          margin: 0 0 20px 0;
          color: #666;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-confirm {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
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

export default SessionManage;
