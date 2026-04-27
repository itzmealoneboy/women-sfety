import React, { useState } from 'react';

const CaseSummary = ({ caseData }) => {
  const [expanded, setExpanded] = useState(false);

  const defaultCase = {
    caseNumber: 'CR-2024-001',
    type: 'Theft',
    status: 'Active',
    filedDate: '2024-01-10',
    lastUpdate: '2024-01-15',
    officer: 'Officer Smith',
    description: 'Incident reported at downtown shopping mall. Suspect captured on CCTV.',
    evidence: ['CCTV Footage', 'Witness Statements', 'Recovered Items'],
    witnesses: ['John Doe', 'Jane Smith'],
    timeline: [
      { date: '2024-01-10', action: 'Report Filed' },
      { date: '2024-01-11', action: 'Evidence Collected' },
      { date: '2024-01-12', action: 'Witness Interviewed' },
      { date: '2024-01-15', action: 'Suspect Identified' }
    ]
  };

  const data = caseData || defaultCase;

  return (
    <div className="case-summary">
      <div className="case-header" onClick={() => setExpanded(!expanded)}>
        <div className="case-info">
          <div className="case-number">{data.caseNumber}</div>
          <div className="case-type">{data.type}</div>
          <div className={`case-status ${data.status.toLowerCase()}`}>{data.status}</div>
        </div>
        <div className="expand-icon">{expanded ? '▼' : '▶'}</div>
      </div>

      {expanded && (
        <div className="case-details">
          <div className="detail-row">
            <div className="detail-label">Filed Date:</div>
            <div className="detail-value">{data.filedDate}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Last Update:</div>
            <div className="detail-value">{data.lastUpdate}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Investigating Officer:</div>
            <div className="detail-value">{data.officer}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Description:</div>
            <div className="detail-value">{data.description}</div>
          </div>
          
          <div className="evidence-section">
            <h4>Evidence Collected</h4>
            <ul>
              {data.evidence.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="witnesses-section">
            <h4>Witnesses</h4>
            <ul>
              {data.witnesses.map((witness, i) => (
                <li key={i}>{witness}</li>
              ))}
            </ul>
          </div>

          <div className="timeline-section">
            <h4>Case Timeline</h4>
            <div className="timeline">
              {data.timeline.map((event, i) => (
                <div key={i} className="timeline-event">
                  <div className="timeline-date">{event.date}</div>
                  <div className="timeline-action">{event.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .case-summary {
          background: white;
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .case-header:hover {
          background: #f8f9fa;
        }

        .case-info {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .case-number {
          font-weight: bold;
          color: #007bff;
        }

        .case-type {
          color: #666;
        }

        .case-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .case-status.active {
          background: #28a745;
        }

        .case-status.under-investigation {
          background: #ffc107;
          color: #333;
        }

        .case-status.closed {
          background: #6c757d;
        }

        .expand-icon {
          color: #999;
        }

        .case-details {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }

        .detail-label {
          width: 140px;
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          flex: 1;
          color: #333;
        }

        .evidence-section, .witnesses-section, .timeline-section {
          margin-top: 20px;
        }

        .evidence-section h4, .witnesses-section h4, .timeline-section h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 14px;
        }

        .evidence-section ul, .witnesses-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .evidence-section li, .witnesses-section li {
          margin-bottom: 5px;
          color: #666;
        }

        .timeline {
          position: relative;
          padding-left: 20px;
        }

        .timeline-event {
          position: relative;
          padding-bottom: 12px;
        }

        .timeline-event::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #007bff;
        }

        .timeline-event::after {
          content: '';
          position: absolute;
          left: -16px;
          top: 13px;
          width: 1px;
          height: calc(100% - 8px);
          background: #e0e0e0;
        }

        .timeline-event:last-child::after {
          display: none;
        }

        .timeline-date {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .timeline-action {
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default CaseSummary;
