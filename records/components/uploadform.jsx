import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: 'legal',
    caseNumber: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        alert('Document uploaded successfully!');
        setFile(null);
        setMetadata({ title: '', description: '', category: 'legal', caseNumber: '' });
        setUploadProgress(0);
      }
    }, 500);
  };

  return (
    <div className="upload-form">
      <div className="form-header">
        <h3>Upload Document</h3>
        <p>Add new documents to your case records</p>
      </div>

      <div className="file-upload-area" onClick={() => document.getElementById('file-input').click()}>
        {file ? (
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button className="remove-file" onClick={(e) => { e.stopPropagation(); setFile(null); }}>×</button>
          </div>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <div className="upload-text">Click to select file</div>
            <div className="upload-hint">PDF, JPG, PNG, DOC (Max 50MB)</div>
          </>
        )}
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="metadata-form">
        <div className="form-group">
          <label>Document Title *</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata({...metadata, title: e.target.value})}
            placeholder="Enter document title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata({...metadata, description: e.target.value})}
            placeholder="Document description"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select value={metadata.category} onChange={(e) => setMetadata({...metadata, category: e.target.value})}>
              <option value="legal">Legal</option>
              <option value="medical">Medical</option>
              <option value="evidence">Evidence</option>
              <option value="statement">Statement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Case Number</label>
            <input
              type="text"
              value={metadata.caseNumber}
              onChange={(e) => setMetadata({...metadata, caseNumber: e.target.value})}
              placeholder="e.g., CR-2024-001"
            />
          </div>
        </div>
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <div className="progress-text">{uploadProgress}% Uploaded</div>
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || uploading} className="upload-submit">
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>

      <style jsx>{`
        .upload-form {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .form-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .file-upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .file-upload-area:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }

        .file-icon {
          font-size: 40px;
        }

        .file-details {
          flex: 1;
        }

        .file-name {
          font-weight: 500;
          color: #333;
        }

        .file-size {
          font-size: 12px;
          color: #999;
        }

        .remove-file {
          background: #dc3545;
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
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

        .metadata-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .upload-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .upload-submit {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadForm;
