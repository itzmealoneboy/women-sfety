import React, { useState, useEffect } from 'react';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    earned: 0,
    inProgress: 0,
    locked: 0
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const mockBadges = [
      {
        id: 1,
        name: 'Safety Champion',
        description: 'Completed all basic safety training modules',
        icon: '🛡️',
        category: 'Safety',
        requirement: 'Complete 5 safety modules',
        progress: 100,
        earned: true,
        earnedDate: '2024-01-15',
        points: 500
      },
      {
        id: 2,
        name: 'Cyber Guardian',
        description: 'Mastered cybersecurity fundamentals',
        icon: '🔒',
        category: 'Cybersecurity',
        requirement: 'Pass cybersecurity assessment with 90%+',
        progress: 80,
        earned: false,
        points: 750
      },
      {
        id: 3,
        name: 'First Aid Expert',
        description: 'Completed first aid and emergency response training',
        icon: '🚑',
        category: 'Emergency',
        requirement: 'Complete first aid certification',
        progress: 45,
        earned: false,
        points: 600
      },
      {
        id: 4,
        name: 'Community Leader',
        description: 'Helped 50+ community members with safety tips',
        icon: '👥',
        category: 'Community',
        requirement: 'Earn 50 helpful votes',
        progress: 30,
        earned: false,
        points: 1000
      },
      {
        id: 5,
        name: 'Digital Literacy Master',
        description: 'Completed all digital literacy courses',
        icon: '💻',
        category: 'Technology',
        requirement: 'Complete 10 digital literacy modules',
        progress: 100,
        earned: true,
        earnedDate: '2024-01-10',
        points: 400
      },
      {
        id: 6,
        name: 'Mental Health Advocate',
        description: 'Completed mental health awareness training',
        icon: '🧠',
        category: 'Health',
        requirement: 'Complete mental health first aid course',
        progress: 60,
        earned: false,
        points: 800
      }
    ];

    setBadges(mockBadges);
    const earned = mockBadges.filter(b => b.earned);
    setEarnedBadges(earned);
    setStats({
      total: mockBadges.length,
      earned: earned.length,
      inProgress: mockBadges.filter(b => !b.earned && b.progress > 0).length,
      locked: mockBadges.filter(b => !b.earned && b.progress === 0).length
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Safety: '#28a745',
      Cybersecurity: '#007bff',
      Emergency: '#dc3545',
      Community: '#fd7e14',
      Technology: '#17a2b8',
      Health: '#6f42c1'
    };
    return colors[category] || '#6c757d';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#28a745';
    if (progress >= 50) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="badges-section">
      <div className="badges-header">
        <h2>Achievement Badges</h2>
        <p>Earn badges by completing courses and demonstrating expertise</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{stats.earned}</div>
            <div className="stat-label">Badges Earned</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <div className="stat-value">{stats.locked}</div>
            <div className="stat-label">Locked Badges</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Available</div>
          </div>
        </div>
      </div>

      <div className="badges-grid">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={`badge-card ${badge.earned ? 'earned' : ''}`}
            onClick={() => setSelectedBadge(badge)}
          >
            <div className="badge-icon" style={{ backgroundColor: getCategoryColor(badge.category) }}>
              {badge.icon}
            </div>
            <div className="badge-info">
              <h3>{badge.name}</h3>
              <p className="badge-description">{badge.description}</p>
              <div className="badge-category" style={{ color: getCategoryColor(badge.category) }}>
                {badge.category}
              </div>
              {!badge.earned && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${badge.progress}%`, backgroundColor: getProgressColor(badge.progress) }}
                    />
                  </div>
                  <div className="progress-text">{badge.progress}% Complete</div>
                </div>
              )}
              {badge.earned && (
                <div className="earned-date">
                  Earned: {badge.earnedDate}
                </div>
              )}
            </div>
            <div className="badge-points">
              {badge.points} pts
            </div>
          </div>
        ))}
      </div>

      {selectedBadge && (
        <div className="modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon" style={{ backgroundColor: getCategoryColor(selectedBadge.category) }}>
                {selectedBadge.icon}
              </div>
              <div>
                <h3>{selectedBadge.name}</h3>
                <p className="modal-category">{selectedBadge.category}</p>
              </div>
            </div>
            <div className="modal-content">
              <div className="badge-detail">
                <strong>Description:</strong>
                <p>{selectedBadge.description}</p>
              </div>
              <div className="badge-detail">
                <strong>Requirement:</strong>
                <p>{selectedBadge.requirement}</p>
              </div>
              <div className="badge-detail">
                <strong>Points:</strong>
                <p>{selectedBadge.points} XP</p>
              </div>
              {selectedBadge.earned ? (
                <div className="badge-detail">
                  <strong>Earned On:</strong>
                  <p>{selectedBadge.earnedDate}</p>
                </div>
              ) : (
                <div className="badge-progress-detail">
                  <strong>Progress:</strong>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${selectedBadge.progress}%`, backgroundColor: getProgressColor(selectedBadge.progress) }}
                    />
                  </div>
                  <div className="progress-text">{selectedBadge.progress}% Complete</div>
                  <button className="continue-btn">Continue Learning</button>
                </div>
              )}
            </div>
            <button className="close-btn" onClick={() => setSelectedBadge(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="badge-tips">
        <h3>How to Earn More Badges</h3>
        <div className="tips-list">
          <div className="tip-item">🎯 Complete all modules in a category</div>
          <div className="tip-item">📝 Pass assessments with high scores</div>
          <div className="tip-item">🤝 Participate in community discussions</div>
          <div className="tip-item">⭐ Help other learners with their questions</div>
        </div>
      </div>

      <style jsx>{`
        .badges-section {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .badges-header {
          margin-bottom: 30px;
        }

        .badges-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .badges-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .stats-cards {
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

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .badge-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .badge-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .badge-card.earned {
          background: linear-gradient(135deg, #fff 0%, #f0f8ff 100%);
          border: 1px solid #ffd700;
        }

        .badge-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
        }

        .badge-info {
          flex: 1;
        }

        .badge-info h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 18px;
        }

        .badge-description {
          color: #666;
          font-size: 13px;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .badge-category {
          font-size: 11px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .progress-container {
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
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 11px;
          color: #666;
        }

        .earned-date {
          font-size: 11px;
          color: #28a745;
          margin-top: 5px;
        }

        .badge-points {
          font-size: 14px;
          font-weight: bold;
          color: #ffc107;
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

        .badge-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
        }

        .modal-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .modal-category {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .badge-detail {
          margin-bottom: 15px;
        }

        .badge-detail strong {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .badge-detail p {
          margin: 0;
          color: #333;
        }

        .badge-progress-detail {
          margin-top: 20px;
        }

        .badge-progress-detail strong {
          display: block;
          margin-bottom: 10px;
          color: #666;
        }

        .continue-btn {
          margin-top: 15px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
        }

        .close-btn {
          margin-top: 20px;
          padding: 10px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
        }

        .badge-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .badge-tips h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .tip-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Badges;
