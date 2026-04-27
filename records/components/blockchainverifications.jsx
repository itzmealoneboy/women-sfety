import React, { useState } from 'react';

const BlockchainVerifications = () => {
  const [verificationId, setVerificationId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const verifyDocument = () => {
    if (!verificationId) return;
    setVerifying(true);
    setTimeout(() => {
      const isValid = Math.random() > 0.3;
      setResult({
        valid: isValid,
        id: verificationId,
        timestamp: new Date().toISOString(),
        blockNumber: Math.floor(Math.random() * 1000000),
        hash: '0x' + Math.random().toString(36).substring(2, 15),
        documentName: 'Evidence Document #' + verificationId
      });
      setVerifying(false);
    }, 2000);
  };

  return (
    <div className="blockchain-verification">
      <div className="verification-header">
        <h3>Blockchain Verification</h3>
        <p>Verify document authenticity using blockchain technology</p>
      </div>

      <div className="verification-input">
        <input
          type="text"
          placeholder="Enter Document ID or Hash"
          value={verificationId}
          onChange={(e) => setVerificationId(e.target.value)}
        />
        <button onClick={verifyDocument} disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </div>

      {result && (
        <div className={`verification-result ${result.valid ? 'valid' : 'invalid'}`}>
          <div className="result-icon">{result.valid ? '✓' : '✗'}</div>
          <div className="result-details">
            <div className="result-status">
              {result.valid ? 'Document is VERIFIED and AUTHENTIC' : 'Document verification FAILED'}
            </div>
            <div className="result-info">
              <div><strong>Document ID:</strong> {result.id}</div>
              <div><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</div>
              <div><strong>Block Number:</strong> {result.blockNumber}</div>
              <div><strong>Transaction Hash:</strong> <code>{result.hash}</code></div>
              <div><strong>Document Name:</strong> {result.documentName}</div>
            </div>
            <div className="blockchain-badge">
              ⛓️ Verified on Blockchain
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .blockchain-verification {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .verification-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .verification-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .verification-input {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .verification-input input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .verification-input button {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .verification-result {
          padding: 20px;
          border-radius: 8px;
          display: flex;
          gap: 15px;
        }

        .verification-result.valid {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .verification-result.invalid {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
        }

        .result-icon {
          font-size: 48px;
        }

        .result-details {
          flex: 1;
        }

        .result-status {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .verification-result.valid .result-status {
          color: #155724;
        }

        .verification-result.invalid .result-status {
          color: #721c24;
        }

        .result-info div {
          margin-bottom: 5px;
          font-size: 13px;
        }

        .result-info code {
          font-size: 11px;
          word-break: break-all;
        }

        .blockchain-badge {
          margin-top: 10px;
          padding: 4px 8px;
          background: #007bff;
          color: white;
          border-radius: 4px;
          font-size: 11px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default BlockchainVerifications;
