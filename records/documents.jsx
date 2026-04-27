import React, { useState, useEffect } from 'react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const mockDocuments = [
      {
        id: 1,
        name: 'FIR Report - Case #001',
        type: 'pdf',
        category: 'legal',
        size: '2.4 MB',
        date: '2024-01-15',
        status: 'verified',
        description: 'First Information Report filed on January 15, 2024',
        hash: 'a3f5c8e9d2b1a4c6e8f9d2b4a6c8e0f2',
        pages: 4,
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
        description: 'Medical examination report and victim statement',
        hash: 'b4f6d9e0c3a2b5d7f0e1c3a5b7d9f1e3',
        pages: 6,
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
        description: 'Witness testimony recorded on January 13',
        hash: 'c5e7f0d1e4b3c6e8f0g2d4b6c8e0f2g4',
        pages: 2,
        caseNumber: 'CR-2024-001'
      },
      {
        id: 4,
        name: 'Forensic Analysis Report',
        type: 'pdf',
        category: 'forensic',
        size: '5.2 MB',
        date: '2024-01-12',
        status: 'verified',
        description: 'Digital forensics analysis results',
        hash: 'd6f8e1f2e5c4d7f9g1h3e5c7d9f1e3g5',
        pages: 12,
        caseNumber: 'CR-2024-002'
      }
    ];
    setDocuments(mockDocuments);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return '#28a745';
      case 'pending': return '#ffc107';
      case 'flagged': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.category === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="documents-page">
      <div className="page-header">
        <h2>Documents</h2>
        <p>Manage and organize case-related documents</p>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-group">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="legal">Legal</option>
            <option value="medical">Medical</option>
            <option value="statement">Statements</option>
            <option value="forensic">Forensic</option>
          </select>
          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>≡</button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="documents-grid">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="document-card" onClick={() => setSelectedDoc(doc)}>
              <div className="doc-icon">{getTypeIcon(doc.type)}</div>
              <div className="doc-info">
                <div className="doc-name">{doc.name}</div>
                <div className="doc-meta">
                  <span>{doc.size}</span>
                  <span>{doc.date}</span>
                  <span>{doc.pages} pages</span>
                </div>
                <div className="doc-status" style={{ backgroundColor: getStatusColor(doc.status) }}>
                  {doc.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="documents-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Date</th>
              <th>Status</th>
              <th>Pages</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                <td className="doc-name-cell">{getTypeIcon(doc.type)} {doc.name}</td>
                <td>{doc.category}</td>
                <td>{doc.size}</td>
                <td>{doc.date}</td>
                <td><span className="status-badge" style={{ backgroundColor: getStatusColor(doc.status) }}>{doc.status}</span></td>
                <td>{doc.pages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDoc(null)}>×</button>
            <div className="doc-preview">
              <div className="preview-icon">{getTypeIcon(selectedDoc.type)}</div>
              <h3>{selectedDoc.name}</h3>
              <p>{selectedDoc.description}</p>
              <div className="doc-details">
                <div><strong>Case Number:</strong> {selectedDoc.caseNumber}</div>
                <div><strong>Pages:</strong> {selectedDoc.pages}</div>
                <div><strong>Size:</strong> {selectedDoc.size}</div>
                <div><strong>Date:</strong> {selectedDoc.date}</div>
                <div><strong>Hash:</strong> <code>{selectedDoc.hash.substring(0, 20)}...</code></div>
              </div>
              <div className="modal-actions">
                <button className="download-btn">Download</button>
                <button className="verify-btn">Verify Hash</button>
                <button className="share-btn">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .documents-page {
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
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          position: relative;
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

        .filter-group {
          display: flex;
          gap: 10px;
        }

        .filter-group select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
        }

        .view-toggle button {
          padding: 12px;
          background: white;
          border: 1px solid #ddd;
          cursor: pointer;
          border-radius: 4px;
        }

        .view-toggle button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .document-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .doc-icon {
          font-size: 48px;
        }

        .doc-info {
          flex: 1;
        }

        .doc-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .doc-meta {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: #999;
          margin-bottom: 8px;
        }

        .doc-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
        }

        .documents-table {
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border-collapse: collapse;
        }

        .documents-table th,
        .documents-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .documents-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #666;
        }

        .documents-table tr {
          cursor: pointer;
          transition: background 0.2s;
        }

        .documents-table tr:hover {
          background: #f8f9fa;
        }

        .doc-name-cell {
          font-weight: 500;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
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

        .doc-modal {
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
          color: #999;
        }

        .doc-preview {
          text-align: center;
        }

        .preview-icon {
          font-size: 80px;
          margin-bottom: 15px;
        }

        .doc-preview h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .doc-preview p {
          color: #666;
          margin-bottom: 20px;
        }

        .doc-details {
          text-align: left;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .doc-details div {
          margin-bottom: 8px;
          font-size: 13px;
        }

        .doc-details code {
          font-size: 11px;
          word-break: break-all;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .download-btn, .verify-btn, .share-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .download-btn { background: #28a745; color: white; }
        .verify-btn { background: #007bff; color: white; }
        .share-btn { background: #6c757d; color: white; }
      `}</style>
    </div>
  );
};

export default Documents;
