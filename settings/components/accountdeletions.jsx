import React, { useState } from 'react';

const AccountDeletions = () => {
  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    if (confirmationText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    if (!password) {
      alert('Please enter your password');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Account deletion request submitted. You will receive a confirmation email.');
      setStep(1);
      setConfirmationText('');
      setReason('');
      setPassword('');
    }, 2000);
  };

  return (
    <div className="account-deletions">
      <div className="settings-header">
        <h2>Account Deletion</h2>
        <p className="warning-text">⚠️ This action is permanent and cannot be undone</p>
      </div>

      {step === 1 && (
        <div className="deletion-steps">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3>Before you delete your account</h3>
              <ul>
                <li>All your data will be permanently removed</li>
                <li>You will lose access to all cases and reports</li>
                <li>Any pending complaints will be cancelled</li>
                <li>Your certificates and achievements will be lost</li>
                <li>This action cannot be reversed</li>
              </ul>
            </div>
          </div>

          <div className="data-backup">
            <h3>Download Your Data First</h3>
            <p>We recommend downloading your data before deletion</p>
            <button className="backup-btn">Download My Data</button>
          </div>

          <button onClick={() => setStep(2)} className="continue-btn">
            Continue to Deletion
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="confirmation-form">
          <div className="form-group">
            <label>Please type <strong>DELETE</strong> to confirm</label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE here"
            />
          </div>

          <div className="form-group">
            <label>Reason for leaving (optional)</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              <option value="privacy">Privacy concerns</option>
              <option value="not-useful">Not useful</option>
              <option value="technical">Technical issues</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Enter your password to confirm</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>

          <div className="form-actions">
            <button onClick={() => setStep(1)} className="back-btn">
              Back
            </button>
            <button onClick={handleDeleteAccount} disabled={loading} className="delete-btn">
              {loading ? 'Processing...' : 'Permanently Delete Account'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .account-deletions {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .settings-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .settings-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .warning-text {
          color: #dc3545;
          font-weight: 500;
          margin: 0;
        }

        .warning-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
        }

        .warning-icon {
          font-size: 32px;
        }

        .warning-content h3 {
          margin: 0 0 10px 0;
          color: #721c24;
        }

        .warning-content ul {
          margin: 0;
          padding-left: 20px;
        }

        .warning-content li {
          color: #721c24;
          margin-bottom: 5px;
        }

        .data-backup {
          background: #e7f3ff;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 24px;
        }

        .data-backup h3 {
          margin: 0 0 8px 0;
          color: #007bff;
        }

        .data-backup p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .backup-btn {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .continue-btn {
          width: 100%;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .confirmation-form {
          margin-top: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .back-btn {
          flex: 1;
          padding: 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .delete-btn {
          flex: 2;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AccountDeletions;
