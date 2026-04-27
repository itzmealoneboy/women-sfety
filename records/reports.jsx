import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [reportStats, setReportStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    const mockStats = {
      totalReports: 156,
      pendingReview: 23,
      approved: 112,
      rejected: 21,
      categories: [
        { name: 'Incident Reports', value: 78, color: '#dc3545' },
        { name: 'Evidence Reports', value: 45, color: '#28a745' },
        { name: 'Analysis Reports', value: 33, color: '#007bff' }
      ],
      monthlyTrends: [
        { month: 'Oct', reports: 28, approved: 22 },
        { month: 'Nov', reports: 32, approved: 26 },
        { month: 'Dec', reports: 35, approved: 28 },
        { month: 'Jan', reports: 42, approved: 34 }
      ]
    };

    const mockRecent = [
      { id: 1, title: 'Theft Incident Report', date: '2024-01-15', status: 'Approved', author: 'Officer Smith' },
      { id: 2, title: 'Cyber Crime Analysis', date: '2024-01-14', status: 'Pending', author: 'Detective Williams' },
      { id: 3, title: 'Witness Statement Summary', date: '2024-01-13', status: 'Approved', author: 'Officer Davis' }
    ];

    setReportStats(mockStats);
    setRecentReports(mockRecent);
  };

  const COLORS = ['#dc3545', '#28a745', '#007bff'];

  return (
    <div className="reports-dashboard">
      <div className="dashboard-header">
        <h2>Reports Dashboard</h2>
        <p>Comprehensive view of all generated reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{reportStats?.totalReports}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reportStats?.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reportStats?.pendingReview}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reportStats?.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Report Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportStats?.categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportStats?.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Report Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportStats?.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#007bff" name="Total Reports" />
              <Line type="monotone" dataKey="approved" stroke="#28a745" name="Approved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-reports">
        <h3>Recent Reports</h3>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map(report => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.author}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedReport(report)} className="view-btn">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedReport(null)}>×</button>
            <h3>{selectedReport.title}</h3>
            <div className="report-details">
              <p><strong>Author:</strong> {selectedReport.author}</p>
              <p><strong>Date:</strong> {selectedReport.date}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
            </div>
            <div className="modal-actions">
              <button className="download-btn">Download PDF</button>
              <button className="print-btn">Print</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reports-dashboard {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
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
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
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
          margin: 0 0 20px 0;
          color: #333;
        }

        .recent-reports {
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .recent-reports h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .reports-table {
          overflow-x: auto;
        }

        .reports-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .reports-table th,
        .reports-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .reports-table th {
          background: #f8f9fa;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: white;
        }

        .status-badge.approved { background: #28a745; }
        .status-badge.pending { background: #ffc107; }
        .status-badge.rejected { background: #dc3545; }

        .view-btn {
          padding: 4px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
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

        .report-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
        }

        .modal-close {
          float: right;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .report-details {
          margin: 20px 0;
        }

        .report-details p {
          margin-bottom: 10px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .download-btn, .print-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .download-btn { background: #28a745; color: white; }
        .print-btn { background: #007bff; color: white; }

        @media (max-width: 768px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
