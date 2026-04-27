import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskAnalysis = () => {
  const [riskFactors, setRiskFactors] = useState([]);
  const [overallRisk, setOverallRisk] = useState(0);
  const [riskHistory, setRiskHistory] = useState([]);
  const [riskCategories, setRiskCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [riskTrend, setRiskTrend] = useState('stable');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchRiskData();
    const interval = setInterval(fetchRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiskData = async () => {
    try {
      // Comprehensive risk factors data
      const mockRiskFactors = [
        {
          id: 1,
          category: 'Account Security',
          score: 85,
          weight: 25,
          trend: '+5%',
          factors: [
            { name: 'Password Strength', score: 90, status: 'good', critical: false },
            { name: '2FA Enabled', score: 80, status: 'warning', critical: true },
            { name: 'Login History', score: 85, status: 'good', critical: false },
            { name: 'Account Age', score: 95, status: 'good', critical: false },
            { name: 'Recovery Options', score: 75, status: 'warning', critical: true }
          ]
        },
        {
          id: 2,
          category: 'Device Security',
          score: 72,
          weight: 20,
          trend: '-3%',
          factors: [
            { name: 'Device Age', score: 80, status: 'good', critical: false },
            { name: 'Software Updates', score: 65, status: 'warning', critical: true },
            { name: 'Antivirus', score: 70, status: 'warning', critical: true },
            { name: 'Encryption', score: 75, status: 'warning', critical: false },
            { name: 'Firewall', score: 85, status: 'good', critical: false }
          ]
        },
        {
          id: 3,
          category: 'Network Security',
          score: 78,
          weight: 15,
          trend: '+2%',
          factors: [
            { name: 'VPN Usage', score: 60, status: 'critical', critical: true },
            { name: 'Public WiFi', score: 85, status: 'good', critical: false },
            { name: 'Firewall', score: 90, status: 'good', critical: false },
            { name: 'DNS Security', score: 82, status: 'good', critical: false },
            { name: 'Network Encryption', score: 73, status: 'warning', critical: true }
          ]
        },
        {
          id: 4,
          category: 'Behavioral Risk',
          score: 88,
          weight: 20,
          trend: '+8%',
          factors: [
            { name: 'Login Patterns', score: 85, status: 'good', critical: false },
            { name: 'Transaction History', score: 90, status: 'good', critical: false },
            { name: 'Suspicious Activity', score: 88, status: 'good', critical: false },
            { name: 'Geolocation Consistency', score: 92, status: 'good', critical: false },
            { name: 'Device Fingerprint', score: 86, status: 'good', critical: false }
          ]
        },
        {
          id: 5,
          category: 'Data Privacy',
          score: 82,
          weight: 20,
          trend: '+4%',
          factors: [
            { name: 'Data Sharing', score: 78, status: 'warning', critical: true },
            { name: 'Privacy Settings', score: 85, status: 'good', critical: false },
            { name: 'Third-party Access', score: 80, status: 'warning', critical: true },
            { name: 'Data Encryption', score: 88, status: 'good', critical: false },
            { name: 'Backup Frequency', score: 79, status: 'warning', critical: false }
          ]
        }
      ];

      // Risk history data
      const mockRiskHistory = {
        week: [
          { date: 'Mon', risk: 72, account: 78, device: 68, network: 75, behavioral: 82, privacy: 76 },
          { date: 'Tue', risk: 74, account: 79, device: 69, network: 76, behavioral: 83, privacy: 77 },
          { date: 'Wed', risk: 73, account: 80, device: 70, network: 75, behavioral: 84, privacy: 78 },
          { date: 'Thu', risk: 76, account: 82, device: 71, network: 77, behavioral: 85, privacy: 79 },
          { date: 'Fri', risk: 75, account: 83, device: 72, network: 76, behavioral: 86, privacy: 80 },
          { date: 'Sat', risk: 78, account: 84, device: 72, network: 78, behavioral: 87, privacy: 81 },
          { date: 'Sun', risk: 79, account: 85, device: 72, network: 78, behavioral: 88, privacy: 82 }
        ],
        month: [
          { date: 'Week 1', risk: 68, account: 75, device: 65, network: 70, behavioral: 80, privacy: 72 },
          { date: 'Week 2', risk: 71, account: 78, device: 67, network: 72, behavioral: 82, privacy: 75 },
          { date: 'Week 3', risk: 74, account: 80, device: 69, network: 74, behavioral: 84, privacy: 78 },
          { date: 'Week 4', risk: 79, account: 85, device: 72, network: 78, behavioral: 88, privacy: 82 }
        ],
        year: [
          { date: 'Jan', risk: 65, account: 70, device: 60, network: 68, behavioral: 75, privacy: 70 },
          { date: 'Feb', risk: 67, account: 72, device: 62, network: 69, behavioral: 77, privacy: 72 },
          { date: 'Mar', risk: 70, account: 74, device: 64, network: 71, behavioral: 79, privacy: 74 },
          { date: 'Apr', risk: 72, account: 76, device: 65, network: 72, behavioral: 81, privacy: 75 },
          { date: 'May', risk: 74, account: 78, device: 67, network: 74, behavioral: 83, privacy: 77 },
          { date: 'Jun', risk: 76, account: 80, device: 69, network: 75, behavioral: 85, privacy: 79 },
          { date: 'Jul', risk: 79, account: 85, device: 72, network: 78, behavioral: 88, privacy: 82 }
        ]
      };

      // Risk categories for pie chart
      const mockRiskCategories = [
        { name: 'Account Security', value: 85, color: '#28a745' },
        { name: 'Device Security', value: 72, color: '#ffc107' },
        { name: 'Network Security', value: 78, color: '#17a2b8' },
        { name: 'Behavioral Risk', value: 88, color: '#28a745' },
        { name: 'Data Privacy', value: 82, color: '#28a745' }
      ];

      // Calculate overall risk score
      const totalScore = mockRiskFactors.reduce((sum, factor) => 
        sum + (factor.score * factor.weight / 100), 0);
      
      // Generate alerts based on risk factors
      const criticalFactors = mockRiskFactors.flatMap(f => 
        f.factors.filter(ff => ff.critical && ff.status !== 'good')
      );
      
      const newAlerts = criticalFactors.map(factor => ({
        id: Date.now() + Math.random(),
        title: `${factor.name} Requires Attention`,
        description: `Your ${factor.name.toLowerCase()} score is ${factor.score}%. Immediate action recommended.`,
        severity: factor.status === 'critical' ? 'critical' : 'warning',
        timestamp: new Date(),
        action: `Improve ${factor.name}`
      }));

      setRiskFactors(mockRiskFactors);
      setOverallRisk(totalScore);
      setRiskHistory(mockRiskHistory[selectedTimeframe]);
      setRiskCategories(mockRiskCategories);
      setAlerts(newAlerts.slice(0, 3));
      
      // Determine risk trend
      const historyData = mockRiskHistory[selectedTimeframe];
      const trend = historyData[historyData.length - 1].risk - historyData[0].risk;
      setRiskTrend(trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable');
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching risk data:', error);
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 85) return { level: 'Low Risk', color: '#28a745', icon: '🟢', description: 'Your security posture is strong' };
    if (score >= 70) return { level: 'Moderate Risk', color: '#ffc107', icon: '🟡', description: 'Moderate security risks detected' };
    if (score >= 50) return { level: 'High Risk', color: '#fd7e14', icon: '🟠', description: 'High security risks require attention' };
    return { level: 'Critical Risk', color: '#dc3545', icon: '🔴', description: 'Critical security vulnerabilities detected' };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return '✓';
      case 'warning': return '⚠️';
      case 'critical': return '🔴';
      default: return '•';
    }
  };

  const riskLevel = getRiskLevel(overallRisk);
  const COLORS = ['#28a745', '#ffc107', '#17a2b8', '#28a745', '#28a745'];

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    fetchRiskData();
  };

  return (
    <div className="risk-analysis">
      <div className="analysis-header">
        <h2>Risk Analysis Dashboard</h2>
        <p>AI-powered security risk assessment and real-time monitoring</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing risk factors and security posture...</p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="overview-cards">
            <div className="overview-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <div className="card-label">Overall Risk Score</div>
                <div className="card-value" style={{ color: riskLevel.color }}>{Math.round(overallRisk)}%</div>
                <div className="card-trend">
                  {riskTrend === 'increasing' && '📈 Risk increasing'}
                  {riskTrend === 'decreasing' && '📉 Risk decreasing'}
                  {riskTrend === 'stable' && '➡️ Risk stable'}
                </div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">⚠️</div>
              <div className="card-content">
                <div className="card-label">Active Alerts</div>
                <div className="card-value">{alerts.length}</div>
                <div className="card-trend">Requires attention</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">🎯</div>
              <div className="card-content">
                <div className="card-label">Risk Level</div>
                <div className="card-value" style={{ color: riskLevel.color }}>{riskLevel.level}</div>
                <div className="card-trend">{riskLevel.description}</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <div className="card-label">Improvement</div>
                <div className="card-value" style={{ color: '#28a745' }}>+12%</div>
                <div className="card-trend">From last month</div>
              </div>
            </div>
          </div>

          {/* Main Score Display */}
          <div className="score-section">
            <div className="score-circle-container">
              <div className="score-circle">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle
                    cx="110"
                    cy="110"
                    r="95"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="15"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="95"
                    fill="none"
                    stroke={riskLevel.color}
                    strokeWidth="15"
                    strokeDasharray={`${2 * Math.PI * 95 * overallRisk / 100} ${2 * Math.PI * 95 * (100 - overallRisk) / 100}`}
                    strokeDashoffset={2 * Math.PI * 95 * 0.25}
                    transform="rotate(-90 110 110)"
                  />
                  <text
                    x="110"
                    y="125"
                    textAnchor="middle"
                    fontSize="42"
                    fontWeight="bold"
                    fill={riskLevel.color}
                  >
                    {Math.round(overallRisk)}%
                  </text>
                  <text
                    x="110"
                    y="155"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#666"
                  >
                    Overall Security Score
                  </text>
                </svg>
              </div>
              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Risk Category:</span>
                  <span className="detail-value" style={{ color: riskLevel.color }}>{riskLevel.level}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Risk Description:</span>
                  <span className="detail-value">{riskLevel.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Recommendation:</span>
                  <span className="detail-value">
                    {overallRisk >= 85 ? 'Maintain current security practices' :
                     overallRisk >= 70 ? 'Address moderate risk factors' :
                     overallRisk >= 50 ? 'Immediate security improvements needed' :
                     'Critical - Take immediate action'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              Risk Overview
            </button>
            <button className={`tab ${activeTab === 'factors' ? 'active' : ''}`} onClick={() => setActiveTab('factors')}>
              Risk Factors
            </button>
            <button className={`tab ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => setActiveTab('trends')}>
              Trends & Analytics
            </button>
            <button className={`tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
              Alerts ({alerts.length})
            </button>
            <button className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('recommendations')}>
              Recommendations
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="risk-factors-summary">
                <h3>Risk Factor Analysis</h3>
                <div className="factors-grid">
                  {riskFactors.map(factor => (
                    <div key={factor.id} className="factor-summary-card">
                      <div className="factor-header">
                        <span className="factor-name">{factor.category}</span>
                        <span className="factor-score" style={{ color: getRiskLevel(factor.score).color }}>
                          {factor.score}%
                        </span>
                      </div>
                      <div className="factor-bar">
                        <div className="factor-fill" style={{ width: `${factor.score}%`, backgroundColor: getRiskLevel(factor.score).color }} />
                      </div>
                      <div className="factor-trend">
                        Trend: {factor.trend}
                      </div>
                      <div className="factor-weight">
                        Weight: {factor.weight}% | Impact: {Math.round(factor.score * factor.weight / 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="category-distribution">
                <h3>Risk Category Distribution</h3>
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Risk Factors Tab */}
          {activeTab === 'factors' && (
            <div className="factors-tab">
              {riskFactors.map(factor => (
                <div key={factor.id} className="detailed-factor-card">
                  <h3>{factor.category}</h3>
                  <div className="sub-factors">
                    {factor.factors.map((subFactor, idx) => (
                      <div key={idx} className="sub-factor">
                        <div className="sub-factor-header">
                          <div className="sub-factor-info">
                            <span className="sub-factor-name">{subFactor.name}</span>
                            <span className={`sub-factor-badge ${subFactor.status}`}>
                              {getStatusIcon(subFactor.status)} {subFactor.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="sub-factor-score" style={{ color: getStatusColor(subFactor.status) }}>
                            {subFactor.score}%
                          </div>
                        </div>
                        <div className="sub-factor-bar">
                          <div className="sub-factor-fill" style={{ width: `${subFactor.score}%`, backgroundColor: getStatusColor(subFactor.status) }} />
                        </div>
                        {subFactor.critical && subFactor.status !== 'good' && (
                          <div className="critical-warning">⚠️ Critical security factor - Immediate attention required</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="trends-tab">
              <div className="timeframe-selector">
                <button className={`timeframe-btn ${selectedTimeframe === 'week' ? 'active' : ''}`} onClick={() => handleTimeframeChange('week')}>
                  Week
                </button>
                <button className={`timeframe-btn ${selectedTimeframe === 'month' ? 'active' : ''}`} onClick={() => handleTimeframeChange('month')}>
                  Month
                </button>
                <button className={`timeframe-btn ${selectedTimeframe === 'year' ? 'active' : ''}`} onClick={() => handleTimeframeChange('year')}>
                  Year
                </button>
              </div>

              <div className="trend-chart">
                <h3>Overall Risk Trend</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={riskHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="risk" stroke="#dc3545" strokeWidth={2} dot={{ r: 4 }} name="Overall Risk" />
                    <Line type="monotone" dataKey="account" stroke="#28a745" strokeWidth={1} name="Account Security" />
                    <Line type="monotone" dataKey="device" stroke="#ffc107" strokeWidth={1} name="Device Security" />
                    <Line type="monotone" dataKey="network" stroke="#17a2b8" strokeWidth={1} name="Network Security" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="risk-insights">
                <h3>AI Risk Insights</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon">🤖</div>
                    <h4>Predictive Analysis</h4>
                    <p>Based on current trends, risk score is projected to {riskTrend === 'increasing' ? 'increase' : riskTrend === 'decreasing' ? 'decrease' : 'remain stable'} by 5-8% in the next 30 days</p>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">📊</div>
                    <h4>Anomaly Detection</h4>
                    <p>{Math.floor(Math.random() * 5) + 1} unusual patterns detected in the last {selectedTimeframe}</p>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">🎯</div>
                    <h4>High Risk Areas</h4>
                    <p>Device security and network security require immediate attention</p>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">📈</div>
                    <h4>Improvement Areas</h4>
                    <p>Focus on enabling 2FA and updating software for best results</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="alerts-tab">
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <div key={alert.id} className={`alert-card ${alert.severity}`}>
                    <div className="alert-icon">
                      {alert.severity === 'critical' ? '🔴' : '⚠️'}
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-description">{alert.description}</div>
                      <div className="alert-time">{alert.timestamp.toLocaleString()}</div>
                    </div>
                    <button className="alert-action">{alert.action}</button>
                  </div>
                ))
              ) : (
                <div className="no-alerts">
                  <div className="no-alerts-icon">✓</div>
                  <p>No active alerts. Your security posture is good!</p>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="recommendations-tab">
              <div className="recommendations-list">
                <div className="recommendation-card priority-high">
                  <div className="rec-priority">High Priority</div>
                  <div className="rec-title">Enable Two-Factor Authentication</div>
                  <div className="rec-description">2FA adds an extra layer of security to your account and significantly reduces unauthorized access risk.</div>
                  <div className="rec-impact">Impact: +15% to Account Security Score</div>
                  <button className="rec-action">Enable Now</button>
                </div>

                <div className="recommendation-card priority-high">
                  <div className="rec-priority">High Priority</div>
                  <div className="rec-title">Update Device Software</div>
                  <div className="rec-description">Your device has pending security updates. Install them to protect against known vulnerabilities.</div>
                  <div className="rec-impact">Impact: +12% to Device Security Score</div>
                  <button className="rec-action">Check Updates</button>
                </div>

                <div className="recommendation-card priority-medium">
                  <div className="rec-priority">Medium Priority</div>
                  <div className="rec-title">Use VPN on Public Networks</div>
                  <div className="rec-description">Protect your data when using public WiFi by using a trusted VPN service.</div>
                  <div className="rec-impact">Impact: +8% to Network Security Score</div>
                  <button className="rec-action">Configure VPN</button>
                </div>

                <div className="recommendation-card priority-medium">
                  <div className="rec-priority">Medium Priority</div>
                  <div className="rec-title">Review Third-Party Access</div>
                  <div className="rec-description">Review and revoke access for unused third-party applications connected to your account.</div>
                  <div className="rec-impact">Impact: +5% to Data Privacy Score</div>
                  <button className="rec-action">Review Access</button>
                </div>

                <div className="recommendation-card priority-low">
                  <div className="rec-priority">Low Priority</div>
                  <div className="rec-title">Regular Password Update</div>
                  <div className="rec-description">Consider updating your password to maintain strong security practices.</div>
                  <div className="rec-impact">Impact: +3% to Account Security Score</div>
                  <button className="rec-action">Update Password</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .risk-analysis {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .analysis-header {
          margin-bottom: 30px;
        }

        .analysis-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .analysis-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .loading {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 12px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .overview-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .overview-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .overview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .card-icon {
          font-size: 48px;
        }

        .card-content {
          flex: 1;
        }

        .card-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .card-value {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .card-trend {
          font-size: 12px;
          color: #999;
        }

        .score-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .score-circle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .score-details {
          flex: 1;
          max-width: 400px;
        }

        .detail-item {
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .detail-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .tabs {
          display: flex;
          gap: 5px;
          margin-bottom: 25px;
          border-bottom: 1px solid #e0e0e0;
          overflow-x: auto;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab:hover {
          color: #007bff;
        }

        .tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .overview-tab {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .risk-factors-summary h3, .category-distribution h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .factors-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .factor-summary-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .factor-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .factor-name {
          font-weight: 500;
          color: #333;
        }

        .factor-score {
          font-weight: bold;
        }

        .factor-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .factor-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .factor-trend, .factor-weight {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .pie-chart-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .factors-tab {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 20px;
        }

        .detailed-factor-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .detailed-factor-card h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .sub-factors {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sub-factor {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .sub-factor-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .sub-factor-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sub-factor-name {
          font-size: 14px;
          color: #333;
        }

        .sub-factor-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .sub-factor-badge.good {
          background: #d4edda;
          color: #155724;
        }

        .sub-factor-badge.warning {
          background: #fff3cd;
          color: #856404;
        }

        .sub-factor-badge.critical {
          background: #f8d7da;
          color: #721c24;
        }

        .sub-factor-score {
          font-weight: bold;
          font-size: 14px;
        }

        .sub-factor-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .sub-factor-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .critical-warning {
          font-size: 11px;
          color: #dc3545;
          margin-top: 5px;
        }

        .trends-tab {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .timeframe-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .timeframe-btn {
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeframe-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .trend-chart {
          margin-bottom: 30px;
        }

        .trend-chart h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .risk-insights h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .insight-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .insight-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
          line-height: 1.5;
        }

        .alerts-tab {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .alert-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .alert-card.critical {
          border-left-color: #dc3545;
        }

        .alert-card.warning {
          border-left-color: #ffc107;
        }

        .alert-icon {
          font-size: 32px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .alert-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .alert-time {
          font-size: 11px;
          color: #999;
        }

        .alert-action {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .no-alerts {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 12px;
        }

        .no-alerts-icon {
          font-size: 64px;
          color: #28a745;
          margin-bottom: 20px;
        }

        .recommendations-tab {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .recommendation-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .recommendation-card.priority-high {
          border-left-color: #dc3545;
        }

        .recommendation-card.priority-medium {
          border-left-color: #ffc107;
        }

        .recommendation-card.priority-low {
          border-left-color: #28a745;
        }

        .rec-priority {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .priority-high .rec-priority {
          background: #f8d7da;
          color: #721c24;
        }

        .priority-medium .rec-priority {
          background: #fff3cd;
          color: #856404;
        }

        .priority-low .rec-priority {
          background: #d4edda;
          color: #155724;
        }

        .rec-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .rec-description {
          color: #666;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .rec-impact {
          font-size: 13px;
          color: #28a745;
          margin-bottom: 15px;
        }

        .rec-action {
          padding: 8px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .rec-action:hover {
          background: #0056b3;
        }

        @media (max-width: 768px) {
          .overview-tab {
            grid-template-columns: 1fr;
          }

          .score-circle-container {
            flex-direction: column;
            text-align: center;
          }

          .factors-tab {
            grid-template-columns: 1fr;
          }

          .overview-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RiskAnalysis;
