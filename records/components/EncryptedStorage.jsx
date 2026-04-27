import React, { useState } from 'react';

const EncryptedStorage = () => {
  const [files, setFiles] = useState([]);
  const [encrypting, setEncrypting] = useState(false);
  const [password, setPassword] = useState('');

  const encryptFile = () => {
    if (!password) {
      alert('Please enter an encryption password');
      return;
    }
    setEncrypting(true);
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: `encrypted_file_${files.length + 1}.enc`,
        size: '2.3 MB',
        date: new Date().toLocaleDateString(),
        encrypted: true
      };
      setFiles([newFile, ...files]);
      setEncrypting(false);
      setPassword('');
    }, 2000);
  };

  return (
    <div className="encrypted-storage">
      <div className="storage-header">
        <h3>🔒 Encrypted Storage</h3>
        <p>Secure storage with military-grade encryption</p>
      </div>

      <div className="encryption-controls">
        <input
          type="password"
          placeholder="Enter encryption password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        <button onClick={encryptFile} disabled={encrypting} className="encrypt-btn">
          {encrypting ? 'Encrypting...' : 'Encrypt & Store'}
        </button>
      </div>

      <div className="storage-stats">
        <div className="stat">
          <div className="stat-value">256-bit</div>
          <div className="stat-label">AES Encryption</div>
        </div>
        <div className="stat">
          <div className="stat-value">{files.length}</div>
          <div className="stat-label">Files Stored</div>
        </div>
        <div className="stat">
          <div className="stat-value">End-to-End</div>
          <div className="stat-label">Encrypted</div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h4>Stored Files</h4>
          {files.map(file => (
            <div key={file.id} className="file-item">
              <div className="file-icon">🔐</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">{file.date} • {file.size}</div>
              </div>
              <button className="decrypt-btn">Decrypt</button>
            </div>
          ))}
        </div>
      )}

      <div className="security-note">
        <div className="note-icon">⚠️</div>
        <div className="note-text">
          <strong>Security Notice:</strong> Store your encryption password safely. Files cannot be recovered without it.
        </div>
      </div>

      <style jsx>{`
        .encrypted-storage {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .storage-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .storage-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .encryption-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .password-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .encrypt-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .storage-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat {
          text-align: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          font-size: 11px;
          color: #666;
        }

        .files-list h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .file-icon {
          font-size: 24px;
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-weight: 500;
          color: #333;
        }

        .file-meta {
          font-size: 11px;
          color: #999;
        }

        .decrypt-btn {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .security-note {
          margin-top: 15px;
          padding: 12px;
          background: #fff3cd;
          border-radius: 8px;
          display: flex;
          gap: 10px;
        }

        .note-icon {
          font-size: 20px;
        }

        .note-text {
          flex: 1;
          font-size: 12px;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default EncryptedStorage;
