import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const TwoFactorSetup = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  useEffect(() => {
    if (step === 1) {
      generateSecret();
    }
  }, [step]);

  const generateSecret = async () => {
    try {
      // Simulate API call to generate secret
      const mockSecret = 'ABCDEFGHIJKLMNOP';
      setSecret(mockSecret);
    } catch (error) {
      setError('Failed to generate secret');
    }
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    setBackupCodes(codes);
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        generateBackupCodes();
        setStep(3);
        if (onComplete) onComplete(true);
      } else {
        setError('Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStep1 = () => (
    <div className="setup-step">
      <h3>Step 1: Install Authenticator App</h3>
      <p>Install an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy on your phone.</p>
      
      <div className="setup-instructions">
        <h4>Setup Instructions:</h4>
        <ol>
          <li>Download an authenticator app from your app store</li>
          <li>Open the app and tap on "Add account" or "+"</li>
          <li>Choose "Scan QR code" or "Enter setup key"</li>
        </ol>
      </div>

      <div className="qr-code-container">
        <QRCode 
          value={`otpauth://totp/App:user@example.com?secret=${secret}&issuer=App`}
          size={200}
          level="H"
        />
        <div className="manual-entry">
          <p>Or enter this code manually:</p>
          <code>{secret}</code>
        </div>
      </div>

      <div className="step-actions">
        <button onClick={() => setStep(2)} className="btn-next">
          Next: Verify Code
        </button>
        {onSkip && (
          <button onClick={onSkip} className="btn-skip">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="setup-step">
      <h3>Step 2: Verify Setup</h3>
      <p>Enter the 6-digit code from your authenticator app to verify the setup.</p>
      
      <div className="verification-input">
        <input
          type="text"
          placeholder="000000"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          maxLength={6}
          className="code-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="step-actions">
        <button onClick={verifyAndEnable} disabled={loading} className="btn-verify">
          {loading ? 'Verifying...' : 'Verify and Enable'}
        </button>
        <button onClick={() => setStep(1)} className="btn-back">
          Back
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="setup-step">
      <h3>Step 3: Save Backup Codes</h3>
      <p>Save these backup codes in a safe place. You can use them to access your account if you lose your phone.</p>
      
      <div className="backup-codes-container">
        <div className="backup-codes-grid">
          {backupCodes.map((code, index) => (
            <div key={index} className="backup-code">
              {code}
            </div>
          ))}
        </div>
        
        <div className="backup-actions">
          <button onClick={downloadBackupCodes} className="btn-download">
            Download Backup Codes
          </button>
          <button onClick={() => setShowBackupCodes(!showBackupCodes)} className="btn-toggle">
            {showBackupCodes ? 'Hide' : 'Show'} Codes
          </button>
        </div>
      </div>

      <div className="warning-message">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <strong>Important:</strong> These codes will only be shown once. Make sure to save them securely.
        </div>
      </div>

      <div className="step-actions">
        <button onClick={() => {
          setShowBackupCodes(false);
          if (onComplete) onComplete(true);
        }} className="btn-complete">
          Complete Setup
        </button>
      </div>
    </div>
  );

  return (
    <div className="two-factor-setup">
      <div className="setup-header">
        <h2>Set Up Two-Factor Authentication</h2>
        <p>Add an extra layer of security to your account</p>
      </div>

      <div className="setup-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <style jsx>{`
        .two-factor-setup {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .setup-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .setup-header p {
          margin: 0;
          color: #666;
        }

        .setup-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }

        .progress-step {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #999;
        }

        .progress-step.active {
          background: #007bff;
          color: white;
        }

        .progress-line {
          width: 50px;
          height: 2px;
          background: #e0e0e0;
          margin: 0 10px;
        }

        .progress-line.active {
          background: #007bff;
        }

        .setup-step {
          animation: fadeIn 0.3s ease;
        }

        .setup-instructions {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .setup-instructions h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .setup-instructions ol {
          margin: 0;
          padding-left: 20px;
        }

        .setup-instructions li {
          color: #666;
          margin-bottom: 5px;
        }

        .qr-code-container {
          text-align: center;
          margin: 20px 0;
        }

        .manual-entry {
          margin-top: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .manual-entry code {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .verification-input {
          margin: 20px 0;
        }

        .code-input {
          width: 200px;
          padding: 12px;
          font-size: 18px;
          text-align: center;
          letter-spacing: 4px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          margin: 0 auto;
          display: block;
        }

        .code-input:focus {
          border-color: #007bff;
          outline: none;
        }

        .backup-codes-container {
          margin: 20px 0;
        }

        .backup-codes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .backup-code {
          background: #f8f9fa;
          padding: 10px;
          text-align: center;
          font-family: monospace;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .backup-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .warning-message {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .warning-icon {
          font-size: 20px;
        }

        .warning-text {
          flex: 1;
          color: #856404;
        }

        .step-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-next, .btn-verify, .btn-complete, .btn-download {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-next:hover, .btn-verify:hover, .btn-complete:hover {
          background: #0056b3;
        }

        .btn-skip, .btn-back, .btn-toggle {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-skip:hover, .btn-back:hover, .btn-toggle:hover {
          background: #545b62;
        }

        .error-message {
          color: #dc3545;
          text-align: center;
          margin: 10px 0;
          font-size: 14px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TwoFactorSetup;
