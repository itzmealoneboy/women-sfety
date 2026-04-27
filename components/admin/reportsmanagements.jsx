import React, { useState, useEffect } from 'react';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const mockReports = [
      {
        id: 1,
        reportId: 'RP-2024-001',
        type: 'Harassment',
        description: 'Received threatening messages online',
        reporter: 'Anonymous',
        date: '2024-01-15',
        status: 'Pending',
        priority: 'High',
        assignedTo: null,
        location: 'Online',
        evidence: ['Screenshots'],
        notes: []
      },
      {
        id: 2,
        reportId: 'RP-2024-002',
        type: 'Fraud',
        description: 'Bank account phishing attempt',
        reporter: 'user123',
        date: '2024-01-14',
        status: 'In Progress',
        priority: 'Critical',
        assignedTo: 'Investigator Smith',
        location: 'Email',
        evidence: ['Email logs', 'Transaction records'],
        notes: ['Contacted bank', 'Frozen account']
      },
      {
        id: 3,
        reportId: 'RP-2024-003',
        type: 'Cyber Bullying',
        description: 'Social media harassment campaign',
        reporter: 'Anonymous',
        date: '2024-01-13',
        status: 'Resolved',
        priority: 'Medium',
        assignedTo: 'Officer Johnson',
        location: 'Social Media',
        evidence: ['Screenshots', 'URLs'],
        notes: ['Suspended accounts', 'Counseling provided']
      }
    ];

    setReports(mockReports);
    updateStats(mockReports);
  };

  const updateStats = (reportsData) => {
    setStats({
      total: reportsData.length,
      pending: reportsData.filter(r => r.status === 'Pending').length,
      resolved: reportsData.filter(r => r.status === 'Resolved').length,
      inProgress: reportsData.filter(r => r.status === 'In Progress').length
    });
  };

  const updateReportStatus = (reportId, newStatus) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: newStatus } : r
    ));
    updateStats(reports);
  };

  const assignReport = (reportId, assignee) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, assignedTo: assignee, status: 'In Progress' } : r
    ));
    updateStats(reports);
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch = report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="reports-management">
      <div className="management-header">
        <h2>Reports Management</h2>
        <p>Manage and process user reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>Pending</button>
          <button className={filter === 'In Progress' ? 'active' : ''} onClick={() => setFilter('In Progress')}>In Progress</button>
          <button className={filter === 'Resolved' ? 'active' : ''} onClick={() => setFilter('Resolved')}>Resolved</button>
        </div>
      </div>

      <div className="reports-list">
        {filteredReports.map(report => (
          <div key={report.id} className={`report-card priority-${report.priority.toLowerCase()}`}>
            <div className="report-header">
              <div className="report-id">{report.reportId}</div>
              <div className={`report-status status-${report.status.toLowerCase().replace(' ', '-')}`}>
                {report.status}
              </div>
            </div>
            <div className="report-type">{report.type}</div>
            <div className="report-description">{report.description}</div>
            <div className="report-meta">
              <span>📅 {report.date}</span>
              <span>👤 {report.reporter}</span>
              <span>📍 {report.location}</span>
              <span className={`priority-badge priority-${report.priority.toLowerCase()}`}>
                {report.priority} Priority
              </span>
            </div>
            {report.assignedTo && (
              <div className="report-assignee">Assigned to: {report.assignedTo}</div>
            )}
            <div className="report-actions">
              <button onClick={() => setSelectedReport(report)} className="btn-view">
                View Details
              </button>
              {report.status === 'Pending' && (
                <button onClick={() => assignReport(report.id, 'Investigator')} className="btn-assign">
                  Assign
                </button>
              )}
              {report.status === 'In Progress' && (
                <button onClick={() => updateReportStatus(report.id, 'Resolved')} className="btn-resolve">
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Report Details: {selectedReport.reportId}</h3>
            <div className="modal-section">
              <label>Type:</label>
              <p>{selectedReport.type}</p>
            </div>
            <div className="modal-section">
              <label>Description:</label>
              <p>{selectedReport.description}</p>
            </div>
            <div className="modal-section">
              <label>Reporter:</label>
              <p>{selectedReport.reporter}</p>
            </div>
            <div className="modal-section">
              <label>Date:</label>
              <p>{selectedReport.date}</p>
            </div>
            <div className="modal-section">
              <label>Location:</label>
              <p>{selectedReport.location}</p>
            </div>
            <div className="modal-section">
              <label>Evidence:</label>
              <ul>
                {selectedReport.evidence.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="modal-section">
              <label>Notes:</label>
              <textarea 
                placeholder="Add investigation notes..."
                rows={3}
                defaultValue={selectedReport.notes?.join('\n')}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedReport(null)} className="btn-close">Close</button>
              <button className="btn-update">Update Status</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reports-management {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .management-header {
          margin-bottom: 30px;
        }

        .management-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
        }

        .filters-section {
          margin-bottom: 30px;
        }

        .search-box {
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .status-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-filters button {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
        }

        .status-filters button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .reports-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .report-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .report-card.priority-critical { border-left-color: #dc3545; }
        .report-card.priority-high { border-left-color: #fd7e14; }
        .report-card.priority-medium { border-left-color: #ffc107; }
        .report-card.priority-low { border-left-color: #28a745; }

        .report-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .report-id {
          font-weight: bold;
          color: #007bff;
        }

        .report-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .status-pending { background: #ffc107; color: #333; }
        .status-in-progress { background: #17a2b8; color: white; }
        .status-resolved { background: #28a745; color: white; }

        .report-type {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .report-description {
          color: #666;
          margin-bottom: 12px;
        }

        .report-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .priority-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }

        .priority-critical { background: #dc3545; color: white; }
        .priority-high { background: #fd7e14; color: white; }
        .priority-medium { background: #ffc107; color: #333; }
        .priority-low { background: #28a745; color: white; }

        .report-assignee {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
        }

        .report-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .btn-view, .btn-assign, .btn-resolve {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-view { background: #007bff; color: white; }
        .btn-assign { background: #ffc107; color: #333; }
        .btn-resolve { background: #28a745; color: white; }

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

        .report-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-section {
          margin-bottom: 15px;
        }

        .modal-section label {
          font-weight: bold;
          color: #666;
          display: block;
          margin-bottom: 5px;
        }

        .modal-section textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-close, .btn-update {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-close { background: #6c757d; color: white; }
        .btn-update { background: #28a745; color: white; }
      `}</style>
    </div>
  );
};

export default ReportsManagement;
