import React, { useState } from 'react';

const UPIAutoBlocks = () => {
  const [autoBlock, setAutoBlock] = useState({
    enabled: true,
    suspiciousAmount: true,
    newDevice: true,
    multipleAttempts: true,
    unknownMerchant: false,
    thresholdAmount: 25000
  });
  const [blockHistory, setBlockHistory] = useState([
    { id: 1, date: '2024-01-15 10:30 AM', reason: 'Suspicious Amount', amount: 45000, merchant: 'Unknown', status: 'blocked' },
    { id: 2, date: '2024-01-14 03:15 PM', reason: 'New Device Login', amount: 0, merchant: 'UPI App', status: 'blocked' },
    { id: 3, date: '2024-01-13 09:45 AM', reason: 'Multiple Failed Attempts', amount: 0, merchant: 'UPI App', status: 'blocked' }
  ]);
  const [whitelist, setWhitelist] = useState(['amazon@okhdfcbank', 'flipkart@okicici', 'swiggy@okaxis']);

  const handleToggle = (setting) => {
    setAutoBlock({...autoBlock, [setting]: !autoBlock[setting]});
  };

  const addToWhitelist = () => {
    const merchant = prompt('Enter UPI ID to whitelist:');
    if (merchant && !whitelist.includes(merchant)) {
      setWhitelist([...whitelist, merchant]);
    }
  };

  const removeFromWhitelist = (merchant) => {
    setWhitelist(whitelist.filter(m => m !== merchant));
  };

  return (
    <div className="upi-auto-blocks">
      <div className="auto-block-header">
        <h2>UPI Auto-Block</h2>
        <p>AI-powered automatic fraud protection</p>
      </div>

      <div className="auto-block-toggle">
        <div className="toggle-info">
          <div className="toggle-icon">🛡️</div>
          <div>
            <h3>Auto-Block Protection</h3>
            <p>Automatically block suspicious transactions</p>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={autoBlock.enabled}
            onChange={() => handleToggle('enabled')}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {autoBlock.enabled && (
        <>
          <div className="settings-section">
            <h3>Blocking Rules</h3>
            <div className="rules-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoBlock.suspiciousAmount}
                  onChange={() => handleToggle('suspiciousAmount')}
                />
                Block suspicious high-value transactions
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoBlock.newDevice}
                  onChange={() => handleToggle('newDevice')}
                />
                Block transactions from new devices
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoBlock.multipleAttempts}
                  onChange={() => handleToggle('multipleAttempts')}
                />
                Block after multiple failed attempts
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoBlock.unknownMerchant}
                  onChange={() => handleToggle('unknownMerchant')}
                />
                Block unknown merchants
              </label>
            </div>

            <div className="threshold-setting">
              <label>High-value threshold (₹)</label>
              <input
                type="number"
                value={autoBlock.thresholdAmount}
                onChange={(e) => setAutoBlock({...autoBlock, thresholdAmount: parseInt(e.target.value)})}
              />
              <p className="threshold-note">Transactions above this amount will be flagged</p>
            </div>
          </div>

          <div className="whitelist-section">
            <h3>Whitelisted Merchants</h3>
            <p>Auto-block will never block these merchants</p>
            <div className="whitelist-list">
              {whitelist.map(merchant => (
                <div key={merchant} className="whitelist-item">
                  <span>{merchant}</span>
                  <button onClick={() => removeFromWhitelist(merchant)} className="remove-btn">×</button>
                </div>
              ))}
              <button onClick={addToWhitelist} className="add-btn">+ Add Merchant</button>
            </div>
          </div>

          <div className="block-history">
            <h3>Auto-Block History</h3>
            <div className="history-list">
              {blockHistory.map(block => (
                <div key={block.id} className="history-item">
                  <div className="history-icon">🔒</div>
                  <div className="history-details">
                    <div className="history-date">{block.date}</div>
                    <div className="history-reason">{block.reason}</div>
                    {block.amount > 0 && <div className="history-amount">Amount: ₹{block.amount.toLocaleString()}</div>}
                    <div className="history-merchant">Merchant: {block.merchant}</div>
                  </div>
                  <div className="history-status blocked">Blocked</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="security-note">
        <div className="note-icon">🔒</div>
        <div className="note-text">
          Auto-block helps protect your account from fraudulent transactions. You can review and approve blocked transactions in the transaction history.
        </div>
      </div>

      <style jsx>{`
        .upi-auto-blocks {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .auto-block-header {
          margin-bottom: 30px;
        }

        .auto-block-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .auto-block-header p {
          margin: 0;
          color: #666;
        }

        .auto-block-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .toggle-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .toggle-icon {
          font-size: 40px;
        }

        .toggle-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .toggle-info p {
          margin: 0;
          color: #666;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #28a745;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .settings-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .rules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .threshold-setting {
          margin-top: 20px;
        }

        .threshold-setting label {
          display: block;
          margin-bottom: 8px;
          color: #666;
        }

        .threshold-setting input {
          width: 200px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .threshold-note {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }

        .whitelist-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .whitelist-section h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .whitelist-section p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .whitelist-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .whitelist-item {
          background: #e7f3ff;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 16px;
        }

        .add-btn {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .block-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .block-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .history-item {
          display: flex;
          gap: 12px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .history-icon {
          font-size: 24px;
        }

        .history-details {
          flex: 1;
        }

        .history-date {
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
        }

        .history-reason {
          font-weight: bold;
          color: #dc3545;
          margin-bottom: 5px;
        }

        .history-amount, .history-merchant {
          font-size: 12px;
          color: #666;
        }

        .history-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          height: fit-content;
        }

        .history-status.blocked {
          background: #dc3545;
          color: white;
        }

        .security-note {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          gap: 10px;
        }

        .note-icon {
          font-size: 20px;
        }

        .note-text {
          flex: 1;
          font-size: 13px;
          color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default UPIAutoBlocks;