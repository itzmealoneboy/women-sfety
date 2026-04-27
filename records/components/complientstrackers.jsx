import React, { useState } from 'react';

const ComplaintsTracker = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      complaintId: 'CMP-2024-001',
      type: 'Harassment',
      status: 'Processing',
      filedDate: '2024-01-10',
      lastUpdate: '2024-01-12',
      assignedTo: 'Officer Smith',
      response: 'Under review by authorities',
      priority: 'High'
    },
    {
      id: 2,
      complaintId: 'CMP-2024-002',
      type: 'Fraud',
      status: 'Investigation',
      filedDate: '2024-01-05',
      lastUpdate: '2024-01-14',
      assignedTo: 'Detective Williams',
      response: 'Evidence collection in progress',
      priority: 'Critical'
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return '#ffc107';
      case 'Investigation': return '#007bff';
      case 'Resolved': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      default: return '#28a745';
    }
  };

  return (
    <div className="complaints-tracker">
      <div className="tracker-header">
        <h3>Complaints Tracker</h3>
        <button className="new-complaint-btn">+ File New Complaint</button>
      </div>

      <div className="complaints-list">
        {complaints.map(complaint => (
          <div key={complaint.id} className="complaint-card">
            <div className="complaint-header">
              <div className="complaint-id">{complaint.complaintId}</div>
              <div className="complaint-priority" style={{ backgroundColor: getPriorityColor(complaint.priority) }}>
                {complaint.priority} Priority
              </div>
            </div>
            <div className="complaint-type">{complaint.type}</div>
            <div className="complaint-meta">
              <span>Filed: {complaint.filedDate}</span>
              <span>Last Update: {complaint.lastUpdate}</span>
              <span>Assigned: {complaint.assignedTo}</span>
            </div>
            <div className="complaint-status" style={{ backgroundColor: getStatusColor(complaint.status) }}>
              {complaint.status}
            </div>
            <div className="complaint-response">
              <strong>Latest Response:</strong> {complaint.response}
            </div>
            <button className="track-btn">Track Progress</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .complaints-tracker {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .tracker-header h3 {
          margin: 0;
          color: #333;
        }

        .new-complaint-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .complaints-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .complaint-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        .complaint-card:hover {
          transform: translateY(-2px);
        }

        .complaint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .complaint-id {
          font-weight: bold;
          color: #007bff;
        }

        .complaint-priority {
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
        }

        .complaint-type {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .complaint-meta {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #999;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .complaint-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
          margin-bottom: 10px;
        }

        .complaint-response {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }

        .track-btn {
          width: 100%;
          padding: 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ComplaintsTracker;
