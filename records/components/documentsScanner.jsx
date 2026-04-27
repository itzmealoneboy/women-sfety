import React, { useState, useRef } from 'react';

const DocumentsScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedDocs, setScannedDocs] = useState([]);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: `Scanned_Document_${scannedDocs.length + 1}.pdf`,
        date: new Date().toLocaleDateString(),
        size: '1.2 MB',
        pages: Math.floor(Math.random() * 10) + 1
      };
      setScannedDocs([newDoc, ...scannedDocs]);
      setScanning(false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="documents-scanner">
      <div className="scanner-header">
        <h3>Document Scanner</h3>
        <p>Scan or upload documents for digital storage</p>
      </div>

      <div className="scanner-controls">
        <button onClick={simulateScan} disabled={scanning} className="scan-btn">
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
          Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {preview && (
        <div className="preview-section">
          <h4>Document Preview</h4>
          <img src={preview} alt="Preview" className="preview-image" />
          <button className="save-btn">Save Document</button>
        </div>
      )}

      {scannedDocs.length > 0 && (
        <div className="recent-scans">
          <h4>Recently Scanned</h4>
          <div className="scans-list">
            {scannedDocs.map(doc => (
              <div key={doc.id} className="scan-item">
                <div className="scan-icon">📄</div>
                <div className="scan-info">
                  <div className="scan-name">{doc.name}</div>
                  <div className="scan-meta">{doc.date} • {doc.size} • {doc.pages} pages</div>
                </div>
                <button className="view-scan">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .documents-scanner {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .scanner-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .scanner-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .scanner-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .scan-btn, .upload-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .scan-btn {
          background: #007bff;
          color: white;
        }

        .upload-btn {
          background: #28a745;
          color: white;
        }

        .preview-section {
          margin-bottom: 20px;
          text-align: center;
        }

        .preview-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .save-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .recent-scans h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .scans-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .scan-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .scan-icon {
          font-size: 32px;
        }

        .scan-info {
          flex: 1;
        }

        .scan-name {
          font-weight: 500;
          color: #333;
        }

        .scan-meta {
          font-size: 11px;
          color: #999;
        }

        .view-scan {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DocumentsScanner;
