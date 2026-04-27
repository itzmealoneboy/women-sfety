import React, { useState } from 'react';

const DoNotDisturb = () => {
  const [enabled, setEnabled] = useState(false);
  const [schedule, setSchedule] = useState({
    start: '22:00',
    end: '07:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  });
  const [exceptions, setExceptions] = useState({
    emergency: true,
    urgent: true,
    contacts: []
  });
  const [customMessage, setCustomMessage] = useState('');

  const daysOfWeek = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' }
  ];

  const toggleDay = (day) => {
    if (schedule.days.includes(day)) {
      setSchedule({...schedule, days: schedule.days.filter(d => d !== day)});
    } else {
      setSchedule({...schedule, days: [...schedule.days, day]});
    }
  };

  return (
    <div className="do-not-disturb">
      <div className="settings-header">
        <h2>Do Not Disturb</h2>
        <p>Manage quiet hours and notification preferences</p>
      </div>

      <div className="dnd-toggle">
        <div className="toggle-info">
          <div className="toggle-icon">🔕</div>
          <div>
            <h3>Do Not Disturb Mode</h3>
            <p>Silence notifications during specified hours</p>
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
          <div className="schedule-section">
            <h3>Schedule</h3>
            <div className="time-range">
              <div className="time-input">
                <label>Start Time</label>
                <input
                  type="time"
                  value={schedule.start}
                  onChange={(e) => setSchedule({...schedule, start: e.target.value})}
                />
              </div>
              <span className="time-separator">to</span>
              <div className="time-input">
                <label>End Time</label>
                <input
                  type="time"
                  value={schedule.end}
                  onChange={(e) => setSchedule({...schedule, end: e.target.value})}
                />
              </div>
            </div>

            <div className="days-selector">
              <label>Active Days</label>
              <div className="days-grid">
                {daysOfWeek.map(day => (
                  <button
                    key={day.value}
                    className={`day-btn ${schedule.days.includes(day.value) ? 'active' : ''}`}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="exceptions-section">
            <h3>Exceptions</h3>
            <div className="exception-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exceptions.emergency}
                  onChange={(e) => setExceptions({...exceptions, emergency: e.target.checked})}
                />
                Allow emergency alerts
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exceptions.urgent}
                  onChange={(e) => setExceptions({...exceptions, urgent: e.target.checked})}
                />
                Allow urgent messages from contacts
              </label>
            </div>
          </div>

          <div className="message-section">
            <h3>Auto-Reply Message</h3>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Auto-reply message for contacts during DND hours"
              rows={3}
            />
            <div className="message-preview">
              <strong>Preview:</strong>
              <p>{customMessage || 'I\'m currently in Do Not Disturb mode. I\'ll get back to you soon.'}</p>
            </div>
          </div>

          <button className="save-btn">Save Settings</button>
        </>
      )}

      <style jsx>{`
        .do-not-disturb {
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

        .dnd-toggle {
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
          background-color: #28a745;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .schedule-section, .exceptions-section, .message-section {
          margin-bottom: 24px;
        }

        .schedule-section h3, .exceptions-section h3, .message-section h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .time-range {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .time-input {
          flex: 1;
        }

        .time-input label {
          display: block;
          margin-bottom: 5px;
          color: #666;
          font-size: 12px;
        }

        .time-input input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .time-separator {
          color: #666;
        }

        .days-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .day-btn {
          padding: 8px 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .day-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .exception-options {
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

        .message-section textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: vertical;
          margin-bottom: 10px;
        }

        .message-preview {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
        }

        .message-preview strong {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .message-preview p {
          margin: 0;
          color: #333;
          font-style: italic;
        }

        .save-btn {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DoNotDisturb;
