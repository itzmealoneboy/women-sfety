import React, { useState, useEffect } from 'react';

const EvidenceManagers = () => {
  const [evidence, setEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    const mockEvidence = [
      {
        id: 1,
        itemName: 'Mobile Phone - iPhone 13',
        caseNumber: 'CR-2024-001',
        type: 'digital',
        collectedDate: '2024-01-15',
        status: 'verified',
        chainOfCustody: ['Officer Smith - Collected', 'Lab Tech - Analyzed'],
        location: 'Crime Scene - Downtown',
        description: 'iPhone recovered from suspect',
        hash: 'a3f5c8e9d2b1a4c6e8f9d2b4a6c8e0f2',
        storageLocation: 'Evidence Locker A-12'
      },
      {
        id: 2,
        itemName: 'Laptop - Dell XPS',
        caseNumber: 'CR-2024-001',
        type: 'digital',
        collectedDate: '2024-01-14',
        status: 'pending',
        chainOfCustody: ['Officer Davis - Collected'],
        location: 'Suspect Residence',
        description: 'Personal laptop with potential evidence',
        hash: 'b4f6d9e0c3a2b5d7f0e1c3a5b7d9f1e3',
        storageLocation: 'Evidence Locker A-15'
      },
      {
        id: 3,
        itemName: 'USB Drive - 64GB',
        caseNumber: 'CR-2024-002',
        type: 'digital',
        collectedDate: '2024-01-13',
        status: 'flagged',
        chainOfCustody: ['Detective Williams - Collected', 'Forensic Lab - Processing'],
        location: 'Office Building',
        description: 'USB drive containing suspicious files',
        hash: 'c5e7f0d1e4b3c6e8f0g2d4b6c8e0f2g4',
        storageLocation: 'Forensic Lab'
      }
    ];
    setEvidence(mockEvidence);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return '#28a745';
      case 'pending': return '#ffc107';
      case 'flagged': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="evidence-managers">
      <div className="page-header">
        <h2>Evidence Management</h2>
        <p>Track and manage digital evidence with chain of custody</p>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="evidence-list">
        {filteredEvidence.map(item => (
          <div key={item.id} className="evidence-card" onClick={() => setSelectedEvidence(item)}>
            <div className="evidence-icon">📱</div>
            <div className="evidence-info">
              <div className="evidence-name">{item.itemName}</div>
              <div className="evidence-meta">
                <span>Case: {item.caseNumber}</span>
                <span>Collected: {item.collectedDate}</span>
                <span>Type: {item.type}</span>
              </div>
              <div className="evidence-status" style={{ backgroundColor: getStatusColor(item.status) }}>
                {item.status}
              </div>
            </div>
            <div className="evidence-location">📍 {item.location}</div>
          </div>
        ))}
      </div>

      {selectedEvidence && (
        <div className="modal-overlay" onClick={() => setSelectedEvidence(null)}>
          <div className="evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvidence(null)}>×</button>
            <h3>{selectedEvidence.itemName}</h3>
            <div className="evidence-details">
              <div><strong>Case Number:</strong> {selectedEvidence.caseNumber}</div>
              <div><strong>Type:</strong> {selectedEvidence.type}</div>
              <div><strong>Collected Date:</strong> {selectedEvidence.collectedDate}</div>
              <div><strong>Location:</strong> {selectedEvidence.location}</div>
              <div><strong>Storage:</strong> {selectedEvidence.storageLocation}</div>
              <div><strong>Description:</strong> {selectedEvidence.description}</div>
              <div><strong>Hash:</strong> <code>{selectedEvidence.hash.substring(0, 20)}...</code></div>
            </div>
            <div className="chain-section">
              <h4>Chain of Custody</h4>
              {selectedEvidence.chainOfCustody.map((step, i) => (
                <div key={i} className="chain-step">→ {step}</div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="verify-btn">Verify Chain</button>
              <button className="transfer-btn">Transfer Custody</button>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .evidence-managers {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .page-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .controls-section {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .search-box {
          flex: 1;
        }

        .search-box input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .controls-section select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }

        .evidence-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .evidence-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .evidence-card:hover {
          transform: translateY(-2px);
        }

        .evidence-icon {
          font-size: 48px;
        }

        .evidence-info {
          flex: 1;
        }

        .evidence-name {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .evidence-meta {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .evidence-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
        }

        .evidence-location {
          font-size: 12px;
          color: #999;
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

        .evidence-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
        }

        .modal-close {
          float: right;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .evidence-details {
          margin: 20px 0;
        }

        .evidence-details div {
          margin-bottom: 10px;
        }

        .chain-section {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .chain-step {
          padding: 5px 0;
          font-size: 13px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .verify-btn, .transfer-btn, .report-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .verify-btn { background: #28a745; color: white; }
        .transfer-btn { background: #007bff; color: white; }
        .report-btn { background: #6c757d; color: white; }
      `}</style>
    </div>
  );
};

export default EvidenceManagers;
