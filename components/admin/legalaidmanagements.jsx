import React, { useState, useEffect } from 'react';

const LegalAidManagement = () => {
  const [cases, setCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddCase, setShowAddCase] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const mockCases = [
      {
        id: 1,
        caseNumber: 'LA-2024-001',
        clientName: 'Ramesh Kumar',
        type: 'Domestic Violence',
        status: 'Open',
        priority: 'High',
        assignedLawyer: null,
        filedDate: '2024-01-10',
        description: 'Client seeking protection order against spouse',
        documents: ['Police Report', 'Medical Records'],
        hearingDate: '2024-02-15'
      },
      {
        id: 2,
        caseNumber: 'LA-2024-002',
        clientName: 'Sunita Devi',
        type: 'Property Dispute',
        status: 'In Progress',
        priority: 'Medium',
        assignedLawyer: 'Adv. Sharma',
        filedDate: '2024-01-05',
        description: 'Dispute regarding inherited property',
        documents: ['Property Deeds', 'Will'],
        hearingDate: '2024-02-20'
      },
      {
        id: 3,
        caseNumber: 'LA-2024-003',
        clientName: 'Amit Patel',
        type: 'Cyber Crime',
        status: 'Pending',
        priority: 'High',
        assignedLawyer: null,
        filedDate: '2024-01-12',
        description: 'Online fraud case',
        documents: ['Transaction Records', 'Email Screenshots'],
        hearingDate: '2024-02-10'
      }
    ];

    const mockLawyers = [
      { id: 1, name: 'Adv. Meera Singh', specialization: 'Family Law', experience: '10 years', casesHandled: 45, available: true },
      { id: 2, name: 'Adv. Rajesh Gupta', specialization: 'Criminal Law', experience: '15 years', casesHandled: 78, available: true },
      { id: 3, name: 'Adv. Priya Sharma', specialization: 'Cyber Law', experience: '8 years', casesHandled: 32, available: false },
      { id: 4, name: 'Adv. Vikram Malhotra', specialization: 'Property Law', experience: '12 years', casesHandled: 56, available: true }
    ];

    setCases(mockCases);
    setLawyers(mockLawyers);
  };

  const assignLawyer = (caseId, lawyerId) => {
    const lawyer = lawyers.find(l => l.id === lawyerId);
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, assignedLawyer: lawyer.name, status: 'In Progress' } : c
    ));
    setShowAssignModal(false);
    alert(`Case assigned to ${lawyer.name}`);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return '#007bff';
      case 'In Progress': return '#ffc107';
      case 'Pending': return '#fd7e14';
      case 'Closed': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="legal-aid-management">
      <div className="management-header">
        <h2>Legal Aid Management</h2>
        <p>Manage legal cases, lawyers, and client assistance</p>
        <button onClick={() => setShowAddCase(true)} className="add-case-btn">+ New Case</button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{cases.length}</div>
          <div className="stat-label">Total Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cases.filter(c => c.status === 'Open').length}</div>
          <div className="stat-label">Open Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cases.filter(c => c.priority === 'High').length}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{lawyers.length}</div>
          <div className="stat-label">Available Lawyers</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>
          Cases
        </button>
        <button className={`tab ${activeTab === 'lawyers' ? 'active' : ''}`} onClick={() => setActiveTab('lawyers')}>
          Lawyers
        </button>
        <button className={`tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          Hearing Schedule
        </button>
      </div>

      {activeTab === 'cases' && (
        <div className="cases-list">
          {cases.map(caseItem => (
            <div key={caseItem.id} className="case-card" onClick={() => setSelectedCase(caseItem)}>
              <div className="case-header">
                <div className="case-number">{caseItem.caseNumber}</div>
                <div className="case-status" style={{ backgroundColor: getStatusColor(caseItem.status) }}>
                  {caseItem.status}
                </div>
              </div>
              <div className="case-client">Client: {caseItem.clientName}</div>
              <div className="case-type">Type: {caseItem.type}</div>
              <div className="case-priority" style={{ color: getPriorityColor(caseItem.priority) }}>
                Priority: {caseItem.priority}
              </div>
              {caseItem.assignedLawyer ? (
                <div className="case-lawyer">Lawyer: {caseItem.assignedLawyer}</div>
              ) : (
                <button className="assign-btn" onClick={(e) => { e.stopPropagation(); setSelectedCase(caseItem); setShowAssignModal(true); }}>
                  Assign Lawyer
                </button>
              )}
              <div className="case-date">Filed: {caseItem.filedDate}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lawyers' && (
        <div className="lawyers-list">
          {lawyers.map(lawyer => (
            <div key={lawyer.id} className="lawyer-card">
              <div className="lawyer-avatar">⚖️</div>
              <div className="lawyer-info">
                <h4>{lawyer.name}</h4>
                <p className="lawyer-specialization">{lawyer.specialization}</p>
                <p className="lawyer-experience">Experience: {lawyer.experience}</p>
                <p className="lawyer-cases">Cases Handled: {lawyer.casesHandled}</p>
                <div className={`lawyer-status ${lawyer.available ? 'available' : 'busy'}`}>
                  {lawyer.available ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <button className="contact-btn">Contact</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="schedule-list">
          {cases.filter(c => c.hearingDate).map(caseItem => (
            <div key={caseItem.id} className="schedule-card">
              <div className="schedule-date">📅 {caseItem.hearingDate}</div>
              <div className="schedule-case">{caseItem.caseNumber} - {caseItem.clientName}</div>
              <div className="schedule-type">{caseItem.type}</div>
              <div className="schedule-lawyer">{caseItem.assignedLawyer || 'Unassigned'}</div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Lawyer Modal */}
      {showAssignModal && selectedCase && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Lawyer - {selectedCase.caseNumber}</h3>
            <div className="lawyer-list">
              {lawyers.filter(l => l.available).map(lawyer => (
                <div key={lawyer.id} className="lawyer-option" onClick={() => assignLawyer(selectedCase.id, lawyer.id)}>
                  <div className="lawyer-name">{lawyer.name}</div>
                  <div className="lawyer-spec">{lawyer.specialization}</div>
                  <div className="lawyer-exp">{lawyer.experience}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAssignModal(false)} className="close-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && !showAssignModal && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="case-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Case Details: {selectedCase.caseNumber}</h3>
            <div className="detail-section">
              <label>Client:</label>
              <p>{selectedCase.clientName}</p>
            </div>
            <div className="detail-section">
              <label>Type:</label>
              <p>{selectedCase.type}</p>
            </div>
            <div className="detail-section">
              <label>Description:</label>
              <p>{selectedCase.description}</p>
            </div>
            <div className="detail-section">
              <label>Documents:</label>
              <ul>
                {selectedCase.documents.map((doc, i) => <li key={i}>{doc}</li>)}
              </ul>
            </div>
            <div className="detail-section">
              <label>Hearing Date:</label>
              <p>{selectedCase.hearingDate || 'Not scheduled'}</p>
            </div>
            <button onClick={() => setSelectedCase(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .legal-aid-management {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .management-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .management-header h2 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 28px;
        }

        .management-header p {
          margin: 0;
          color: #666;
        }

        .add-case-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .stats-cards {
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

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
        }

        .tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .cases-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .case-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .case-card:hover {
          transform: translateY(-2px);
        }

        .case-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .case-number {
          font-weight: bold;
          color: #007bff;
        }

        .case-status {
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 12px;
        }

        .assign-btn {
          margin: 10px 0;
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .lawyers-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .lawyer-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .lawyer-avatar {
          font-size: 48px;
        }

        .lawyer-info {
          flex: 1;
        }

        .lawyer-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .lawyer-specialization {
          color: #007bff;
          margin-bottom: 5px;
        }

        .lawyer-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 5px;
        }

        .lawyer-status.available {
          background: #d4edda;
          color: #155724;
        }

        .lawyer-status.busy {
          background: #f8d7da;
          color: #721c24;
        }

        .contact-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          height: fit-content;
        }

        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .schedule-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
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

        .assign-modal, .case-detail-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
        }

        .lawyer-option {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .lawyer-option:hover {
          background: #f8f9fa;
        }

        .detail-section {
          margin-bottom: 15px;
        }

        .detail-section label {
          font-weight: bold;
          color: #666;
          display: block;
          margin-bottom: 5px;
        }

        .close-btn {
          margin-top: 20px;
          padding: 10px;
          width: 100%;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default LegalAidManagement;
