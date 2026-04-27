import React, { useState, useEffect } from 'react';

const TransactionsCheckers = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    suspicious: 0,
    safe: 0,
    amount: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 1,
          upiId: 'user@okhdfcbank',
          amount: 2500,
          merchant: 'Amazon India',
          date: '2024-01-15 10:30 AM',
          status: 'completed',
          riskScore: 12,
          flags: []
        },
        {
          id: 2,
          upiId: 'user@okhdfcbank',
          amount: 45000,
          merchant: 'Unknown Merchant',
          date: '2024-01-15 09:15 AM',
          status: 'flagged',
          riskScore: 85,
          flags: ['Unusual Amount', 'New Merchant', 'Different Location']
        },
        {
          id: 3,
          upiId: 'user@okhdfcbank',
          amount: 500,
          merchant: 'Local Store',
          date: '2024-01-14 06:30 PM',
          status: 'completed',
          riskScore: 5,
          flags: []
        },
        {
          id: 4,
          upiId: 'user@okhdfcbank',
          amount: 15000,
          merchant: 'E-commerce Site',
          date: '2024-01-14 02:00 PM',
          status: 'pending',
          riskScore: 45,
          flags: ['Multiple Attempts']
        }
      ];

      const totalAmount = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
      const suspicious = mockTransactions.filter(t => t.riskScore > 70).length;

      setTransactions(mockTransactions);
      setStats({
        total: mockTransactions.length,
        suspicious: suspicious,
        safe: mockTransactions.length - suspicious,
        amount: totalAmount
      });
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (score) => {
    if (score > 70) return '#dc3545';
    if (score > 40) return '#ffc107';
    return '#28a745';
  };

  const getRiskLabel = (score) => {
    if (score > 70) return 'High Risk';
    if (score > 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const filteredTransactions = filter === 'all' ? transactions : 
    filter === 'flagged' ? transactions.filter(t => t.status === 'flagged') :
    transactions.filter(t => t.status === 'completed');

  return (
    <div className="transactions-checker">
      <div className="checker-header">
        <h2>Transaction Checker</h2>
        <p>AI-powered transaction analysis and risk assessment</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">₹{stats.amount.toLocaleString()}</div>
          <div className="stat-label">Total Amount</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#28a745' }}>{stats.safe}</div>
          <div className="stat-label">Safe Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#dc3545' }}>{stats.suspicious}</div>
          <div className="stat-label">Suspicious</div>
        </div>
      </div>

      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'flagged' ? 'active' : ''} onClick={() => setFilter('flagged')}>Flagged</button>
        <button className={filter === 'safe' ? 'active' : ''} onClick={() => setFilter('safe')}>Safe</button>
      </div>

      {loading ? (
        <div className="loading">Analyzing transactions...</div>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header">
                <div className="transaction-merchant">{transaction.merchant}</div>
                <div className="transaction-amount">₹{transaction.amount.toLocaleString()}</div>
              </div>
              <div className="transaction-details">
                <div className="detail">UPI: {transaction.upiId}</div>
                <div className="detail">Date: {transaction.date}</div>
                <div className="detail">Status: {transaction.status}</div>
              </div>
              <div className="risk-assessment">
                <div className="risk-score" style={{ color: getRiskColor(transaction.riskScore) }}>
                  Risk Score: {transaction.riskScore}% - {getRiskLabel(transaction.riskScore)}
                </div>
                {transaction.flags.length > 0 && (
                  <div className="risk-flags">
                    {transaction.flags.map((flag, i) => (
                      <span key={i} className="flag">⚠️ {flag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="transaction-actions">
                <button className="details-btn">View Details</button>
                {transaction.status === 'flagged' && (
                  <button className="report-btn">Report Fraud</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .transactions-checker {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .checker-header {
          margin-bottom: 30px;
        }

        .checker-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .checker-header p {
          margin: 0;
          color: #666;
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
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #007bff;
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .filters button {
          padding: 8px 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
        }

        .filters button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .transaction-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .transaction-merchant {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .transaction-amount {
          font-size: 20px;
          font-weight: bold;
          color: #28a745;
        }

        .transaction-details {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 13px;
          color: #666;
        }

        .risk-assessment {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .risk-score {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .risk-flags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .flag {
          padding: 4px 8px;
          background: #fff3cd;
          border-radius: 4px;
          font-size: 11px;
          color: #856404;
        }

        .transaction-actions {
          display: flex;
          gap: 10px;
        }

        .details-btn, .report-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .details-btn {
          background: #007bff;
          color: white;
        }

        .report-btn {
          background: #dc3545;
          color: white;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default TransactionsCheckers;