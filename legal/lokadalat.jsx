import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const LokAdalat = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [caseApplications, setCaseApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({
    caseType: '',
    description: '',
    parties: '',
    expectedAmount: '',
    documents: []
  });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [stats, setStats] = useState({
    totalCases: 0,
    resolved: 0,
    pending: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchLokAdalatData();
  }, []);

  const fetchLokAdalatData = async () => {
    const mockUpcomingSessions = [
      {
        id: 1,
        title: 'National Lok Adalat - Civil Cases',
        date: new Date(2024, 1, 15),
        time: '10:00 AM - 5:00 PM',
        venue: 'District Court Complex, Room 101',
        presidingOfficer: 'Hon\'ble Justice Sharma',
        caseTypes: ['Civil Disputes', 'Property Cases', 'Family Matters'],
        capacity: 100,
        registered: 67,
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Lok Adalat - Motor Accident Claims',
        date: new Date(2024, 1, 20),
        time: '9:30 AM - 4:30 PM',
        venue: 'High Court Campus, Hall B',
        presidingOfficer: 'Justice Patel',
        caseTypes: ['Accident Claims', 'Insurance Matters'],
        capacity: 80,
        registered: 52,
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Special Lok Adalat - Matrimonial Disputes',
        date: new Date(2024, 2, 5),
        time: '10:00 AM - 3:00 PM',
        venue: 'Family Court Building',
        presidingOfficer: 'Justice Reddy',
        caseTypes: ['Divorce', 'Maintenance', 'Child Custody'],
        capacity: 60,
        registered: 41,
        status: 'upcoming'
      }
    ];

    const mockPastSessions = [
      {
        id: 4,
        title: 'National Lok Adalat - December 2023',
        date: new Date(2023, 11, 10),
        casesFiled: 245,
        casesResolved: 198,
        settlementAmount: '₹2.5 Cr',
        presidingOfficer: 'Justice Kumar',
        highlights: 'Successful resolution of 198 cases'
      },
      {
        id: 5,
        title: 'Lok Adalat - Consumer Disputes',
        date: new Date(2023, 10, 25),
        casesFiled: 156,
        casesResolved: 134,
        settlementAmount: '₹85 Lakhs',
        presidingOfficer: 'Justice Singh',
        highlights: 'Fast-track resolution of consumer complaints'
      }
    ];

    const mockApplications = [
      {
        id: 1,
        caseNumber: 'LA/2024/001',
        caseType: 'Property Dispute',
        applicant: 'Ramesh Kumar',
        filedDate: '2024-01-10',
        status: 'Pending',
        hearingDate: '2024-02-15'
      },
      {
        id: 2,
        caseNumber: 'LA/2024/002',
        caseType: 'Motor Accident Claim',
        applicant: 'Sunita Devi',
        filedDate: '2024-01-05',
        status: 'Scheduled',
        hearingDate: '2024-02-20'
      }
    ];

    setUpcomingSessions(mockUpcomingSessions);
    setPastSessions(mockPastSessions);
    setCaseApplications(mockApplications);
    setStats({
      totalCases: 458,
      resolved: 392,
      pending: 66,
      successRate: 85.6
    });
  };

  const handleApplyForSession = (session) => {
    setSelectedSession(session);
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const newCase = {
      id: caseApplications.length + 1,
      caseNumber: `LA/2024/00${caseApplications.length + 1}`,
      caseType: newApplication.caseType,
      applicant: 'Current User',
      filedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      hearingDate: selectedSession?.date.toISOString().split('T')[0]
    };
    setCaseApplications([...caseApplications, newCase]);
    setShowApplicationForm(false);
    setNewApplication({
      caseType: '',
      description: '',
      parties: '',
      expectedAmount: '',
      documents: []
    });
    alert('Application submitted successfully! You will receive a confirmation soon.');
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewApplication({
      ...newApplication,
      documents: [...newApplication.documents, ...files.map(f => f.name)]
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ffc107';
      case 'Scheduled': return '#28a745';
      case 'Resolved': return '#007bff';
      default: return '#6c757d';
    }
  };

  const calendarEvents = upcomingSessions.map(session => ({
    title: session.title,
    start: session.date,
    end: session.date,
    resource: session
  }));

  return (
    <div className="lok-adalat">
      <div className="legal-header">
        <h2>Lok Adalat - People's Court</h2>
        <p>Alternative dispute resolution for speedy and amicable settlements</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalCases}</div>
            <div className="stat-label">Total Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-value">{stats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="legal-tabs">
        <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
          Upcoming Sessions
        </button>
        <button className={`tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          Calendar View
        </button>
        <button className={`tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          My Applications
        </button>
        <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
          Past Sessions
        </button>
        <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          Information
        </button>
      </div>

      {/* Upcoming Sessions */}
      {activeTab === 'upcoming' && (
        <div className="sessions-list">
          {upcomingSessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-date">
                <div className="date-day">{session.date.getDate()}</div>
                <div className="date-month">{session.date.toLocaleString('default', { month: 'short' })}</div>
              </div>
              <div className="session-info">
                <h3>{session.title}</h3>
                <div className="session-details">
                  <span>🕒 {session.time}</span>
                  <span>📍 {session.venue}</span>
                  <span>👨‍⚖️ {session.presidingOfficer}</span>
                </div>
                <div className="session-types">
                  {session.caseTypes.map((type, i) => (
                    <span key={i} className="case-type-badge">{type}</span>
                  ))}
                </div>
                <div className="session-capacity">
                  <div className="capacity-bar">
                    <div className="capacity-fill" style={{ width: `${(session.registered / session.capacity) * 100}%` }} />
                  </div>
                  <span>{session.registered}/{session.capacity} registered</span>
                </div>
              </div>
              <button className="apply-btn" onClick={() => handleApplyForSession(session)}>
                Apply for Hearing
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="calendar-view">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={(event) => setSelectedSession(event.resource)}
          />
          {selectedSession && (
            <div className="calendar-modal">
              <h4>{selectedSession.title}</h4>
              <p>Date: {selectedSession.date.toLocaleDateString()}</p>
              <p>Time: {selectedSession.time}</p>
              <p>Venue: {selectedSession.venue}</p>
              <button onClick={() => handleApplyForSession(selectedSession)}>Apply Now</button>
              <button onClick={() => setSelectedSession(null)}>Close</button>
            </div>
          )}
        </div>
      )}

      {/* My Applications */}
      {activeTab === 'applications' && (
        <div className="applications-list">
          {caseApplications.map(app => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <div className="application-number">{app.caseNumber}</div>
                <div className="application-status" style={{ backgroundColor: getStatusColor(app.status) }}>
                  {app.status}
                </div>
              </div>
              <div className="application-details">
                <div>Case Type: {app.caseType}</div>
                <div>Applicant: {app.applicant}</div>
                <div>Filed: {app.filedDate}</div>
                {app.hearingDate && <div>Hearing Date: {app.hearingDate}</div>}
              </div>
              <div className="application-actions">
                <button className="track-btn">Track Status</button>
                <button className="docs-btn">Upload Documents</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Sessions */}
      {activeTab === 'past' && (
        <div className="past-sessions">
          {pastSessions.map(session => (
            <div key={session.id} className="past-session-card">
              <div className="past-session-date">
                {session.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="past-session-info">
                <h4>{session.title}</h4>
                <div className="past-session-stats">
                  <span>📋 Cases Filed: {session.casesFiled}</span>
                  <span>✓ Cases Resolved: {session.casesResolved}</span>
                  <span>💰 Settlement: {session.settlementAmount}</span>
                </div>
                <div className="past-session-highlight">
                  <strong>Highlight:</strong> {session.highlights}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Tab */}
      {activeTab === 'info' && (
        <div className="info-section">
          <div className="info-card">
            <h3>What is Lok Adalat?</h3>
            <p>Lok Adalat is a dispute resolution mechanism where cases pending in court or at pre-litigation stage are settled amicably. It provides speedy, cost-effective, and mutually acceptable resolutions.</p>
          </div>

          <div className="info-card">
            <h3>Benefits of Lok Adalat</h3>
            <ul>
              <li>✓ Speedy resolution of disputes</li>
              <li>✓ No court fees or minimal fees</li>
              <li>✓ Mutually acceptable settlements</li>
              <li>✓ Binding decisions with finality</li>
              <li>✓ Reduces burden on regular courts</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Cases Suitable for Lok Adalat</h3>
            <div className="case-types-grid">
              <div className="case-type">🏠 Property Disputes</div>
              <div className="case-type">🚗 Motor Accident Claims</div>
              <div className="case-type">💳 Bank Recovery Cases</div>
              <div className="case-type">👨‍👩‍👧 Family & Matrimonial Disputes</div>
              <div className="case-type">🏢 Labour Disputes</div>
              <div className="case-type">📄 Contractual Matters</div>
            </div>
          </div>

          <div className="info-card">
            <h3>How to Apply</h3>
            <ol>
              <li>Register for an upcoming Lok Adalat session</li>
              <li>Submit your case details and supporting documents</li>
              <li>Receive confirmation and hearing date</li>
              <li>Attend the hearing with all necessary documents</li>
              <li>Participate in mediation and reach settlement</li>
            </ol>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Apply for Lok Adalat Hearing</h3>
            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Case Type *</label>
                <select required value={newApplication.caseType} onChange={(e) => setNewApplication({...newApplication, caseType: e.target.value})}>
                  <option value="">Select case type</option>
                  <option value="Property Dispute">Property Dispute</option>
                  <option value="Motor Accident Claim">Motor Accident Claim</option>
                  <option value="Family Matter">Family Matter</option>
                  <option value="Consumer Complaint">Consumer Complaint</option>
                  <option value="Bank Recovery">Bank Recovery</option>
                  <option value="Other Civil Dispute">Other Civil Dispute</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description of Dispute *</label>
                <textarea
                  rows={4}
                  required
                  value={newApplication.description}
                  onChange={(e) => setNewApplication({...newApplication, description: e.target.value})}
                  placeholder="Provide details about your case..."
                />
              </div>

              <div className="form-group">
                <label>Parties Involved</label>
                <input
                  type="text"
                  value={newApplication.parties}
                  onChange={(e) => setNewApplication({...newApplication, parties: e.target.value})}
                  placeholder="Names of opposing parties"
                />
              </div>

              <div className="form-group">
                <label>Expected Settlement Amount (if applicable)</label>
                <input
                  type="text"
                  value={newApplication.expectedAmount}
                  onChange={(e) => setNewApplication({...newApplication, expectedAmount: e.target.value})}
                  placeholder="Amount in ₹"
                />
              </div>

              <div className="form-group">
                <label>Supporting Documents</label>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {newApplication.documents.length > 0 && (
                  <div className="uploaded-files">
                    {newApplication.documents.map((doc, i) => (
                      <span key={i} className="file-tag">📄 {doc}</span>
                    ))}
                  </div>
                )}
                <small>Upload case documents, evidence, or supporting papers (PDF, JPG, PNG)</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Application</button>
                <button type="button" onClick={() => setShowApplicationForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .lok-adalat {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .legal-header {
          margin-bottom: 30px;
        }

        .legal-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .legal-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
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
          color: #007bff;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .legal-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          transition: all 0.2s;
        }

        .tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .session-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .session-card:hover {
          transform: translateX(5px);
        }

        .session-date {
          text-align: center;
          padding: 15px;
          background: #007bff;
          border-radius: 8px;
          color: white;
          min-width: 80px;
        }

        .date-day {
          font-size: 32px;
          font-weight: bold;
        }

        .date-month {
          font-size: 14px;
        }

        .session-info {
          flex: 1;
        }

        .session-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .session-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 10px;
          font-size: 13px;
          color: #666;
        }

        .session-types {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .case-type-badge {
          padding: 4px 8px;
          background: #e7f3ff;
          color: #007bff;
          border-radius: 4px;
          font-size: 11px;
        }

        .session-capacity {
          margin-top: 10px;
        }

        .capacity-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .capacity-fill {
          height: 100%;
          background: #28a745;
        }

        .apply-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          height: fit-content;
        }

        .calendar-view {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .applications-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .application-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .application-number {
          font-weight: bold;
          color: #007bff;
        }

        .application-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .application-details {
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .application-details div {
          margin-bottom: 5px;
        }

        .application-actions {
          display: flex;
          gap: 10px;
        }

        .track-btn, .docs-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .track-btn {
          background: #007bff;
          color: white;
        }

        .docs-btn {
          background: #6c757d;
          color: white;
        }

        .past-sessions {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .past-session-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .past-session-date {
          font-size: 14px;
          color: #007bff;
          margin-bottom: 10px;
        }

        .past-session-info h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .past-session-stats {
          display: flex;
          gap: 20px;
          font-size: 13px;
          color: #666;
          margin-bottom: 10px;
        }

        .info-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .info-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-card h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .info-card p {
          color: #666;
          line-height: 1.6;
        }

        .info-card ul, .info-card ol {
          margin: 0;
          padding-left: 20px;
        }

        .info-card li {
          margin-bottom: 8px;
          color: #666;
        }

        .case-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .case-type {
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 13px;
          color: #666;
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

        .application-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .application-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-weight: 500;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .uploaded-files {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .file-tag {
          padding: 4px 8px;
          background: #e7f3ff;
          border-radius: 4px;
          font-size: 11px;
          color: #007bff;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .submit-btn, .cancel-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .submit-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .session-card {
            flex-direction: column;
          }
          
          .session-date {
            align-self: flex-start;
          }
          
          .info-section {
            grid-template-columns: 1fr;
          }
          
          .case-types-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LokAdalat;
