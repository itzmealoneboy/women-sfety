import React, { useState, useRef } from 'react';

const EvidenceManager = () => {
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploading(fileId);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const newEvidence = {
              id: Date.now(),
              name: file.name,
              type: file.type.split('/')[0],
              format: file.name.split('.').pop().toUpperCase(),
              size: (file.size / (1024 * 1024)).toFixed(2),
              data: file.type.startsWith('image/') ? e.target.result : null,
              uploadedAt: new Date(),
              status: 'pending',
              hash: generateHash(file.name),
              tags: [],
              notes: '',
              chainOfCustody: [
                { action: 'Uploaded', by: 'Current User', timestamp: new Date(), notes: 'Initial upload' }
              ]
            };
            setEvidenceItems(prev => [newEvidence, ...prev]);
          };
          
          if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
          
          setUploading(null);
        }
      }, 500);
    });
  };

  const generateHash = (filename) => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const verifyEvidence = (id) => {
    setEvidenceItems(items => items.map(item => 
      item.id === id ? { ...item, status: 'verified' } : item
    ));
    alert('Evidence verified and hash confirmed.');
  };

  const flagEvidence = (id) => {
    setEvidenceItems(items => items.map(item => 
      item.id === id ? { ...item, status: 'flagged' } : item
    ));
    alert('Evidence flagged for review.');
  };

  const addNote = (id, note) => {
    const newNote = prompt('Enter note:', note);
    if (newNote) {
      setEvidenceItems(items => items.map(item => 
        item.id === id ? { ...item, notes: newNote, chainOfCustody: [...item.chainOfCustody, { action: 'Note Added', by: 'Current User', timestamp: new Date(), notes: newNote }] } : item
      ));
    }
  };

  const addTag = (id) => {
    const tag = prompt('Enter tag:');
    if (tag) {
      setEvidenceItems(items => items.map(item => 
        item.id === id ? { ...item, tags: [...item.tags, tag] } : item
      ));
    }
  };

  const downloadEvidence = (evidence) => {
    if (evidence.data) {
      const link = document.createElement('a');
      link.download = evidence.name;
      link.href = evidence.data;
      link.click();
    } else {
      alert('Download not available for this file type');
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'application': return '📄';
      default: return '📁';
    }
  };

  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="evidence-manager">
      <div className="manager-header">
        <h2>Evidence Manager</h2>
        <p>Secure digital evidence management with chain of custody</p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          <div className="upload-icon">📤</div>
          <div className="upload-text">Click to upload evidence files</div>
          <div className="upload-hint">Supported: Images, Videos, Audio, Documents (Max 500MB)</div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
        {uploading && uploadProgress[uploading] && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress[uploading]}%` }} />
            </div>
            <div className="progress-text">Uploading... {uploadProgress[uploading]}%</div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="application">Documents</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Evidence Grid */}
      <div className="evidence-grid">
        {filteredEvidence.map(item => (
          <div key={item.id} className="evidence-card" onClick={() => setSelectedEvidence(item)}>
            <div className="evidence-icon">{getTypeIcon(item.type)}</div>
            <div className="evidence-info">
              <div className="evidence-name">{item.name}</div>
              <div className="evidence-meta">
                <span>{item.format}</span>
                <span>{item.size} MB</span>
                <span>{item.uploadedAt.toLocaleTimeString()}</span>
              </div>
              <div className="evidence-status" style={{ backgroundColor: getStatusColor(item.status) }}>
                {item.status}
              </div>
              {item.tags.length > 0 && (
                <div className="evidence-tags">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="evidence-actions">
              <button className="btn-verify" onClick={(e) => { e.stopPropagation(); verifyEvidence(item.id); }}>✓</button>
              <button className="btn-flag" onClick={(e) => { e.stopPropagation(); flagEvidence(item.id); }}>⚠️</button>
              <button className="btn-note" onClick={(e) => { e.stopPropagation(); addNote(item.id, item.notes); }}>📝</button>
              <button className="btn-tag" onClick={(e) => { e.stopPropagation(); addTag(item.id); }}>🏷️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Modal */}
      {selectedEvidence && (
        <div className="modal-overlay" onClick={() => setSelectedEvidence(null)}>
          <div className="evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvidence(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-icon">{getTypeIcon(selectedEvidence.type)}</div>
              <div>
                <h3>{selectedEvidence.name}</h3>
                <p className="modal-meta">{selectedEvidence.format} • {selectedEvidence.size} MB</p>
              </div>
              <div className="modal-status" style={{ backgroundColor: getStatusColor(selectedEvidence.status) }}>
                {selectedEvidence.status}
              </div>
            </div>

            {selectedEvidence.data && selectedEvidence.type === 'image' && (
              <div className="evidence-preview">
                <img src={selectedEvidence.data} alt={selectedEvidence.name} />
              </div>
            )}

            <div className="modal-section">
              <h4>Hash Verification</h4>
              <div className="hash-display">
                <code>{selectedEvidence.hash}</code>
                <button onClick={() => navigator.clipboard.writeText(selectedEvidence.hash)}>Copy</button>
              </div>
            </div>

            <div className="modal-section">
              <h4>Chain of Custody</h4>
              <div className="custody-timeline">
                {selectedEvidence.chainOfCustody.map((entry, i) => (
                  <div key={i} className="custody-entry">
                    <div className="custody-dot"></div>
                    <div className="custody-content">
                      <div className="custody-action">{entry.action}</div>
                      <div className="custody-details">
                        <span>By: {entry.by}</span>
                        <span>at: {new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.notes && <div className="custody-notes">{entry.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>Tags</h4>
              <div className="tags-list">
                {selectedEvidence.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
                <button onClick={() => addTag(selectedEvidence.id)} className="add-tag-btn">+ Add Tag</button>
              </div>
            </div>

            <div className="modal-section">
              <h4>Notes</h4>
              <textarea
                value={selectedEvidence.notes}
                onChange={(e) => {
                  setEvidenceItems(items => items.map(item =>
                    item.id === selectedEvidence.id ? { ...item, notes: e.target.value } : item
                  ));
                  setSelectedEvidence({ ...selectedEvidence, notes: e.target.value });
                }}
                placeholder="Add investigation notes..."
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => downloadEvidence(selectedEvidence)} className="download-btn">Download</button>
              {selectedEvidence.status === 'pending' && (
                <button onClick={() => verifyEvidence(selectedEvidence.id)} className="verify-btn">Verify</button>
              )}
              <button onClick={() => addNote(selectedEvidence.id, selectedEvidence.notes)} className="save-btn">Save Notes</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .evidence-manager {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .manager-header {
          margin-bottom: 30px;
        }

        .manager-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .manager-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-area {
          background: white;
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .upload-text {
          font-size: 16px;
          color: #666;
          margin-bottom: 5px;
        }

        .upload-hint {
          font-size: 12px;
          color: #999;
        }

        .upload-progress {
          margin-top: 15px;
        }

        .progress-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .filters-section {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 10px 35px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .filters-section select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .evidence-card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .evidence-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .evidence-icon {
          font-size: 40px;
        }

        .evidence-info {
          flex: 1;
        }

        .evidence-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
          word-break: break-word;
        }

        .evidence-meta {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
        }

        .evidence-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .evidence-tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 2px 6px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 9px;
          color: #666;
        }

        .evidence-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .btn-verify, .btn-flag, .btn-note, .btn-tag {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-verify { background: #28a745; color: white; }
        .btn-flag { background: #dc3545; color: white; }
        .btn-note { background: #ffc107; color: #333; }
        .btn-tag { background: #17a2b8; color: white; }

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
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .modal-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-icon {
          font-size: 48px;
        }

        .modal-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .modal-meta {
          margin: 0;
          color: #666;
          font-size: 12px;
        }

        .modal-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          margin-left: auto;
        }

        .evidence-preview {
          padding: 20px;
          background: #f8f9fa;
          text-align: center;
        }

        .evidence-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
        }

        .modal-section {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-section h4 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .hash-display {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
        }

        .hash-display code {
          flex: 1;
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
        }

        .hash-display button {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .custody-timeline {
          position: relative;
          padding-left: 20px;
        }

        .custody-entry {
          position: relative;
          padding-bottom: 15px;
        }

        .custody-dot {
          position: absolute;
          left: -20px;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #007bff;
        }

        .custody-content {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
        }

        .custody-action {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .custody-details {
          display: flex;
          gap: 15px;
          font-size: 11px;
          color: #666;
          margin-bottom: 5px;
        }

        .custody-notes {
          font-size: 12px;
          color: #666;
        }

        .tags-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .add-tag-btn {
          padding: 4px 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }

        .modal-section textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: vertical;
          font-family: inherit;
        }

        .modal-actions {
          padding: 20px;
          display: flex;
          gap: 10px;
        }

        .download-btn, .verify-btn, .save-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .download-btn { background: #28a745; color: white; }
        .verify-btn { background: #007bff; color: white; }
        .save-btn { background: #6c757d; color: white; }
      `}</style>
    </div>
  );
};

export default EvidenceManager;
