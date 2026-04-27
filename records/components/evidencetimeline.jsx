import React from 'react';

const EvidenceTimeline = ({ evidence }) => {
  const timelineData = [
    { date: '2024-01-10', event: 'Evidence Collected', location: 'Crime Scene', collectedBy: 'Officer Smith' },
    { date: '2024-01-11', event: 'Evidence Logged', location: 'Police Station', collectedBy: 'Officer Davis' },
    { date: '2024-01-12', event: 'Forensic Analysis', location: 'Lab', collectedBy: 'Forensic Team' },
    { date: '2024-01-13', event: 'Chain of Custody Verified', location: 'Evidence Room', collectedBy: 'Supervisor' }
  ];

  return (
    <div className="evidence-timeline">
      <h3>Evidence Chain of Custody</h3>
      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-event">{item.event}</div>
              <div className="timeline-location">📍 {item.location}</div>
              <div className="timeline-officer">👮 {item.collectedBy}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .evidence-timeline {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .evidence-timeline h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .timeline-container {
          position: relative;
          padding-left: 30px;
        }

        .timeline-container::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e0e0e0;
        }

        .timeline-item {
          position: relative;
          padding-bottom: 25px;
        }

        .timeline-dot {
          position: absolute;
          left: -22px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #007bff;
          border: 2px solid white;
          box-shadow: 0 0 0 2px #e0e0e0;
        }

        .timeline-content {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
        }

        .timeline-date {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .timeline-event {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .timeline-location, .timeline-officer {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default EvidenceTimeline;
