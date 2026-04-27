import React, { useState, useEffect } from 'react';

const CertificatesGeneration = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState('professional');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    completionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const mockCertificates = [
      {
        id: 1,
        title: 'Cybersecurity Fundamentals',
        issuer: 'Safety First Academy',
        issueDate: '2024-01-15',
        expiryDate: '2026-01-15',
        credentialId: 'SFA-CS-2024-001',
        status: 'issued',
        score: 95,
        hours: 40,
        downloadUrl: '#'
      },
      {
        id: 2,
        title: 'First Aid Certification',
        issuer: 'Red Cross',
        issueDate: '2024-01-10',
        expiryDate: '2027-01-10',
        credentialId: 'RC-FA-2024-002',
        status: 'issued',
        score: 88,
        hours: 16,
        downloadUrl: '#'
      },
      {
        id: 3,
        title: 'Digital Safety Masterclass',
        issuer: 'Safety First Academy',
        issueDate: null,
        expiryDate: null,
        credentialId: null,
        status: 'pending',
        score: null,
        hours: 20,
        progress: 75
      }
    ];
    setCertificates(mockCertificates);
  };

  const generateCertificate = (course) => {
    setGenerating(true);
    setTimeout(() => {
      const newCertificate = {
        id: Date.now(),
        title: course.title,
        issuer: 'Safety First Academy',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        credentialId: `SFA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'issued',
        score: Math.floor(Math.random() * 15) + 85,
        hours: course.hours
      };
      setCertificates([newCertificate, ...certificates]);
      setGenerating(false);
      alert('Certificate generated successfully!');
    }, 2000);
  };

  const downloadCertificate = (certificate) => {
    // Simulate download
    alert(`Downloading certificate: ${certificate.title}`);
  };

  const verifyCertificate = (credentialId) => {
    alert(`Verifying certificate: ${credentialId}\nCertificate is valid and authentic.`);
  };

  const shareCertificate = (certificate) => {
    alert(`Share certificate: ${certificate.title}\nLink: https://safetyfirst.com/verify/${certificate.credentialId}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'issued': return '#28a745';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="certificates-generation">
      <div className="certificates-header">
        <h2>Certificates & Achievements</h2>
        <p>Generate, download, and share your verified certificates</p>
      </div>

      <div className="certificate-templates">
        <h3>Certificate Templates</h3>
        <div className="templates-grid">
          <div className={`template-card ${template === 'professional' ? 'active' : ''}`} onClick={() => setTemplate('professional')}>
            <div className="template-preview professional">
              <div className="preview-content">
                <div className="preview-seal">🎓</div>
                <div className="preview-title">Certificate of Completion</div>
                <div className="preview-name">Your Name</div>
              </div>
            </div>
            <div className="template-name">Professional</div>
          </div>
          <div className={`template-card ${template === 'elegant' ? 'active' : ''}`} onClick={() => setTemplate('elegant')}>
            <div className="template-preview elegant">
              <div className="preview-content">
                <div className="preview-seal">✨</div>
                <div className="preview-title">Certificate of Excellence</div>
                <div className="preview-name">Your Name</div>
              </div>
            </div>
            <div className="template-name">Elegant</div>
          </div>
          <div className={`template-card ${template === 'modern' ? 'active' : ''}`} onClick={() => setTemplate('modern')}>
            <div className="template-preview modern">
              <div className="preview-content">
                <div className="preview-seal">🚀</div>
                <div className="preview-title">Mastery Certificate</div>
                <div className="preview-name">Your Name</div>
              </div>
            </div>
            <div className="template-name">Modern</div>
          </div>
        </div>
      </div>

      <div className="certificates-list">
        <h3>My Certificates</h3>
        {certificates.map(cert => (
          <div key={cert.id} className={`certificate-card status-${cert.status}`}>
            <div className="certificate-icon">📜</div>
            <div className="certificate-info">
              <div className="certificate-title">{cert.title}</div>
              <div className="certificate-issuer">Issued by: {cert.issuer}</div>
              {cert.issueDate && (
                <div className="certificate-date">Issued: {cert.issueDate}</div>
              )}
              {cert.expiryDate && (
                <div className="certificate-expiry">Expires: {cert.expiryDate}</div>
              )}
              {cert.score && (
                <div className="certificate-score">Score: {cert.score}%</div>
              )}
              <div className="certificate-hours">{cert.hours} hours of learning</div>
              {cert.status === 'pending' && (
                <div className="certificate-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cert.progress}%` }} />
                  </div>
                  <div className="progress-text">{cert.progress}% Complete</div>
                </div>
              )}
            </div>
            <div className="certificate-actions">
              {cert.status === 'issued' ? (
                <>
                  <button onClick={() => downloadCertificate(cert)} className="btn-download">Download</button>
                  <button onClick={() => shareCertificate(cert)} className="btn-share">Share</button>
                  <button onClick={() => verifyCertificate(cert.credentialId)} className="btn-verify">Verify</button>
                </>
              ) : (
                <button onClick={() => generateCertificate(cert)} className="btn-generate" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Certificate'}
                </button>
              )}
            </div>
            {cert.status === 'issued' && (
              <div className="credential-id">ID: {cert.credentialId}</div>
            )}
          </div>
        ))}
      </div>

      <div className="verification-info">
        <h3>Certificate Verification</h3>
        <p>All certificates are blockchain-verified and can be authenticated by employers or institutions.</p>
        <div className="verification-features">
          <div className="feature">
            <div className="feature-icon">🔗</div>
            <div className="feature-text">Blockchain Verified</div>
          </div>
          <div className="feature">
            <div className="feature-icon">✓</div>
            <div className="feature-text">Tamper-Proof</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🌐</div>
            <div className="feature-text">Globally Recognized</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📧</div>
            <div className="feature-text">Share via Email/LinkedIn</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .certificates-generation {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .certificates-header {
          margin-bottom: 30px;
        }

        .certificates-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .certificates-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .certificate-templates {
          margin-bottom: 40px;
        }

        .certificate-templates h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .template-card {
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-card.active .template-preview {
          border: 3px solid #007bff;
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        }

        .template-preview {
          background: white;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 10px;
          transition: all 0.2s;
          border: 2px solid #e0e0e0;
        }

        .template-preview:hover {
          transform: translateY(-2px);
        }

        .preview-seal {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .preview-title {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .preview-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .template-name {
          text-align: center;
          font-size: 13px;
          color: #666;
        }

        .certificates-list {
          margin-bottom: 40px;
        }

        .certificates-list h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .certificate-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          position: relative;
        }

        .certificate-card:hover {
          transform: translateX(5px);
        }

        .certificate-card.status-issued {
          border-left: 4px solid #28a745;
        }

        .certificate-card.status-pending {
          border-left: 4px solid #ffc107;
        }

        .certificate-icon {
          font-size: 48px;
        }

        .certificate-info {
          flex: 1;
        }

        .certificate-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .certificate-issuer, .certificate-date, .certificate-expiry, .certificate-score, .certificate-hours {
          font-size: 13px;
          color: #666;
          margin-bottom: 3px;
        }

        .certificate-progress {
          margin-top: 8px;
        }

        .progress-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #ffc107;
        }

        .progress-text {
          font-size: 11px;
          color: #666;
        }

        .certificate-actions {
          display: flex;
          gap: 10px;
        }

        .btn-download, .btn-share, .btn-verify, .btn-generate {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .btn-download {
          background: #28a745;
          color: white;
        }

        .btn-share {
          background: #007bff;
          color: white;
        }

        .btn-verify {
          background: #17a2b8;
          color: white;
        }

        .btn-generate {
          background: #ffc107;
          color: #333;
        }

        .credential-id {
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 10px;
          color: #999;
        }

        .verification-info {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .verification-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .verification-info p {
          color: #666;
          margin-bottom: 20px;
        }

        .verification-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .feature {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .feature-text {
          font-size: 13px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CertificatesGeneration;
