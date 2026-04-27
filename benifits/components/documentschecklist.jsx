import React, { useState, useEffect } from 'react';

const DocumentsChecklist = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const mockDocuments = [
        {
          id: 1,
          name: 'Aadhaar Card',
          category: 'Identity Proof',
          required: true,
          status: 'uploaded',
          expiryDate: '2030-12-31',
          description: 'Government issued Aadhaar card for identity verification',
          formats: ['PDF', 'JPG', 'PNG'],
          maxSize: '2MB'
        },
        {
          id: 2,
          name: 'PAN Card',
          category: 'Identity Proof',
          required: true,
          status: 'uploaded',
          expiryDate: 'Lifetime',
          description: 'Permanent Account Number card for tax identification',
          formats: ['PDF', 'JPG', 'PNG'],
          maxSize: '1MB'
        },
        {
          id: 3,
          name: 'Voter ID',
          category: 'Identity Proof',
          required: false,
          status: 'pending',
          description: 'Voter identification card',
          formats: ['PDF', 'JPG', 'PNG'],
          maxSize: '2MB'
        },
        {
          id: 4,
          name: 'Income Certificate',
          category: 'Income Proof',
          required: true,
          status: 'pending',
          expiryDate: '2024-12-31',
          description: 'Certificate showing annual income from competent authority',
          formats: ['PDF'],
          maxSize: '3MB'
        },
        {
          id: 5,
          name: 'Salary Slips (Last 3 months)',
          category: 'Income Proof',
          required: true,
          status: 'missing',
          description: 'Recent salary slips from employer',
          formats: ['PDF'],
          maxSize: '5MB'
        },
        {
          id: 6,
          name: 'Bank Statement',
          category: 'Financial Proof',
          required: true,
          status: 'pending',
          description: 'Last 6 months bank statement',
          formats: ['PDF'],
          maxSize: '5MB'
        },
        {
          id: 7,
          name: 'Property Documents',
          category: 'Property Proof',
          required: false,
          status: 'missing',
          description: 'Property ownership documents if applicable',
          formats: ['PDF', 'JPG', 'PNG'],
          maxSize: '10MB'
        },
        {
          id: 8,
          name: 'Caste Certificate',
          category: 'Category Proof',
          required: false,
          status: 'pending',
          description: 'Caste certificate for reservation benefits',
          formats: ['PDF'],
          maxSize: '2MB'
        },
        {
          id: 9,
          name: 'Domicile Certificate',
          category: 'Residence Proof',
          required: true,
          status: 'missing',
          description: 'Certificate proving state residency',
          formats: ['PDF'],
          maxSize: '2MB'
        },
        {
          id: 10,
          name: 'Passport Size Photo',
          category: 'Photo',
          required: true,
          status: 'uploaded',
          description: 'Recent passport size photograph',
          formats: ['JPG', 'PNG'],
          maxSize: '500KB'
        }
      ];

      const mockCategories = [
        { id: 'all', name: 'All Documents', count: mockDocuments.length },
        { id: 'Identity Proof', name: 'Identity Proof', count: mockDocuments.filter(d => d.category === 'Identity Proof').length },
        { id: 'Income Proof', name: 'Income Proof', count: mockDocuments.filter(d => d.category === 'Income Proof').length },
        { id: 'Financial Proof', name: 'Financial Proof', count: mockDocuments.filter(d => d.category === 'Financial Proof').length },
        { id: 'Property Proof', name: 'Property Proof', count: mockDocuments.filter(d => d.category === 'Property Proof').length },
        { id: 'Category Proof', name: 'Category Proof', count: mockDocuments.filter(d => d.category === 'Category Proof').length },
        { id: 'Residence Proof', name: 'Residence Proof', count: mockDocuments.filter(d => d.category === 'Residence Proof').length },
        { id: 'Photo', name: 'Photo', count: mockDocuments.filter(d => d.category === 'Photo').length }
      ];

      setDocuments(mockDocuments);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = (docId, file) => {
    setUploading(docId);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [docId]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setDocuments(docs => docs.map(doc => 
          doc.id === docId ? { ...doc, status: 'uploaded' } : doc
        ));
        setUploading(null);
        setTimeout(() => {
          setUploadProgress(prev => {
            const newState = { ...prev };
            delete newState[docId];
            return newState;
          });
        }, 1000);
      }
    }, 300);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'uploaded': return { icon: '✓', color: '#28a745', text: 'Uploaded' };
      case 'pending': return { icon: '⏳', color: '#ffc107', text: 'Pending' };
      case 'missing': return { icon: '⚠️', color: '#dc3545', text: 'Missing' };
      default: return { icon: '•', color: '#6c757d', text: 'Not Started' };
    }
  };

  const getCompletionStats = () => {
    const total = documents.length;
    const uploaded = documents.filter(d => d.status === 'uploaded').length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const missing = documents.filter(d => d.status === 'missing').length;
    const requiredTotal = documents.filter(d => d.required).length;
    const requiredUploaded = documents.filter(d => d.required && d.status === 'uploaded').length;
    
    return {
      total,
      uploaded,
      pending,
      missing,
      requiredTotal,
      requiredUploaded,
      percentage: (uploaded / total) * 100
    };
  };

  const stats = getCompletionStats();
  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <div className="documents-checklist">
      <div className="checklist-header">
        <h2>Documents Checklist</h2>
        <p>Track and manage all required documents for your applications</p>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-card">
          <div className="progress-stats">
            <div className="stat">
              <div className="stat-value">{stats.uploaded}</div>
              <div className="stat-label">Uploaded</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.missing}</div>
              <div className="stat-label">Missing</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.requiredTotal}</div>
              <div className="stat-label">Required</div>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.percentage}%`, backgroundColor: '#28a745' }} />
            </div>
            <div className="progress-text">{Math.round(stats.percentage)}% Complete</div>
          </div>
          <div className="required-progress">
            <div className="required-text">
              Required Documents: {stats.requiredUploaded}/{stats.requiredTotal} Uploaded
            </div>
            {stats.requiredUploaded === stats.requiredTotal && (
              <div className="success-badge">✓ All Required Documents Ready</div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
            <span className="count">{category.count}</span>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="documents-list">
        {filteredDocuments.map(doc => {
          const status = getStatusIcon(doc.status);
          const isUploading = uploading === doc.id;
          const progress = uploadProgress[doc.id] || 0;
          
          return (
            <div key={doc.id} className={`document-card ${doc.status}`}>
              <div className="document-header">
                <div className="document-info">
                  <h3>{doc.name}</h3>
                  {doc.required && <span className="required-badge">Required</span>}
                </div>
                <div className="document-status" style={{ color: status.color }}>
                  {status.icon} {status.text}
                </div>
              </div>
              
              <div className="document-details">
                <p className="document-description">{doc.description}</p>
                <div className="document-meta">
                  {doc.expiryDate && (
                    <span className="meta-item">
                      📅 Expires: {doc.expiryDate}
                    </span>
                  )}
                  <span className="meta-item">
                    📄 Formats: {doc.formats.join(', ')}
                  </span>
                  <span className="meta-item">
                    💾 Max Size: {doc.maxSize}
                  </span>
                </div>
              </div>
              
              <div className="document-actions">
                {doc.status === 'uploaded' ? (
                  <div className="uploaded-actions">
                    <button className="btn-view">View Document</button>
                    <button className="btn-replace">Replace</button>
                  </div>
                ) : (
                  <div className="upload-section">
                    <label className="upload-btn">
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                      <input
                        type="file"
                        accept={doc.formats.map(f => `.${f.toLowerCase()}`).join(',')}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(doc.id, e.target.files[0]);
                          }
                        }}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {isUploading && (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h3>💡 Document Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📸</div>
            <h4>Clear Scans</h4>
            <p>Ensure documents are clearly visible and not blurred</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📏</div>
            <h4>Correct Size</h4>
            <p>Check file size limits before uploading</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Keep Updated</h4>
            <p>Renew expired documents before applying</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔒</div>
            <h4>Secure Storage</h4>
            <p>Your documents are encrypted and securely stored</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .documents-checklist {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .checklist-header {
          margin-bottom: 30px;
        }

        .checklist-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .checklist-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .progress-overview {
          margin-bottom: 30px;
        }

        .progress-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .progress-bar-container {
          margin-bottom: 15px;
        }

        .progress-bar {
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          color: #666;
          text-align: center;
        }

        .required-progress {
          text-align: center;
        }

        .required-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .success-badge {
          display: inline-block;
          padding: 6px 12px;
          background: #d4edda;
          color: #155724;
          border-radius: 20px;
          font-size: 13px;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }

        .category-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-btn:hover {
          background: #f0f0f0;
        }

        .category-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .count {
          background: rgba(0,0,0,0.1);
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
        }

        .category-btn.active .count {
          background: rgba(255,255,255,0.2);
        }

        .documents-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .document-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .document-card:hover {
          transform: translateY(-2px);
        }

        .document-card.uploaded {
          border-left: 4px solid #28a745;
        }

        .document-card.pending {
          border-left: 4px solid #ffc107;
        }

        .document-card.missing {
          border-left: 4px solid #dc3545;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .document-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .document-info h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .required-badge {
          padding: 2px 8px;
          background: #dc3545;
          color: white;
          border-radius: 4px;
          font-size: 11px;
        }

        .document-status {
          font-weight: 500;
          font-size: 14px;
        }

        .document-description {
          color: #666;
          margin: 0 0 12px 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .document-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }

        .meta-item {
          font-size: 12px;
          color: #999;
        }

        .uploaded-actions {
          display: flex;
          gap: 10px;
        }

        .btn-view, .btn-replace, .upload-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .btn-view {
          background: #007bff;
          color: white;
        }

        .btn-replace {
          background: #ffc107;
          color: #333;
        }

        .upload-btn {
          display: inline-block;
          background: #28a745;
          color: white;
          cursor: pointer;
        }

        .upload-section {
          flex: 1;
        }

        .upload-progress {
          margin-top: 10px;
        }

        .tips-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .tips-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .tip-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tip-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .tip-card h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .tip-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .documents-list {
            grid-template-columns: 1fr;
          }
          
          .progress-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentsChecklist;
