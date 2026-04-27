import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EvidenceManage = () => {
  const [evidence, setEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    flagged: 0,
    categories: {}
  });
  const [chainOfCustody, setChainOfCustody] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    const mockEvidence = [
      {
        id: 1,
        caseNumber: 'CR-2024-001',
        title: 'Screenshot of Threatening Message',
        type: 'image',
        format: 'PNG',
        size: '2.3 MB',
        uploadedBy: 'Investigator Smith',
        uploadDate: '2024-01-15',
        status: 'verified',
        hash: 'a3f5c8e9d2b1a4c6e8f9d2b4a6c8e0f2',
        description: 'Screenshot showing threatening messages from suspect',
        tags: ['threat', 'harassment', 'social-media'],
        metadata: {
          device: 'iPhone 13',
          location: 'New York, NY',
          timestamp: '2024-01-14 15:30:22',
          fileCreated: '2024-01-14 15:30:22',
          fileModified: '2024-01-14 15:30:22'
        },
        chainOfCustody: [
          { action: 'Uploaded', by: 'Investigator Smith', timestamp: '2024-01-15 10:00:00', notes: 'Initial upload' },
          { action: 'Verified', by: 'Forensic Analyst', timestamp: '2024-01-15 14:30:00', notes: 'Hash verified' },
          { action: 'Analyzed', by: 'AI System', timestamp: '2024-01-15 15:00:00', notes: 'Text analysis completed' }
        ]
      },
      {
        id: 2,
        caseNumber: 'CR-2024-001',
        title: 'Video Footage',
        type: 'video',
        format: 'MP4',
        size: '156 MB',
        uploadedBy: 'Officer Davis',
        uploadDate: '2024-01-14',
        status: 'pending',
        hash: 'b4f6d9e0c3a2b5d7f0e1c3a5b7d9f1e3',
        description: 'CCTV footage from convenience store',
        tags: ['cctv', 'video', 'surveillance'],
        metadata: {
          device: 'CCTV Camera',
          location: 'Downtown Store',
          timestamp: '2024-01-13 22:15:00',
          duration: '2:34',
          resolution: '1920x1080'
        },
        chainOfCustody: [
          { action: 'Uploaded', by: 'Officer Davis', timestamp: '2024-01-14 09:00:00', notes: 'Original footage' }
        ]
      },
      {
        id: 3,
        caseNumber: 'CR-2024-002',
        title: 'Email Correspondence',
        type: 'document',
        format: 'PDF',
        size: '845 KB',
        uploadedBy: 'Detective Williams',
        uploadDate: '2024-01-13',
        status: 'verified',
        hash: 'c5e7f0d1e4b3c6e8f0g2d4b6c8e0f2g4',
        description: 'Email thread showing fraudulent activity',
        tags: ['email', 'fraud', 'document'],
        metadata: {
          device: 'Email Server',
          location: 'Cloud',
          sender: 'fraud@example.com',
          recipient: 'victim@example.com',
          date: '2024-01-10'
        },
        chainOfCustody: [
          { action: 'Uploaded', by: 'Detective Williams', timestamp: '2024-01-13 11:00:00', notes: 'Email export' },
          { action: 'Verified', by: 'Forensic Analyst', timestamp: '2024-01-13 15:30:00', notes: 'Headers verified' }
        ]
      },
      {
        id: 4,
        caseNumber: 'CR-2024-002',
        title: 'Audio Recording',
        type: 'audio',
        format: 'MP3',
        size: '5.2 MB',
        uploadedBy: 'Victim Support',
        uploadDate: '2024-01-12',
        status: 'flagged',
        hash: 'd6f8e1f2e5c4d7f9g1h3e5c7d9f1e3g5',
        description: 'Phone call recording of threat',
        tags: ['audio', 'threat', 'recording'],
        metadata: {
          device: 'Smartphone',
          location: 'Unknown',
          duration: '3:45',
          format: 'MP3',
          bitrate: '192 kbps'
        },
        chainOfCustody: [
          { action: 'Uploaded', by: 'Victim Support', timestamp: '2024-01-12 16:00:00', notes: 'Received from victim' },
          { action: 'Flagged', by: 'AI System', timestamp: '2024-01-12 16:30:00', notes: 'Possible tampering detected' }
        ]
      }
    ];

    const mockChainOfCustody = [
      { date: '2024-01-10', evidence: 2, actions: 5 },
      { date: '2024-01-11', evidence: 3, actions: 8 },
      { date: '2024-01-12', evidence: 5, actions: 12 },
      { date: '2024-01-13', evidence: 4, actions: 10 },
      { date: '2024-01-14', evidence: 6, actions: 15 },
      { date: '2024-01-15', evidence: 3, actions: 7 }
    ];

    setEvidence(mockEvidence);
    setChainOfCustody(mockChainOfCustody);
    updateStats(mockEvidence);
  };

  const updateStats = (evidenceData) => {
    const total = evidenceData.length;
    const verified = evidenceData.filter(e => e.status === 'verified').length;
    const pending = evidenceData.filter(e => e.status === 'pending').length;
    const flagged = evidenceData.filter(e => e.status === 'flagged').length;
    
    const categories = {};
    evidenceData.forEach(e => {
      categories[e.type] = (categories[e.type] || 0) + 1;
    });

    setStats({ total, verified, pending, flagged, categories });
  };

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
          
          const newEvidence = {
            id: Date.now(),
            caseNumber: 'CR-2024-00' + (evidence.length + 1),
            title: file.name,
            type: file.type.split('/')[0],
            format: file.name.split('.').pop().toUpperCase(),
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            uploadedBy: 'Current User',
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            hash: generateHash(file.name),
            description: `Uploaded evidence: ${file.name}`,
            tags: ['new', 'pending-review'],
            metadata: {
              device: 'User Device',
              location: 'Unknown',
              uploaded: new Date().toISOString()
            },
            chainOfCustody: [
              { action: 'Uploaded', by: 'Current User', timestamp: new Date().toISOString(), notes: 'Initial upload' }
            ]
          };
          
          setEvidence(prev => [newEvidence, ...prev]);
          updateStats([newEvidence, ...evidence]);
          setUploading(null);
        }
      }, 500);
    });
  };

  const generateHash = (filename) => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const verifyEvidence = (evidenceId) => {
    setEvidence(evidence.map(e => 
      e.id === evidenceId ? { ...e, status: 'verified' } : e
    ));
    updateStats(evidence);
    alert('Evidence verified successfully!');
  };

  const flagEvidence = (evidenceId) => {
    setEvidence(evidence.map(e => 
      e.id === evidenceId ? { ...e, status: 'flagged' } : e
    ));
    updateStats(evidence);
    alert('Evidence flagged for review.');
  };

  const analyzeEvidence = (evidenceItem) => {
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = {
        authenticity: Math.random() * 30 + 70,
        tamperingDetected: Math.random() > 0.8,
        metadataIntegrity: Math.random() * 30 + 65,
        recommendations: [],
        findings: []
      };
      
      if (analysis.tamperingDetected) {
        analysis.findings.push('⚠️ Possible metadata manipulation detected');
        analysis.recommendations.push('Conduct deep forensic analysis');
      }
      
      if (analysis.authenticity < 80) {
        analysis.findings.push('⚠️ Low authenticity score - requires verification');
        analysis.recommendations.push('Verify source and chain of custody');
      }
      
      if (analysis.metadataIntegrity < 70) {
        analysis.findings.push('⚠️ Metadata inconsistencies found');
        analysis.recommendations.push('Extract and analyze EXIF data');
      }
      
      setAnalysisResults(analysis);
      alert('Analysis complete! Check the results tab.');
    }, 3000);
  };

  const downloadEvidence = (evidenceItem) => {
    try {
      // Simulate real-time device download
      const content = `Evidence Metadata File\n------------------------\nCase: ${evidenceItem.caseNumber}\nTitle: ${evidenceItem.title}\nHash: ${evidenceItem.hash}\nStatus: ${evidenceItem.status}\nUploaded By: ${evidenceItem.uploadedBy}\nUpload Date: ${evidenceItem.uploadDate}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${evidenceItem.title.replace(/\s+/g, '_')}_metadata.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('File safely downloaded to your local device!');
    } catch (error) {
      alert('Failed to execute download command on this device.');
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
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = activeTab === 'all' || item.status === activeTab;
    return matchesSearch && matchesType && matchesStatus;
  });

  const COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#fd7e14'];

  return (
    <div className="evidence-management">
      <div className="evidence-header">
        <h2>Digital Evidence Management</h2>
        <p>Secure chain of custody and forensic analysis platform</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Evidence</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <div className="stat-value">{stats.verified}</div>
            <div className="stat-label">Verified</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.flagged}</div>
            <div className="stat-label">Flagged</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Chain of Custody Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chainOfCustody}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="evidence" stroke="#007bff" name="Evidence Items" />
              <Line yAxisId="right" type="monotone" dataKey="actions" stroke="#28a745" name="Custody Actions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Evidence by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(stats.categories).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(stats.categories).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-area" onClick={() => document.getElementById('evidence-upload').click()}>
          <div className="upload-icon">📤</div>
          <div className="upload-text">Click or drag files to upload evidence</div>
          <div className="upload-hint">Supported: Images, Videos, Audio, Documents (Max 500MB)</div>
          <input
            id="evidence-upload"
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
            placeholder="Search by title, case number, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-group">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All ({stats.total})
        </button>
        <button className={`tab ${activeTab === 'verified' ? 'active' : ''}`} onClick={() => setActiveTab('verified')}>
          Verified ({stats.verified})
        </button>
        <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Pending ({stats.pending})
        </button>
        <button className={`tab ${activeTab === 'flagged' ? 'active' : ''}`} onClick={() => setActiveTab('flagged')}>
          Flagged ({stats.flagged})
        </button>
      </div>

      {/* Evidence List */}
      <div className="evidence-list">
        {filteredEvidence.map(item => (
          <div key={item.id} className="evidence-card" onClick={() => setSelectedEvidence(item)}>
            <div className="evidence-icon">{getTypeIcon(item.type)}</div>
            <div className="evidence-info">
              <div className="evidence-header">
                <div className="evidence-title">{item.title}</div>
                <div className="evidence-status" style={{ backgroundColor: getStatusColor(item.status) }}>
                  {item.status}
                </div>
              </div>
              <div className="evidence-meta">
                <span className="meta-case">Case: {item.caseNumber}</span>
                <span className="meta-date">📅 {item.uploadDate}</span>
                <span className="meta-size">💾 {item.size}</span>
                <span className="meta-format">{item.format}</span>
              </div>
              <div className="evidence-tags">
                {item.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="evidence-hash">Hash: {item.hash.substring(0, 16)}...</div>
            </div>
            <div className="evidence-actions">
              <button className="btn-view" onClick={(e) => { e.stopPropagation(); setSelectedEvidence(item); }}>View</button>
              {item.status === 'pending' && (
                <button className="btn-verify" onClick={(e) => { e.stopPropagation(); verifyEvidence(item.id); }}>Verify</button>
              )}
              {item.status !== 'flagged' && (
                <button className="btn-flag" onClick={(e) => { e.stopPropagation(); flagEvidence(item.id); }}>Flag</button>
              )}
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
                <h3>{selectedEvidence.title}</h3>
                <p className="modal-case">Case: {selectedEvidence.caseNumber}</p>
              </div>
              <div className="modal-status" style={{ backgroundColor: getStatusColor(selectedEvidence.status) }}>
                {selectedEvidence.status}
              </div>
            </div>

            <div className="modal-tabs">
              <button className="modal-tab active">Details</button>
              <button className="modal-tab">Chain of Custody</button>
              <button className="modal-tab">Forensic Analysis</button>
              <button className="modal-tab">Metadata</button>
            </div>

            <div className="modal-content">
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedEvidence.description}</p>
              </div>

              <div className="detail-section">
                <h4>File Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Format:</label>
                    <span>{selectedEvidence.format}</span>
                  </div>
                  <div className="info-item">
                    <label>Size:</label>
                    <span>{selectedEvidence.size}</span>
                  </div>
                  <div className="info-item">
                    <label>Uploaded By:</label>
                    <span>{selectedEvidence.uploadedBy}</span>
                  </div>
                  <div className="info-item">
                    <label>Upload Date:</label>
                    <span>{selectedEvidence.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Hash Verification</h4>
                <div className="hash-display">
                  <code>{selectedEvidence.hash}</code>
                  <button className="btn-copy" onClick={() => navigator.clipboard.writeText(selectedEvidence.hash)}>
                    Copy
                  </button>
                </div>
              </div>

              <div className="detail-section">
                <h4>Tags</h4>
                <div className="tags-list">
                  {selectedEvidence.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Chain of Custody</h4>
                <div className="custody-timeline">
                  {selectedEvidence.chainOfCustody.map((entry, index) => (
                    <div key={index} className="custody-entry">
                      <div className="custody-dot"></div>
                      <div className="custody-content">
                        <div className="custody-action">{entry.action}</div>
                        <div className="custody-details">
                          <span>By: {entry.by}</span>
                          <span>at: {entry.timestamp}</span>
                        </div>
                        <div className="custody-notes">{entry.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-download" onClick={() => downloadEvidence(selectedEvidence)}>Download Evidence</button>
                <button className="btn-analyze" onClick={() => analyzeEvidence(selectedEvidence)}>
                  Run Forensic Analysis
                </button>
                {selectedEvidence.status === 'pending' && (
                  <button className="btn-verify" onClick={() => verifyEvidence(selectedEvidence.id)}>
                    Verify
                  </button>
                )}
              </div>

              {analysisResults && (
                <div className="analysis-results">
                  <h4>AI Analysis Results</h4>
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <label>Authenticity Score:</label>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${analysisResults.authenticity}%`, backgroundColor: analysisResults.authenticity > 70 ? '#28a745' : '#dc3545' }} />
                      </div>
                      <span>{Math.round(analysisResults.authenticity)}%</span>
                    </div>
                    <div className="analysis-item">
                      <label>Metadata Integrity:</label>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${analysisResults.metadataIntegrity}%`, backgroundColor: analysisResults.metadataIntegrity > 70 ? '#28a745' : '#dc3545' }} />
                      </div>
                      <span>{Math.round(analysisResults.metadataIntegrity)}%</span>
                    </div>
                  </div>
                  
                  {analysisResults.findings.length > 0 && (
                    <div className="findings">
                      <strong>Findings:</strong>
                      <ul>
                        {analysisResults.findings.map((finding, i) => (
                          <li key={i}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResults.recommendations.length > 0 && (
                    <div className="recommendations">
                      <strong>Recommendations:</strong>
                      <ul>
                        {analysisResults.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .evidence-management {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .evidence-header {
          margin-bottom: 30px;
        }

        .evidence-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .evidence-header p {
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
          color: #007bff;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-card h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .upload-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
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
          gap: 20px;
          margin-bottom: 20px;
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

        .filter-group select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .status-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
        }

        .tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .evidence-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .evidence-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .evidence-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .evidence-icon {
          font-size: 48px;
        }

        .evidence-info {
          flex: 1;
        }

        .evidence-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }

        .evidence-title {
          font-weight: 500;
          color: #333;
        }

        .evidence-status {
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 10px;
        }

        .evidence-meta {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .evidence-tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .tag {
          padding: 2px 6px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 10px;
          color: #666;
        }

        .evidence-hash {
          font-size: 10px;
          color: #999;
          font-family: monospace;
        }

        .evidence-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .btn-view, .btn-verify, .btn-flag {
          padding: 4px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }

        .btn-view {
          background: #007bff;
          color: white;
        }

        .btn-verify {
          background: #28a745;
          color: white;
        }

        .btn-flag {
          background: #dc3545;
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

        .evidence-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
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

        .modal-case {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .modal-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          margin-left: auto;
        }

        .modal-tabs {
          display: flex;
          gap: 5px;
          padding: 0 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
        }

        .modal-tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .modal-content {
          padding: 20px;
        }

        .detail-section {
          margin-bottom: 25px;
        }

        .detail-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .info-item label {
          color: #666;
          font-size: 12px;
        }

        .info-item span {
          font-weight: 500;
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

        .btn-copy {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .tags-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .custody-timeline {
          position: relative;
          padding-left: 20px;
        }

        .custody-entry {
          position: relative;
          padding-bottom: 20px;
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

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-download, .btn-analyze, .btn-verify {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-download {
          background: #28a745;
          color: white;
        }

        .btn-analyze {
          background: #007bff;
          color: white;
        }

        .analysis-results {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .analysis-results h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }

        .analysis-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .analysis-item label {
          width: 120px;
          font-size: 12px;
          color: #666;
        }

        .score-bar {
          flex: 1;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
        }

        .findings, .recommendations {
          margin-top: 15px;
        }

        .findings ul, .recommendations ul {
          margin: 10px 0 0 20px;
        }

        .findings li, .recommendations li {
          margin-bottom: 5px;
          color: #666;
        }

        @media (max-width: 768px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
          
          .evidence-list {
            grid-template-columns: 1fr;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EvidenceManage;
