import React, { useState } from 'react';

const AnonymousReporting = () => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [anonymousId, setAnonymousId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);

  const generateAnonymousId = () => {
    const id = 'ANON-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setAnonymousId(id);
    return id;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReport = {
      id: Date.now(),
      type: reportType,
      description,
      location,
      anonymousId: anonymousId || generateAnonymousId(),
      timestamp: new Date(),
      status: 'Under Review'
    };
    
    setReportHistory([newReport, ...reportHistory]);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setReportType('');
      setDescription('');
      setLocation('');
    }, 3000);
  };

  const reportTypes = [
    'Harassment', 'Bullying', 'Cyber Crime', 'Domestic Violence',
    'Discrimination', 'Fraud', 'Safety Concern', 'Other'
  ];

  return (
    <div className="anonymous-reporting">
      <div className="reporting-header">
        <h2>Anonymous Reporting</h2>
        <p>Report incidents safely and securely - Your identity remains completely anonymous</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Type of Incident *</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} required>
              <option value="">Select report type</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the incident in detail..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Location (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did this occur?"
            />
          </div>

          <div className="form-group">
            <label>Upload Evidence (Optional)</label>
            <input type="file" accept="image/*,application/pdf" />
            <small className="file-hint">Supported: Images, PDF (Max 10MB)</small>
          </div>

          <div className="privacy-note">
            <div className="note-icon">🔒</div>
            <div className="note-text">
              <strong>Your report is completely anonymous</strong>
              <p>We do not track IP addresses or any identifying information. Your identity is protected.</p>
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Anonymous Report</button>
        </form>
      ) : (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Report Submitted Successfully</h3>
          <p>Your anonymous ID: <strong>{anonymousId}</strong></p>
          <p>Save this ID to track your report status. We will never ask for your identity.</p>
          <button onClick={() => setSubmitted(false)} className="new-report-btn">
            Submit Another Report
          </button>
        </div>
      )}

      {reportHistory.length > 0 && (
        <div className="report-history">
          <h3>Your Report History</h3>
          <div className="history-list">
            {reportHistory.map(report => (
              <div key={report.id} className="history-item">
                <div className="history-header">
                  <span className="history-type">{report.type}</span>
                  <span className="history-status">{report.status}</span>
                </div>
                <div className="history-date">{report.timestamp.toLocaleString()}</div>
                <div className="history-id">ID: {report.anonymousId}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .anonymous-reporting {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .reporting-header {
          margin-bottom: 30px;
        }

        .reporting-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .reporting-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .report-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group select,
        .form-group textarea,
        .form-group input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
        }

        .file-hint {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: #999;
        }

        .privacy-note {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .note-icon {
          font-size: 32px;
        }

        .note-text strong {
          display: block;
          margin-bottom: 5px;
          color: #007bff;
        }

        .note-text p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #218838;
        }

        .success-message {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin: 0 auto 20px;
        }

        .new-report-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .report-history {
          margin-top: 40px;
        }

        .report-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .history-type {
          font-weight: bold;
          color: #333;
        }

        .history-status {
          color: #ffc107;
          font-size: 12px;
        }

        .history-date, .history-id {
          font-size: 12px;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default AnonymousReporting;
