import React, { useState } from 'react';

const ShareWithPolice = () => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [policeStation, setPoliceStation] = useState('');
  const [reason, setReason] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const documents = [
    { id: 1, name: 'FIR Copy - CR-2024-001.pdf', type: 'Legal' },
    { id: 2, name: 'Evidence Photo - Scene.jpg', type: 'Evidence' },
    { id: 3, name: 'Witness Statement.docx', type: 'Statement' }
  ];

  const policeStations = [
    'Downtown Police Station',
    'Central Police Station',
    'North District Police Station',
    'Cyber Crime Branch'
  ];

  const handleShare = () => {
    if (selectedDocuments.length === 0 || !policeStation) {
      alert('Please select documents and police station');
      return;
    }
    setSharing(true);
    setTimeout(() => {
      setSharing(false);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }, 2000);
  };

  const toggleDocument = (id) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  return (
    <div className="share-with-police">
      <div className="share-header">
        <h3>Share with Police</h3>
        <p>Securely share documents with law enforcement</p>
      </div>

      <div className="documents-select">
        <h4>Select Documents to Share</h4>
        {documents.map(doc => (
          <label key={doc.id} className="doc-checkbox">
            <input
              type="checkbox"
              checked={selectedDocuments.includes(doc.id)}
              onChange={() => toggleDocument(doc.id)}
            />
            <span className="doc-name">{doc.name}</span>
            <span className="doc-type">{doc.type}</span>
          </label>
        ))}
      </div>

      <div className="police-select">
        <label>Police Station</label>
        <select value={policeStation} onChange={(e) => setPoliceStation(e.target.value)}>
          <option value="">Select police station</option>
          {policeStations.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
      </div>

      <div className="reason-input">
        <label>Reason for Sharing</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide reason for sharing these documents..."
          rows={3}
        />
      </div>

      <button onClick={handleShare} disabled={sharing} className="share-btn">
        {sharing ? 'Sharing...' : 'Share Securely'}
      </button>

      {shared && (
        <div className="success-message">
          ✓ Documents shared successfully with {policeStation}
        </div>
      )}

      <div className="security-note">
        <div className="note-icon">🔒</div>
        <div className="note-text">
          Documents are encrypted during transfer and access is logged. Only authorized personnel can view.
        </div>
      </div>

      <style jsx>{`
        .share-with-police {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .share-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .share-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .documents-select h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .doc-checkbox {
          display: flex;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .doc-checkbox input {
          margin-right: 10px;
        }

        .doc-name {
          flex: 1;
          font-weight: 500;
        }

        .doc-type {
          font-size: 11px;
          color: #666;
        }

        .police-select, .reason-input {
          margin-top: 15px;
        }

        .police-select label, .reason-input label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .police-select select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .reason-input textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: vertical;
        }

        .share-btn {
          margin-top: 20px;
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .success-message {
          margin-top: 15px;
          padding: 10px;
          background: #d4edda;
          color: #155724;
          border-radius: 6px;
          text-align: center;
        }

        .security-note {
          margin-top: 15px;
          padding: 10px;
          background: #e7f3ff;
          border-radius: 6px;
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

export default ShareWithPolice;
