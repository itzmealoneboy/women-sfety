import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Incident Report - Theft',
        reportId: 'RPT-2024-001',
        date: '2024-01-15',
        status: 'Approved',
        type: 'incident',
        description: 'Detailed report of theft incident at downtown location',
        attachments: 3,
        officer: 'Officer Smith',
        comments: 'Report reviewed and approved'
      },
      {
        id: 2,
        title: 'Cyber Crime Analysis',
        reportId: 'RPT-2024-002',
        date: '2024-01-14',
        status: 'Pending',
        type: 'analysis',
        description: 'Preliminary analysis of cyber crime evidence',
        attachments: 5,
        officer: 'Detective Williams',
        comments: 'Awaiting forensic analysis'
      },
      {
        id: 3,
        title: 'Witness Statement Summary',
        reportId: 'RPT-2024-003',
        date: '2024-01-13',
        status: 'Approved',
        type: 'statement',
        description: 'Summary of witness testimonies',
        attachments: 2,
        officer: 'Officer Davis',
        comments: 'Approved for case file'
      }
    ];
    setReports(mockReports);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredReports = filterType === 'all' ? reports : reports.filter(r => r.type === filterType);

  return (
    <div className="my-reports">
      <div className="page-header">
        <div>
          <h2>My Reports</h2>
          <p>Access and manage all your submitted reports</p>
        </div>
        <button 
          className="new-report-btn"
          onClick={() => navigate('/records/new-complaint')}
        >
          + Create New Report
        </button>
      </div>

      <div className="filters">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Reports</option>
          <option value="incident">Incident Reports</option>
          <option value="analysis">Analysis Reports</option>
          <option value="statement">Statements</option>
        </select>
      </div>

      <div className="reports-list">
        {filteredReports.map(report => (
          <div key={report.id} className="report-card" onClick={() => setSelectedReport(report)}>
            <div className="report-header">
              <div className="report-title">{report.title}</div>
              <div className="report-status" style={{ backgroundColor: getStatusColor(report.status) }}>
                {report.status}
              </div>
            </div>
            <div className="report-meta">
              <span>ID: {report.reportId}</span>
              <span>Date: {report.date}</span>
              <span>Type: {report.type}</span>
              <span>Attachments: {report.attachments}</span>
            </div>
            <p className="report-description">{report.description}</p>
            <div className="report-footer">
              <span>Officer: {report.officer}</span>
              <button className="view-btn">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedReport(null)}>×</button>
            <h3>{selectedReport.title}</h3>
            <div className="report-details">
              <div><strong>Report ID:</strong> {selectedReport.reportId}</div>
              <div><strong>Date:</strong> {selectedReport.date}</div>
              <div><strong>Status:</strong> <span style={{ color: getStatusColor(selectedReport.status) }}>{selectedReport.status}</span></div>
              <div><strong>Type:</strong> {selectedReport.type}</div>
              <div><strong>Officer:</strong> {selectedReport.officer}</div>
              <div><strong>Description:</strong> {selectedReport.description}</div>
              <div><strong>Comments:</strong> {selectedReport.comments}</div>
              <div><strong>Attachments:</strong> {selectedReport.attachments} files</div>
            </div>
            <div className="modal-actions">
              <button className="download-btn">Download Report</button>
              <button className="print-btn">Print</button>
              <button className="share-btn">Share</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .my-reports {
          padding: 30px;
          background: #0f172a;
          min-height: 100vh;
          color: white;
        }

        .page-header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(to right, #a855f7, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .new-report-btn {
          padding: 12px 24px;
          background: linear-gradient(to right, #9333ea, #2563eb);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
        }

        .new-report-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(147, 51, 234, 0.4);
        }

        .filters select {
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #94a3b8;
          outline: none;
        }

        .reports-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .report-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .report-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateY(-5px);
        }

        .report-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .report-status {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .report-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 11px;
          color: #64748b;
          margin: 15px 0;
          font-weight: 600;
        }

        .report-description {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .view-btn {
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
        }

        .report-modal {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 24px;
          padding: 40px;
        }

        .download-btn { background: #10b981; }
        .print-btn { background: #3b82f6; }
        .share-btn { background: #64748b; }
      `}</style>
    </div>
  );
};

export default MyReports;
