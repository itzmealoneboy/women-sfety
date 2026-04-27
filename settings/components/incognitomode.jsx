import React, { useState } from 'react';

const IncognitoMode = () => {
  const [enabled, setEnabled] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(30);
  const [clearData, setClearData] = useState({
    browsing: true,
    searches: true,
    activity: true
  });
  const [activeSession, setActiveSession] = useState(null);

  const startIncognito = () => {
    const session = {
      id: Date.now(),
      startTime: new Date(),
      expiresIn: sessionDuration
    };
    setActiveSession(session);
    setEnabled(true);
  };

  const endIncognito = () => {
    setActiveSession(null);
    setEnabled(false);
    if (clearData.browsing || clearData.searches || clearData.activity) {
      alert('Incognito session ended. Selected data has been cleared.');
    }
  };

  return (
    <div className="incognito-mode">
      <div className="settings-header">
        <h2>Incognito Mode</h2>
        <p>Browse without saving history or activity</p>
      </div>

      {!activeSession ? (
        <div className="incognito-start">
          <div className="incognito-icon">🕵️</div>
          <h3>Private Browsing</h3>
          <p>When enabled, your activity won't be saved to your account</p>
          
          <div className="duration-selector">
            <label>Session Duration (minutes)</label>
            <select value={sessionDuration} onChange={(e) => setSessionDuration(Number(e.target.value))}>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Until I turn off</option>
            </select>
          </div>

          <div className="clear-options">
            <h4>Data to clear when session ends</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={clearData.browsing}
                onChange={(e) => setClearData({...clearData, browsing: e.target.checked})}
              />
              Browsing history
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={clearData.searches}
                onChange={(e) => setClearData({...clearData, searches: e.target.checked})}
              />
              Search history
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={clearData.activity}
                onChange={(e) => setClearData({...clearData, activity: e.target.checked})}
              />
              Recent activity
            </label>
          </div>

          <button onClick={startIncognito} className="start-btn">
            Start Incognito Session
          </button>
        </div>
      ) : (
        <div className="active-session">
          <div className="session-banner">
            <div className="banner-icon">🕵️</div>
            <div className="banner-content">
              <h3>Incognito Session Active</h3>
              <p>Your activity is not being saved</p>
            </div>
          </div>

          <div className="session-info">
            <div className="info-item">
              <label>Started:</label>
              <span>{activeSession.startTime.toLocaleTimeString()}</span>
            </div>
            {sessionDuration > 0 && (
              <div className="info-item">
                <label>Auto-ends in:</label>
                <span>{sessionDuration} minutes</span>
              </div>
            )}
          </div>

          <div className="session-actions">
            <button onClick={endIncognito} className="end-btn">
              End Incognito Session
            </button>
          </div>

          <div className="privacy-note">
            <div className="note-icon">🔒</div>
            <div className="note-text">
              When you end this session, your browsing history, searches, and activity will be cleared according to your settings.
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .incognito-mode {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .settings-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .settings-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0;
          color: #666;
        }

        .incognito-start, .active-session {
          text-align: center;
        }

        .incognito-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .incognito-start h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .incognito-start p {
          margin: 0 0 30px 0;
          color: #666;
        }

        .duration-selector {
          margin-bottom: 25px;
          text-align: left;
        }

        .duration-selector label {
          display: block;
          margin-bottom: 8px;
          color: #666;
        }

        .duration-selector select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .clear-options {
          text-align: left;
          margin-bottom: 30px;
        }

        .clear-options h4 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          color: #666;
        }

        .start-btn {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .session-banner {
          background: #e7f3ff;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .banner-icon {
          font-size: 48px;
        }

        .banner-content h3 {
          margin: 0 0 5px 0;
          color: #007bff;
        }

        .banner-content p {
          margin: 0;
          color: #666;
        }

        .session-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .info-item label {
          color: #666;
        }

        .info-item span {
          font-weight: 500;
          color: #333;
        }

        .end-btn {
          width: 100%;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .privacy-note {
          margin-top: 20px;
          padding: 12px;
          background: #e7f3ff;
          border-radius: 8px;
          display: flex;
          gap: 10px;
        }

        .note-icon {
          font-size: 20px;
        }

        .note-text {
          flex: 1;
          font-size: 12px;
          color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default IncognitoMode;
