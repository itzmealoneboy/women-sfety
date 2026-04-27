import React, { useState } from 'react';

const ScholarshipCard = ({ scholarship, onApply, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) onSave(scholarship.id);
  };

  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'expired', color: '#dc3545', text: 'Expired' };
    if (daysLeft < 7) return { status: 'urgent', color: '#dc3545', text: `Urgent: ${daysLeft} days left` };
    if (daysLeft < 30) return { status: 'soon', color: '#ffc107', text: `${daysLeft} days left` };
    return { status: 'open', color: '#28a745', text: `${daysLeft} days left` };
  };

  const deadlineInfo = getDeadlineStatus(scholarship.deadline);

  return (
    <div className={`scholarship-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header">
        <div className="scholarship-icon">{scholarship.icon || '🎓'}</div>
        <div className="header-content">
          <h3>{scholarship.name}</h3>
          <div className="scholarship-meta">
            <span className="provider">{scholarship.provider}</span>
            <span className="amount">₹{scholarship.amount.toLocaleString()}</span>
          </div>
        </div>
        <button className="save-btn" onClick={handleSave}>
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Eligibility:</span>
            <span className="info-value">{scholarship.eligibility}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Course Level:</span>
            <span className="info-value">{scholarship.courseLevel}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Income Limit:</span>
            <span className="info-value">₹{scholarship.incomeLimit.toLocaleString()}/year</span>
          </div>
          <div className="info-item">
            <span className="info-label">Application Fee:</span>
            <span className="info-value">{scholarship.applicationFee === 0 ? 'Free' : `₹${scholarship.applicationFee}`}</span>
          </div>
        </div>

        <div className="deadline-section">
          <div className="deadline-label">Application Deadline:</div>
          <div className="deadline-date" style={{ color: deadlineInfo.color }}>
            {new Date(scholarship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="deadline-days" style={{ color: deadlineInfo.color }}>
            {deadlineInfo.text}
          </div>
        </div>

        <div className="benefits-section">
          <div className="section-title">Benefits Include:</div>
          <ul className="benefits-list">
            {scholarship.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="documents-section">
              <div className="section-title">Required Documents:</div>
              <ul className="documents-list">
                {scholarship.documents.map((doc, index) => (
                  <li key={index}>📄 {doc}</li>
                ))}
              </ul>
            </div>

            <div className="process-section">
              <div className="section-title">Application Process:</div>
              <ol className="process-steps">
                {scholarship.process.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="contact-section">
              <div className="section-title">Contact Information:</div>
              <p>Email: {scholarship.contactEmail}</p>
              <p>Phone: {scholarship.contactPhone}</p>
              <p>Website: <a href={scholarship.website} target="_blank" rel="noopener noreferrer">{scholarship.website}</a></p>
            </div>
          </div>
        )}

        <div className="card-actions">
          <button className="btn-expand" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          <button className="btn-apply" onClick={() => onApply(scholarship.id)}>
            Apply Now
          </button>
        </div>
      </div>

      <style jsx>{`
        .scholarship-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .scholarship-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .scholarship-icon {
          font-size: 48px;
        }

        .header-content {
          flex: 1;
        }

        .header-content h3 {
          margin: 0 0 5px 0;
          font-size: 18px;
        }

        .scholarship-meta {
          display: flex;
          gap: 15px;
          font-size: 13px;
          opacity: 0.9;
        }

        .save-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .save-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .card-content {
          padding: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .deadline-section {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }

        .deadline-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .deadline-date {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .deadline-days {
          font-size: 13px;
          font-weight: 500;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .benefits-section, .documents-section, .process-section, .contact-section {
          margin-bottom: 20px;
        }

        .benefits-list, .documents-list, .process-steps {
          margin: 0;
          padding-left: 20px;
        }

        .benefits-list li, .documents-list li, .process-steps li {
          margin-bottom: 6px;
          color: #666;
          font-size: 13px;
          line-height: 1.5;
        }

        .process-steps {
          padding-left: 20px;
        }

        .contact-section p {
          margin: 5px 0;
          font-size: 13px;
          color: #666;
        }

        .contact-section a {
          color: #007bff;
          text-decoration: none;
        }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-expand, .btn-apply {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-expand {
          background: #f0f0f0;
          color: #666;
        }

        .btn-expand:hover {
          background: #e0e0e0;
        }

        .btn-apply {
          background: #007bff;
          color: white;
        }

        .btn-apply:hover {
          background: #0056b3;
        }

        .expanded-content {
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .card-header {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ScholarshipCard;
