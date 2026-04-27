import React, { useState } from 'react';

const DataExports = () => {
  const [exportType, setExportType] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [format, setFormat] = useState('json');
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, date: '2024-01-15', type: 'All Data', format: 'JSON', size: '2.3 MB', status: 'Completed' },
    { id: 2, date: '2024-01-10', type: 'Cases Only', format: 'PDF', size: '856 KB', status: 'Completed' }
  ]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const newExport = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: exportType === 'all' ? 'All Data' : exportType === 'cases' ? 'Cases Only' : 'Reports Only',
        format: format.toUpperCase(),
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        status: 'Completed'
      };
      setExportHistory([newExport, ...exportHistory]);
      setExporting(false);
      alert('Export completed! Your file is ready for download.');
    }, 3000);
  };

  return (
    <div className="data-exports">
      <div className="settings-header">
        <h2>Data Exports</h2>
        <p>Download your personal data in various formats</p>
      </div>

      <div className="export-options">
        <h3>Export Settings</h3>
        
        <div className="option-group">
          <label>Data to Export</label>
          <select value={exportType} onChange={(e) => setExportType(e.target.value)}>
            <option value="all">All Data</option>
            <option value="cases">Cases Only</option>
            <option value="reports">Reports Only</option>
            <option value="evidence">Evidence Only</option>
          </select>
        </div>

        <div className="option-group">
          <label>Date Range</label>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        <div className="option-group">
          <label>Export Format</label>
          <div className="format-options">
            <label className="radio-label">
              <input
                type="radio"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value)}
              />
              JSON (Machine Readable)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value)}
              />
              CSV (Spreadsheet)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="pdf"
                checked={format === 'pdf'}
                onChange={(e) => setFormat(e.target.value)}
              />
              PDF (Human Readable)
            </label>
          </div>
        </div>

        <button onClick={handleExport} disabled={exporting} className="export-btn">
          {exporting ? 'Preparing Export...' : 'Start Export'}
        </button>
      </div>

      <div className="export-history">
        <h3>Export History</h3>
        <div className="history-list">
          {exportHistory.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-icon">📥</div>
              <div className="history-info">
                <div className="history-type">{item.type} - {item.format}</div>
                <div className="history-date">{item.date} • {item.size}</div>
              </div>
              <div className="history-status">{item.status}</div>
              <button className="download-btn">Download</button>
            </div>
          ))}
        </div>
      </div>

      <div className="privacy-note">
        <div className="note-icon">🔒</div>
        <div className="note-text">
          Your data is encrypted during export. Exports expire after 7 days for security.
        </div>
      </div>

      <style jsx>{`
        .data-exports {
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

        .export-options {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .export-options h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .option-group {
          margin-bottom: 20px;
        }

        .option-group label {
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-weight: 500;
        }

        .option-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .date-range {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .date-range input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .format-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .export-btn {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        .export-history {
          margin-top: 24px;
        }

        .export-history h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .history-icon {
          font-size: 24px;
        }

        .history-info {
          flex: 1;
        }

        .history-type {
          font-weight: 500;
          color: #333;
        }

        .history-date {
          font-size: 11px;
          color: #999;
        }

        .history-status {
          color: #28a745;
          font-size: 12px;
        }

        .download-btn {
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
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

export default DataExports;
