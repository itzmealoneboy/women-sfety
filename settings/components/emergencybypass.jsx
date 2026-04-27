import React, { useState } from 'react';

const EmergencyBypass = () => {
  const [enabled, setEnabled] = useState(true);
  const [bypassCode, setBypassCode] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Police Emergency', number: '100', type: 'emergency' },
    { id: 2, name: 'Women Helpline', number: '181', type: 'support' },
    { id: 3, name: 'Ambulance', number: '102', type: 'emergency' }
  ]);
  const [autoAlert, setAutoAlert] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const generateBypassCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setBypassCode(code);
    alert(`Your emergency bypass code is: ${code}\nSave this code for emergencies.`);
  };

  return (
    <div className="emergency-bypass">
      <div className="settings-header">
        <h2>Emergency Bypass</h2>
        <p>Configure emergency override settings</p>
      </div>

      <div className="bypass-toggle">
        <div className="toggle-info">
          <div className="toggle-icon">🚨</div>
          <div>
            <h3>Emergency Bypass Mode</h3>
            <p>Allow emergency alerts to bypass all restrictions</p>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {enabled && (
        <>
          <div className="bypass-code-section">
            <h3>Emergency Bypass Code</h3>
            <p>Use this code to bypass security in emergencies</p>
            <div className="code-display">
              <code>{bypassCode || 'Not Set'}</code>
              <button onClick={generateBypassCode} className="generate-btn">
                Generate Code
              </button>
            </div>
          </div>

          <div className="emergency-contacts">
            <h3>Emergency Contacts</h3>
            <div className="contacts-list">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-icon">📞</div>
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-number">{contact.number}</div>
                  </div>
                  <button className="call-btn">Call</button>
                </div>
              ))}
              <button className="add-contact-btn">+ Add Contact</button>
            </div>
          </div>

          <div className="auto-alert-section">
            <h3>Automatic Alerts</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoAlert}
                onChange={(e) => setAutoAlert(e.target.checked)}
              />
              Automatically alert emergency contacts when bypass is activated
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={locationSharing}
                onChange={(e) => setLocationSharing(e.target.checked)}
              />
              Share real-time location with emergency contacts
            </label>
          </div>

          <div className="bypass-actions">
            <button className="test-bypass">Test Bypass Mode</button>
            <button className="save-btn">Save Settings</button>
          </div>
        </>
      )}

      <div className="security-note">
        <div className="note-icon">⚠️</div>
        <div className="note-text">
          Emergency bypass is designed for critical situations. Misuse may result in account suspension.
        </div>
      </div>

      <style jsx>{`
        .emergency-bypass {
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

        .bypass-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .toggle-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .toggle-icon {
          font-size: 32px;
        }

        .toggle-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .toggle-info p {
          margin: 0;
          color: #666;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #dc3545;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .bypass-code-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .bypass-code-section h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .bypass-code-section p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .code-display {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .code-display code {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: monospace;
          font-size: 18px;
          text-align: center;
        }

        .generate-btn {
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .emergency-contacts {
          margin-bottom: 24px;
        }

        .emergency-contacts h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .contact-icon {
          font-size: 24px;
        }

        .contact-info {
          flex: 1;
        }

        .contact-name {
          font-weight: 500;
          color: #333;
        }

        .contact-number {
          font-size: 12px;
          color: #666;
        }

        .call-btn {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .add-contact-btn {
          margin-top: 10px;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
        }

        .auto-alert-section {
          margin-bottom: 24px;
        }

        .auto-alert-section h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          color: #666;
        }

        .bypass-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .test-bypass, .save-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .test-bypass {
          background: #ffc107;
          color: #333;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .security-note {
          padding: 12px;
          background: #fff3cd;
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
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default EmergencyBypass;
