import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockAnalytics = {
        overview: {
          totalUsers: 15420,
          activeUsers: 8234,
          totalReports: 3421,
          resolvedReports: 2876,
          emergencyCalls: 892,
          successRate: 84,
          userGrowth: 12.5,
          reportGrowth: -3.2
        },
        userData: {
          week: [
            { date: 'Mon', users: 15200, newUsers: 234 },
            { date: 'Tue', users: 15320, newUsers: 198 },
            { date: 'Wed', users: 15450, newUsers: 267 },
            { date: 'Thu', users: 15580, newUsers: 245 },
            { date: 'Fri', users: 15720, newUsers: 289 },
            { date: 'Sat', users: 15850, newUsers: 198 },
            { date: 'Sun', users: 15900, newUsers: 156 }
          ],
          month: [
            { date: 'Week 1', users: 14200, newUsers: 890 },
            { date: 'Week 2', users: 14800, newUsers: 950 },
            { date: 'Week 3', users: 15200, newUsers: 1020 },
            { date: 'Week 4', users: 15900, newUsers: 1100 }
          ],
          year: [
            { month: 'Jan', users: 12000, newUsers: 1200 },
            { month: 'Feb', users: 12800, newUsers: 1100 },
            { month: 'Mar', users: 13500, newUsers: 1300 },
            { month: 'Apr', users: 14200, newUsers: 1250 },
            { month: 'May', users: 14800, newUsers: 1180 },
            { month: 'Jun', users: 15420, newUsers: 1320 }
          ]
        },
        reportsData: {
          week: [
            { date: 'Mon', reports: 45, resolved: 38 },
            { date: 'Tue', reports: 52, resolved: 42 },
            { date: 'Wed', reports: 48, resolved: 41 },
            { date: 'Thu', reports: 56, resolved: 47 },
            { date: 'Fri', reports: 61, resolved: 52 },
            { date: 'Sat', reports: 38, resolved: 33 },
            { date: 'Sun', reports: 42, resolved: 35 }
          ],
          month: [
            { date: 'Week 1', reports: 280, resolved: 235 },
            { date: 'Week 2', reports: 310, resolved: 268 },
            { date: 'Week 3', reports: 295, resolved: 252 },
            { date: 'Week 4', reports: 342, resolved: 289 }
          ],
          year: [
            { month: 'Jan', reports: 1250, resolved: 1050 },
            { month: 'Feb', reports: 1320, resolved: 1120 },
            { month: 'Mar', reports: 1410, resolved: 1200 },
            { month: 'Apr', reports: 1380, resolved: 1160 },
            { month: 'May', reports: 1450, resolved: 1230 },
            { month: 'Jun', reports: 1520, resolved: 1290 }
          ]
        },
        categories: [
          { name: 'Safety Reports', value: 1240, color: '#007bff' },
          { name: 'Fraud Reports', value: 890, color: '#dc3545' },
          { name: 'Harassment', value: 560, color: '#fd7e14' },
          { name: 'Cyber Crime', value: 430, color: '#ffc107' },
          { name: 'Other', value: 301, color: '#28a745' }
        ],
        emergencyData: [
          { time: '00:00', calls: 12 },
          { time: '04:00', calls: 5 },
          { time: '08:00', calls: 28 },
          { time: '12:00', calls: 45 },
          { time: '16:00', calls: 52 },
          { time: '20:00', calls: 38 },
          { time: '23:00', calls: 22 }
        ],
        topPerforming: [
          { region: 'North Region', reports: 345, resolved: 298, satisfaction: 4.8 },
          { region: 'South Region', reports: 298, resolved: 256, satisfaction: 4.7 },
          { region: 'East Region', reports: 267, resolved: 223, satisfaction: 4.6 },
          { region: 'West Region', reports: 312, resolved: 267, satisfaction: 4.8 }
        ]
      };
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  };

  const getCurrentUserData = () => analytics?.userData[timeframe] || [];
  const getCurrentReportsData = () => analytics?.reportsData[timeframe] || [];

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p>Real-time platform analytics and insights</p>
        <div className="timeframe-selector">
          <button className={timeframe === 'week' ? 'active' : ''} onClick={() => setTimeframe('week')}>
            Week
          </button>
          <button className={timeframe === 'month' ? 'active' : ''} onClick={() => setTimeframe('month')}>
            Month
          </button>
          <button className={timeframe === 'year' ? 'active' : ''} onClick={() => setTimeframe('year')}>
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analytics data...</div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-value">{analytics.overview.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-trend positive">↑ {analytics.overview.userGrowth}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <div className="stat-value">{analytics.overview.activeUsers.toLocaleString()}</div>
                <div className="stat-label">Active Users</div>
                <div className="stat-trend">{(analytics.overview.activeUsers / analytics.overview.totalUsers * 100).toFixed(1)}% of total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{analytics.overview.totalReports.toLocaleString()}</div>
                <div className="stat-label">Total Reports</div>
                <div className="stat-trend negative">↓ {Math.abs(analytics.overview.reportGrowth)}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <div className="stat-value">{analytics.overview.resolvedReports.toLocaleString()}</div>
                <div className="stat-label">Resolved Reports</div>
                <div className="stat-trend positive">{analytics.overview.successRate}% success rate</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-info">
                <div className="stat-value">{analytics.overview.emergencyCalls.toLocaleString()}</div>
                <div className="stat-label">Emergency Calls</div>
                <div className="stat-trend">Last 30 days</div>
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="chart-card">
            <h3>User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getCurrentUserData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'year' ? 'month' : 'date'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#007bff" fill="#007bff" fillOpacity={0.3} name="Total Users" />
                <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#28a745" fill="#28a745" fillOpacity={0.3} name="New Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="charts-row">
            {/* Reports Chart */}
            <div className="chart-card">
              <h3>Reports & Resolution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCurrentReportsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeframe === 'year' ? 'month' : 'date'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" fill="#dc3545" name="Reports Received" />
                  <Bar dataKey="resolved" fill="#28a745" name="Resolved Reports" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="chart-card">
              <h3>Report Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts-row">
            {/* Emergency Call Pattern */}
            <div className="chart-card">
              <h3>Emergency Call Pattern</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.emergencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#fd7e14" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performing Regions */}
            <div className="chart-card">
              <h3>Regional Performance</h3>
              <div className="region-table">
                <table>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Reports</th>
                      <th>Resolved</th>
                      <th>Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPerforming.map((region, i) => (
                      <tr key={i}>
                        <td>{region.region}</td>
                        <td>{region.reports}</td>
                        <td>{region.resolved}</td>
                        <td>⭐ {region.satisfaction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="insights-section">
            <h3>AI-Powered Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <h4>User Growth Prediction</h4>
                <p>Projected 15% increase in user base over next quarter</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">⚠️</div>
                <h4>High Risk Areas</h4>
                <p>Cyber crime reports increased by 23% in East region</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <h4>Response Time</h4>
                <p>Average emergency response time: 4.2 minutes</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📊</div>
                <h4>User Engagement</h4>
                <p>Active users increased by 8.5% this month</p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .analytics-dashboard {
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

        .dashboard-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 16px;
        }

        .timeframe-selector {
          display: flex;
          gap: 10px;
        }

        .timeframe-selector button {
          padding: 8px 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeframe-selector button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
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
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
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
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }

        .stat-trend {
          font-size: 12px;
        }

        .stat-trend.positive {
          color: #28a745;
        }

        .stat-trend.negative {
          color: #dc3545;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-card h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .region-table {
          overflow-x: auto;
        }

        .region-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .region-table th,
        .region-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .region-table th {
          font-weight: 600;
          color: #666;
        }

        .insights-section {
          margin-top: 30px;
        }

        .insights-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .insight-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .insight-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .insight-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
