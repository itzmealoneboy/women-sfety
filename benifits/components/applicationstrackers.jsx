import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ApplicationsTracker = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    inReview: 0
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const mockApplications = [
        {
          id: 1,
          schemeName: 'Pradhan Mantri Awas Yojana',
          applicationId: 'PMAY-2024-001234',
          dateSubmitted: '2024-01-15',
          status: 'Approved',
          statusColor: '#28a745',
          amount: 250000,
          documents: ['Aadhaar', 'Income Certificate', 'Property Documents'],
          progress: 100,
          remarks: 'Application approved. Funds will be disbursed within 30 days.',
          nextSteps: 'Verify bank account details for disbursement',
          timeline: [
            { stage: 'Application Submitted', date: '2024-01-15', status: 'completed' },
            { stage: 'Document Verification', date: '2024-01-20', status: 'completed' },
            { stage: 'Field Inspection', date: '2024-01-25', status: 'completed' },
            { stage: 'Approval', date: '2024-02-01', status: 'completed' }
          ]
        },
        {
          id: 2,
          schemeName: 'PM Kisan Samman Nidhi',
          applicationId: 'PMK-2024-005678',
          dateSubmitted: '2024-01-10',
          status: 'Pending',
          statusColor: '#ffc107',
          amount: 6000,
          documents: ['Land Records', 'Aadhaar', 'Bank Account'],
          progress: 60,
          remarks: 'Document verification in progress',
          nextSteps: 'Submit additional land records if requested',
          timeline: [
            { stage: 'Application Submitted', date: '2024-01-10', status: 'completed' },
            { stage: 'Document Verification', date: '2024-01-15', status: 'in-progress' },
            { stage: 'Field Inspection', date: 'Pending', status: 'pending' },
            { stage: 'Approval', date: 'Pending', status: 'pending' }
          ]
        },
        {
          id: 3,
          schemeName: 'Ayushman Bharat Scheme',
          applicationId: 'AB-PMJAY-2024-009876',
          dateSubmitted: '2024-01-05',
          status: 'Approved',
          statusColor: '#28a745',
          amount: 500000,
          documents: ['Aadhaar', 'Ration Card', 'Income Certificate'],
          progress: 100,
          remarks: 'Health card generated successfully',
          nextSteps: 'Download e-card and visit empaneled hospital',
          timeline: [
            { stage: 'Application Submitted', date: '2024-01-05', status: 'completed' },
            { stage: 'Eligibility Check', date: '2024-01-08', status: 'completed' },
            { stage: 'Document Verification', date: '2024-01-10', status: 'completed' },
            { stage: 'Card Generation', date: '2024-01-12', status: 'completed' }
          ]
        },
        {
          id: 4,
          schemeName: 'National Scholarship Portal',
          applicationId: 'NSP-2024-003456',
          dateSubmitted: '2024-01-20',
          status: 'In Review',
          statusColor: '#17a2b8',
          amount: 25000,
          documents: ['Marksheet', 'Income Certificate', 'Caste Certificate'],
          progress: 40,
          remarks: 'Academic records verification pending',
          nextSteps: 'Submit original documents for verification',
          timeline: [
            { stage: 'Application Submitted', date: '2024-01-20', status: 'completed' },
            { stage: 'Document Verification', date: 'Pending', status: 'pending' },
            { stage: 'Institution Approval', date: 'Pending', status: 'pending' },
            { stage: 'Disbursement', date: 'Pending', status: 'pending' }
          ]
        },
        {
          id: 5,
          schemeName: 'Startup India Scheme',
          applicationId: 'SIS-2024-007890',
          dateSubmitted: '2023-12-20',
          status: 'Rejected',
          statusColor: '#dc3545',
          amount: 0,
          documents: ['Business Plan', 'Registration Certificate', 'Project Report'],
          progress: 100,
          remarks: 'Business plan does not meet eligibility criteria',
          nextSteps: 'Reapply with revised business plan',
          timeline: [
            { stage: 'Application Submitted', date: '2023-12-20', status: 'completed' },
            { stage: 'Document Verification', date: '2023-12-25', status: 'completed' },
            { stage: 'Expert Review', date: '2024-01-05', status: 'completed' },
            { stage: 'Final Decision', date: '2024-01-10', status: 'rejected' }
          ]
        }
      ];

      // Calculate stats
      const total = mockApplications.length;
      const approved = mockApplications.filter(a => a.status === 'Approved').length;
      const pending = mockApplications.filter(a => a.status === 'Pending').length;
      const rejected = mockApplications.filter(a => a.status === 'Rejected').length;
      const inReview = mockApplications.filter(a => a.status === 'In Review').length;

      // Generate timeline data
      const timelineData = [
        { month: 'Oct', applications: 2, approvals: 1 },
        { month: 'Nov', applications: 3, approvals: 2 },
        { month: 'Dec', applications: 4, approvals: 2 },
        { month: 'Jan', applications: 5, approvals: 3 },
        { month: 'Feb', applications: 3, approvals: 2 }
      ];

      setApplications(mockApplications);
      setStats({ total, approved, pending, rejected, inReview });
      setTimeline(timelineData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Approved': { icon: '✓', color: '#28a745' },
      'Pending': { icon: '⏳', color: '#ffc107' },
      'Rejected': { icon: '✗', color: '#dc3545' },
      'In Review': { icon: '🔄', color: '#17a2b8' }
    };
    return badges[status] || { icon: '•', color: '#6c757d' };
  };

  return (
    <div className="applications-tracker">
      <div className="tracker-header">
        <h2>Applications Tracker</h2>
        <p>Track and manage all your scheme applications in one place</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card review">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <div className="stat-value">{stats.inReview}</div>
            <div className="stat-label">In Review</div>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">✗</div>
          <div className="stat-info">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Application Timeline Chart */}
      <div className="timeline-chart">
        <h3>Application Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="applications" fill="#007bff" name="Applications Submitted" />
            <Bar dataKey="approvals" fill="#28a745" name="Applications Approved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by scheme name or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="status-filters">
          <button className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`} onClick={() => setSelectedStatus('all')}>
            All
          </button>
          <button className={`filter-btn ${selectedStatus === 'Approved' ? 'active' : ''}`} onClick={() => setSelectedStatus('Approved')}>
            Approved
          </button>
          <button className={`filter-btn ${selectedStatus === 'Pending' ? 'active' : ''}`} onClick={() => setSelectedStatus('Pending')}>
            Pending
          </button>
          <button className={`filter-btn ${selectedStatus === 'In Review' ? 'active' : ''}`} onClick={() => setSelectedStatus('In Review')}>
            In Review
          </button>
          <button className={`filter-btn ${selectedStatus === 'Rejected' ? 'active' : ''}`} onClick={() => setSelectedStatus('Rejected')}>
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading applications...</div>
      ) : (
        <div className="applications-list">
          {getFilteredApplications().map(app => {
            const statusBadge = getStatusBadge(app.status);
            return (
              <div key={app.id} className="application-card" onClick={() => setSelectedApp(app)}>
                <div className="card-header">
                  <div className="scheme-info">
                    <h3>{app.schemeName}</h3>
                    <p className="app-id">ID: {app.applicationId}</p>
                  </div>
                  <div className="status-badge" style={{ backgroundColor: statusBadge.color }}>
                    {statusBadge.icon} {app.status}
                  </div>
                </div>
                
                <div className="card-details">
                  <div className="detail">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{app.dateSubmitted}</span>
                  </div>
                  {app.amount > 0 && (
                    <div className="detail">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">₹{app.amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="progress-section">
                    <span className="progress-label">Progress:</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${app.progress}%`, backgroundColor: statusBadge.color }} />
                    </div>
                    <span className="progress-value">{app.progress}%</span>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="documents">
                    <span className="doc-label">Documents:</span>
                    <span className="doc-list">{app.documents.join(', ')}</span>
                  </div>
                  <button className="view-details">View Details →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedApp(null)}>×</button>
            <div className="modal-header">
              <h2>{selectedApp.schemeName}</h2>
              <div className="status-badge-large" style={{ backgroundColor: getStatusBadge(selectedApp.status).color }}>
                {getStatusBadge(selectedApp.status).icon} {selectedApp.status}
              </div>
            </div>
            
            <div className="modal-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Application ID</label>
                  <p>{selectedApp.applicationId}</p>
                </div>
                <div className="info-item">
                  <label>Date Submitted</label>
                  <p>{selectedApp.dateSubmitted}</p>
                </div>
                {selectedApp.amount > 0 && (
                  <div className="info-item">
                    <label>Amount</label>
                    <p>₹{selectedApp.amount.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="timeline-section">
                <h3>Application Timeline</h3>
                <div className="timeline-steps">
                  {selectedApp.timeline.map((step, index) => (
                    <div key={index} className={`timeline-step ${step.status}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-stage">{step.stage}</div>
                        <div className="timeline-date">{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="remarks-section">
                <h3>Remarks</h3>
                <p>{selectedApp.remarks}</p>
              </div>

              <div className="next-steps">
                <h3>Next Steps</h3>
                <p>{selectedApp.nextSteps}</p>
              </div>

              <div className="documents-section">
                <h3>Documents Submitted</h3>
                <ul>
                  {selectedApp.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-actions">
                <button className="btn-track">Track Application</button>
                <button className="btn-download">Download Application</button>
                <button className="btn-contact">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .applications-tracker {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .tracker-header {
          margin-bottom: 30px;
        }

        .tracker-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .tracker-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
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
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .stat-card.approved .stat-value { color: #28a745; }
        .stat-card.pending .stat-value { color: #ffc107; }
        .stat-card.review .stat-value { color: #17a2b8; }
        .stat-card.rejected .stat-value { color: #dc3545; }

        .timeline-chart {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .timeline-chart h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .filters-section {
          margin-bottom: 30px;
        }

        .search-box {
          position: relative;
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .status-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f0f0f0;
        }

        .filter-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .applications-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .application-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .application-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .scheme-info h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 18px;
        }

        .app-id {
          margin: 0;
          font-size: 12px;
          color: #999;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .card-details {
          margin-bottom: 15px;
        }

        .detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .detail-label {
          color: #666;
        }

        .detail-value {
          font-weight: 500;
          color: #333;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .progress-label {
          font-size: 14px;
          color: #666;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-value {
          font-size: 12px;
          color: #666;
        }

        .card-footer {
          border-top: 1px solid #e0e0e0;
          padding-top: 15px;
        }

        .documents {
          margin-bottom: 10px;
        }

        .doc-label {
          font-size: 12px;
          color: #666;
          margin-right: 8px;
        }

        .doc-list {
          font-size: 12px;
          color: #333;
        }

        .view-details {
          width: 100%;
          padding: 8px;
          background: none;
          border: 1px solid #007bff;
          border-radius: 6px;
          color: #007bff;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-details:hover {
          background: #007bff;
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

        .application-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 700px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .status-badge-large {
          padding: 6px 16px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .info-item label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .info-item p {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .timeline-section, .remarks-section, .next-steps, .documents-section {
          margin-bottom: 25px;
        }

        .timeline-section h3, .remarks-section h3, .next-steps h3, .documents-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .timeline-steps {
          position: relative;
          padding-left: 30px;
        }

        .timeline-step {
          position: relative;
          padding-bottom: 25px;
        }

        .timeline-step:last-child {
          padding-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -22px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e0e0e0;
          top: 4px;
        }

        .timeline-step.completed .timeline-dot {
          background: #28a745;
        }

        .timeline-step.in-progress .timeline-dot {
          background: #ffc107;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        .timeline-stage {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .timeline-date {
          font-size: 12px;
          color: #999;
        }

        .remarks-section p, .next-steps p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .documents-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .documents-section li {
          margin-bottom: 5px;
          color: #666;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-track, .btn-download, .btn-contact {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-track {
          background: #007bff;
          color: white;
        }

        .btn-download {
          background: #28a745;
          color: white;
        }

        .btn-contact {
          background: #6c757d;
          color: white;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .applications-list {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationsTracker;
