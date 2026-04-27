import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myrecordshub.css';

const MyRecordsHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cases');
  const [cases, setCases] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statistics, setStatistics] = useState({
    totalCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    pendingComplaints: 0,
    totalDocuments: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - Replace with actual API calls
      const mockCases = [
        {
          id: 1,
          caseNumber: 'CR-2024-001',
          type: 'Domestic Violence',
          status: 'Active',
          severity: 'High',
          filedDate: '2024-01-10',
          lastUpdate: '2024-04-19',
          officer: 'Officer Smith',
          progress: 65,
          description: 'Ongoing harassment and domestic violence case',
          nextHearing: '2024-04-25'
        },
        {
          id: 2,
          caseNumber: 'CR-2024-002',
          type: 'Cyber Crime',
          status: 'Under Investigation',
          severity: 'Medium',
          filedDate: '2024-01-05',
          lastUpdate: '2024-04-18',
          officer: 'Detective Williams',
          progress: 40,
          description: 'Online harassment and cyber threats',
          nextHearing: '2024-05-02'
        },
        {
          id: 3,
          caseNumber: 'CR-2024-003',
          type: 'Sexual Harassment',
          status: 'Resolved',
          severity: 'Critical',
          filedDate: '2023-12-20',
          lastUpdate: '2024-04-10',
          officer: 'Officer Johnson',
          progress: 100,
          description: 'Workplace sexual harassment resolved',
          nextHearing: null
        }
      ];

      const mockComplaints = [
        {
          id: 1,
          complaintId: 'CMP-2024-001',
          title: 'Workplace Harassment',
          type: 'Harassment',
          status: 'Processing',
          severity: 'Medium',
          filedDate: '2024-01-12',
          response: 'Under review by authorities',
          details: 'Repeated unwanted comments and behavior from supervisor',
          attachments: 2
        },
        {
          id: 2,
          complaintId: 'CMP-2024-002',
          title: 'Stalking Incident',
          type: 'Stalking',
          status: 'Investigated',
          severity: 'High',
          filedDate: '2024-01-08',
          response: 'Police investigation ongoing',
          details: 'Person following and monitoring daily activities',
          attachments: 4
        },
        {
          id: 3,
          complaintId: 'CMP-2024-003',
          title: 'Verbal Abuse',
          type: 'Abuse',
          status: 'Resolved',
          severity: 'Low',
          filedDate: '2024-01-15',
          response: 'Complaint resolved - Warning issued',
          details: 'Repeated verbal abuse from neighbor',
          attachments: 1
        }
      ];

      const mockDocuments = [
        {
          id: 1,
          name: 'FIR Report - Case #001',
          type: 'pdf',
          category: 'legal',
          size: '2.4 MB',
          date: '2024-01-15',
          status: 'verified',
          caseNumber: 'CR-2024-001'
        },
        {
          id: 2,
          name: 'Medical Report - Victim Statement',
          type: 'pdf',
          category: 'medical',
          size: '1.8 MB',
          date: '2024-01-14',
          status: 'verified',
          caseNumber: 'CR-2024-001'
        },
        {
          id: 3,
          name: 'Witness Statement - John Doe',
          type: 'doc',
          category: 'statement',
          size: '856 KB',
          date: '2024-01-13',
          status: 'pending',
          caseNumber: 'CR-2024-001'
        }
      ];

      setCases(mockCases);
      setComplaints(mockComplaints);
      setDocuments(mockDocuments);
      setStatistics({
        totalCases: mockCases.length,
        activeCases: mockCases.filter(c => c.status === 'Active').length,
        resolvedCases: mockCases.filter(c => c.status === 'Resolved').length,
        pendingComplaints: mockComplaints.filter(c => c.status === 'Processing').length,
        totalDocuments: mockDocuments.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': '#dc3545',
      'Under Investigation': '#ffc107',
      'Resolved': '#28a745',
      'Processing': '#ffc107',
      'Investigated': '#007bff',
      'pending': '#ffc107',
      'verified': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      'Critical': { bg: '#dc3545', text: 'white' },
      'High': { bg: '#fd7e14', text: 'white' },
      'Medium': { bg: '#ffc107', text: 'black' },
      'Low': { bg: '#28a745', text: 'white' }
    };
    return styles[severity] || { bg: '#6c757d', text: 'white' };
  };

  const filteredCases = cases.filter(c => {
    const matchSearch = c.caseNumber.includes(searchTerm) || c.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const filteredComplaints = complaints.filter(c => {
    const matchSearch = c.complaintId.includes(searchTerm) || c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const handleDownloadReport = (caseNumber) => {
    const link = document.createElement('a');
    link.href = `/reports/${caseNumber}.pdf`;
    link.download = `${caseNumber}_report.pdf`;
    link.click();
  };

  return (
    <div className="records-hub-container">
      {/* Header Section */}
      <div className="hub-header">
        <div className="header-content">
          <h1>📋 My Records Hub</h1>
          <p>Manage all your case records, complaints, and documents in one place</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => navigate('/records/voice-fir')} style={{ backgroundColor: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🎙️</span> Voice FIR
          </button>
          <button className="btn-primary" onClick={() => navigate('/records/new-complaint')}>
            + File New Complaint
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.totalCases}</div>
            <div className="stat-label">Total Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.activeCases}</div>
            <div className="stat-label">Active Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.resolvedCases}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.pendingComplaints}</div>
            <div className="stat-label">Pending Complaints</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.totalDocuments}</div>
            <div className="stat-label">Documents</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => { setActiveTab('cases'); setFilterStatus('all'); setSearchTerm(''); }}
          >
            <span>📋</span> My Cases ({filteredCases.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => { setActiveTab('complaints'); setFilterStatus('all'); setSearchTerm(''); }}
          >
            <span>⚠️</span> My Complaints ({filteredComplaints.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span>📄</span> Documents ({documents.length})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder={activeTab === 'cases' ? 'Search case number or type...' : 'Search complaint...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {activeTab !== 'documents' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              {activeTab === 'cases' && (
                <>
                  <option value="Active">Active</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Resolved">Resolved</option>
                </>
              )}
              {activeTab === 'complaints' && (
                <>
                  <option value="Processing">Processing</option>
                  <option value="Investigated">Investigated</option>
                  <option value="Resolved">Resolved</option>
                </>
              )}
            </select>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : activeTab === 'cases' ? (
          <div className="cases-list">
            {filteredCases.length === 0 ? (
              <div className="empty-state">
                <p>No cases found. <button onClick={() => navigate('/records/new-complaint')}>File a case</button></p>
              </div>
            ) : (
              filteredCases.map(caseItem => (
                <div key={caseItem.id} className="case-card" onClick={() => setSelectedItem(caseItem)}>
                  <div className="card-header">
                    <div className="case-info">
                      <h3>{caseItem.caseNumber}</h3>
                      <p className="case-type">{caseItem.type}</p>
                    </div>
                    <div className="card-badges">
                      <span
                        className="badge status"
                        style={{ backgroundColor: getStatusColor(caseItem.status) }}
                      >
                        {caseItem.status}
                      </span>
                      <span
                        className="badge severity"
                        style={{
                          backgroundColor: getSeverityBadge(caseItem.severity).bg,
                          color: getSeverityBadge(caseItem.severity).text
                        }}
                      >
                        {caseItem.severity}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="description">{caseItem.description}</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${caseItem.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{caseItem.progress}% Complete</span>
                  </div>

                  <div className="card-footer">
                    <div className="date-info">
                      <small>📅 Filed: {new Date(caseItem.filedDate).toLocaleDateString()}</small>
                      <small>👤 {caseItem.officer}</small>
                    </div>
                    <div className="card-actions">
                      <button className="btn-small" onClick={(e) => { e.stopPropagation(); navigate(`/records/case/${caseItem.id}`); }}>View Details</button>
                      <button className="btn-small" onClick={(e) => { e.stopPropagation(); handleDownloadReport(caseItem.caseNumber); }}>📥 Download</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'complaints' ? (
          <div className="complaints-list">
            {filteredComplaints.length === 0 ? (
              <div className="empty-state">
                <p>No complaints found. <button onClick={() => navigate('/records/new-complaint')}>File a complaint</button></p>
              </div>
            ) : (
              filteredComplaints.map(complaint => (
                <div key={complaint.id} className="complaint-card" onClick={() => setSelectedItem(complaint)}>
                  <div className="card-header">
                    <div className="complaint-info">
                      <h3>{complaint.complaintId}</h3>
                      <p className="complaint-title">{complaint.title}</p>
                    </div>
                    <div className="card-badges">
                      <span
                        className="badge status"
                        style={{ backgroundColor: getStatusColor(complaint.status) }}
                      >
                        {complaint.status}
                      </span>
                      <span
                        className="badge severity"
                        style={{
                          backgroundColor: getSeverityBadge(complaint.severity).bg,
                          color: getSeverityBadge(complaint.severity).text
                        }}
                      >
                        {complaint.severity}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="description">{complaint.details}</p>
                    <div className="response-section">
                      <strong>Status Update:</strong>
                      <p>{complaint.response}</p>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="date-info">
                      <small>📅 Filed: {new Date(complaint.filedDate).toLocaleDateString()}</small>
                      <small>📎 {complaint.attachments} attachment(s)</small>
                    </div>
                    <button className="btn-small" onClick={(e) => { e.stopPropagation(); navigate(`/records/complaint/${complaint.id}`); }}>View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="documents-grid">
            {documents.length === 0 ? (
              <div className="empty-state">
                <p>No documents found. <button onClick={() => navigate('/records/upload-document')}>Upload a document</button></p>
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="document-card">
                  <div className="doc-icon">{doc.type === 'pdf' ? '📄' : '📝'}</div>
                  <h4>{doc.name}</h4>
                  <p className="doc-meta">
                    {doc.size} • {new Date(doc.date).toLocaleDateString()}
                  </p>
                  <p className="doc-case">{doc.caseNumber}</p>
                  <div className="doc-status">
                    <span style={{ backgroundColor: getStatusColor(doc.status) }} className="status-badge">
                      {doc.status}
                    </span>
                  </div>
                  <div className="doc-actions">
                    <button className="btn-small">👁️ View</button>
                    <button className="btn-small">📥 Download</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
            
            {/* Case Details Modal */}
            {selectedItem.caseNumber && (
              <>
                <h2>{selectedItem.caseNumber}</h2>
                <div className="modal-details">
                  <div className="detail-row">
                    <strong>Type:</strong> <span>{selectedItem.type}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong> 
                    <span style={{ backgroundColor: getStatusColor(selectedItem.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Severity:</strong>
                    <span style={{
                      backgroundColor: getSeverityBadge(selectedItem.severity).bg,
                      color: getSeverityBadge(selectedItem.severity).text,
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {selectedItem.severity}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Filed Date:</strong> <span>{new Date(selectedItem.filedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Last Update:</strong> <span>{new Date(selectedItem.lastUpdate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Assigned Officer:</strong> <span>{selectedItem.officer}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Progress:</strong>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${selectedItem.progress}%` }}></div>
                    </div>
                    <span>{selectedItem.progress}% Complete</span>
                  </div>
                  {selectedItem.nextHearing && (
                    <div className="detail-row">
                      <strong>Next Hearing:</strong> <span>{new Date(selectedItem.nextHearing).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="detail-row full-width">
                    <strong>Description:</strong>
                    <p>{selectedItem.description}</p>
                  </div>
                </div>
              </>
            )}

            {/* Complaint Details Modal */}
            {selectedItem.complaintId && (
              <>
                <h2>{selectedItem.complaintId}</h2>
                <div className="modal-details">
                  <div className="detail-row">
                    <strong>Title:</strong> <span>{selectedItem.title}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Type:</strong> <span>{selectedItem.type}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <span style={{ backgroundColor: getStatusColor(selectedItem.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Severity:</strong>
                    <span style={{
                      backgroundColor: getSeverityBadge(selectedItem.severity).bg,
                      color: getSeverityBadge(selectedItem.severity).text,
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {selectedItem.severity}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Filed Date:</strong> <span>{new Date(selectedItem.filedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Attachments:</strong> <span>{selectedItem.attachments} file(s)</span>
                  </div>
                  <div className="detail-row full-width">
                    <strong>Details:</strong>
                    <p>{selectedItem.details}</p>
                  </div>
                  <div className="detail-row full-width">
                    <strong>Status Update:</strong>
                    <p>{selectedItem.response}</p>
                  </div>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setSelectedItem(null)}>Close</button>
              {selectedItem.caseNumber && (
                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); handleDownloadReport(selectedItem.caseNumber); }}>📥 Download Report</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecordsHub;
