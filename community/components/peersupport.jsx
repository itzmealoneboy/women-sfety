import React, { useState } from 'react';

const PeerSupport = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Mental Health Support Circle',
      members: 234,
      description: 'A safe space to discuss mental health challenges and share coping strategies',
      category: 'mental-health',
      active: true
    },
    {
      id: 2,
      name: 'Cyber Safety Warriors',
      members: 156,
      description: 'Learn and share tips about staying safe online',
      category: 'safety',
      active: true
    },
    {
      id: 3,
      name: 'Survivors Network',
      members: 89,
      description: 'Support group for survivors of abuse and trauma',
      category: 'support',
      active: true
    }
  ]);

  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      expertise: 'Mental Health Counselor',
      experience: '10+ years',
      rating: 4.8,
      available: true,
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      expertise: 'Cyber Security Expert',
      experience: '8 years',
      rating: 4.9,
      available: true,
      avatar: '👨‍💻'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      expertise: 'Legal Advisor',
      experience: '12 years',
      rating: 4.7,
      available: false,
      avatar: '👩‍⚖️'
    }
  ]);

  const [selectedMentor, setSelectedMentor] = useState(null);

  const handleJoinGroup = (groupId) => {
    alert('Request sent to join group. You will be notified once approved.');
  };

  const handleRequestMentor = (mentor) => {
    setSelectedMentor(mentor);
    setTimeout(() => {
      alert(`Request sent to ${mentor.name}. They will contact you within 24 hours.`);
      setSelectedMentor(null);
    }, 1000);
  };

  return (
    <div className="peer-support">
      <div className="support-header">
        <h2>Peer Support Network</h2>
        <p>Connect with others who understand your journey</p>
      </div>

      <div className="support-tabs">
        <button className={`tab ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>
          Support Groups
        </button>
        <button className={`tab ${activeTab === 'mentors' ? 'active' : ''}`} onClick={() => setActiveTab('mentors')}>
          Find a Mentor
        </button>
        <button className={`tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
          Success Stories
        </button>
      </div>

      {activeTab === 'groups' && (
        <div className="groups-section">
          <div className="groups-grid">
            {groups.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-icon">👥</div>
                <div className="group-info">
                  <h3>{group.name}</h3>
                  <p className="group-description">{group.description}</p>
                  <div className="group-meta">
                    <span className="member-count">👤 {group.members} members</span>
                    <span className="group-category">{group.category}</span>
                  </div>
                  <button onClick={() => handleJoinGroup(group.id)} className="join-btn">
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="create-group-section">
            <h3>Start Your Own Support Group</h3>
            <p>Can't find what you're looking for? Create a new support group</p>
            <button className="create-group-btn">+ Create New Group</button>
          </div>
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="mentors-section">
          <div className="mentors-grid">
            {mentors.map(mentor => (
              <div key={mentor.id} className="mentor-card">
                <div className="mentor-avatar">{mentor.avatar}</div>
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <p className="mentor-expertise">{mentor.expertise}</p>
                  <p className="mentor-experience">📅 {mentor.experience}</p>
                  <div className="mentor-rating">⭐ {mentor.rating} / 5</div>
                  <div className={`mentor-status ${mentor.available ? 'available' : 'busy'}`}>
                    {mentor.available ? 'Available Now' : 'Currently Busy'}
                  </div>
                  <button 
                    onClick={() => handleRequestMentor(mentor)} 
                    disabled={!mentor.available || selectedMentor === mentor}
                    className="request-btn"
                  >
                    {selectedMentor === mentor ? 'Requesting...' : 'Request Session'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="become-mentor">
            <h3>Become a Mentor</h3>
            <p>Share your expertise and help others in their journey</p>
            <button className="apply-btn">Apply to Become a Mentor</button>
          </div>
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="stories-section">
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-author">🌟 Sarah M.</div>
              <h4>Finding Strength in Community</h4>
              <p>After struggling with anxiety for years, joining the support group helped me realize I'm not alone. The peer support I received was life-changing.</p>
              <div className="story-date">Shared 2 days ago</div>
            </div>
            <div className="story-card">
              <div className="story-author">💪 Rahul K.</div>
              <h4>Overcoming Cyber Bullying</h4>
              <p>Through the mentorship program, I learned strategies to protect myself online and regain my confidence. Now I help others do the same.</p>
              <div className="story-date">Shared 1 week ago</div>
            </div>
            <div className="story-card">
              <div className="story-author">🌸 Priya S.</div>
              <h4>My Journey to Healing</h4>
              <p>With the support of my peer mentor, I was able to navigate through difficult times and find my path to recovery. Forever grateful.</p>
              <div className="story-date">Shared 2 weeks ago</div>
            </div>
          </div>

          <div className="share-story">
            <h3>Share Your Story</h3>
            <p>Your experience can inspire and help others</p>
            <button className="share-btn">Share Your Journey</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .peer-support {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .support-header {
          margin-bottom: 30px;
        }

        .support-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .support-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .support-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
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

        .groups-grid, .mentors-grid, .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .group-card, .mentor-card, .story-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .group-card:hover, .mentor-card:hover, .story-card:hover {
          transform: translateY(-2px);
        }

        .group-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .group-info h3, .mentor-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .group-description, .mentor-expertise {
          color: #666;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .group-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          font-size: 12px;
        }

        .member-count, .group-category {
          padding: 2px 8px;
          background: #f0f0f0;
          border-radius: 4px;
        }

        .join-btn, .request-btn, .share-btn, .create-group-btn, .apply-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .join-btn:hover, .request-btn:hover {
          background: #0056b3;
        }

        .request-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .mentor-avatar {
          font-size: 60px;
          text-align: center;
          margin-bottom: 15px;
        }

        .mentor-experience, .mentor-rating {
          font-size: 13px;
          color: #666;
          margin-bottom: 5px;
        }

        .mentor-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin: 10px 0;
        }

        .mentor-status.available {
          background: #d4edda;
          color: #155724;
        }

        .mentor-status.busy {
          background: #f8d7da;
          color: #721c24;
        }

        .create-group-section, .become-mentor, .share-story {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
        }

        .create-group-section h3, .become-mentor h3, .share-story h3 {
          margin: 0 0 10px 0;
        }

        .create-group-btn, .apply-btn, .share-btn {
          margin-top: 15px;
          background: white;
          color: #667eea;
        }

        .story-author {
          font-weight: bold;
          color: #007bff;
          margin-bottom: 10px;
        }

        .story-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .story-card p {
          color: #666;
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .story-date {
          font-size: 12px;
          color: #999;
        }

        @media (max-width: 768px) {
          .groups-grid, .mentors-grid, .stories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PeerSupport;
