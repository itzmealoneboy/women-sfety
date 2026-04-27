import React, { useState } from 'react';

const SafetyDiscussions = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'Best practices for social media privacy',
      content: 'What are your top tips for maintaining privacy on social media platforms?',
      author: 'PrivacyExpert',
      category: 'privacy',
      replies: 24,
      views: 342,
      likes: 56,
      timestamp: new Date(2024, 0, 15),
      pinned: true,
      tags: ['socialmedia', 'privacy', 'tips']
    },
    {
      id: 2,
      title: 'How to identify phishing emails',
      content: 'Share your experiences and tips for spotting phishing attempts in emails.',
      author: 'CyberSafe',
      category: 'cybersecurity',
      replies: 18,
      views: 267,
      likes: 42,
      timestamp: new Date(2024, 0, 14),
      pinned: false,
      tags: ['phishing', 'email', 'security']
    },
    {
      id: 3,
      title: 'Emergency preparedness tips',
      content: 'What should every household have in their emergency kit?',
      author: 'SafetyFirst',
      category: 'emergency',
      replies: 31,
      views: 489,
      likes: 78,
      timestamp: new Date(2024, 0, 13),
      pinned: false,
      tags: ['emergency', 'preparedness', 'safety']
    }
  ]);

  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'privacy', name: 'Privacy' },
    { id: 'cybersecurity', name: 'Cyber Security' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'general', name: 'General Safety' }
  ];

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    const discussion = {
      ...newDiscussion,
      id: Date.now(),
      author: 'CurrentUser',
      replies: 0,
      views: 0,
      likes: 0,
      timestamp: new Date(),
      pinned: false,
      tags: []
    };
    setDiscussions([discussion, ...discussions]);
    setShowNewDiscussion(false);
    setNewDiscussion({ title: '', content: '', category: 'general' });
  };

  const filteredDiscussions = selectedCategory === 'all' 
    ? discussions 
    : discussions.filter(d => d.category === selectedCategory);

  return (
    <div className="safety-discussions">
      <div className="discussions-header">
        <h2>Safety Discussions</h2>
        <p>Join conversations about safety, security, and community protection</p>
      </div>

      <div className="discussions-actions">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNewDiscussion(true)} className="new-discussion-btn">
          + Start New Discussion
        </button>
      </div>

      <div className="discussions-list">
        {filteredDiscussions.map(discussion => (
          <div key={discussion.id} className={`discussion-card ${discussion.pinned ? 'pinned' : ''}`}>
            {discussion.pinned && <div className="pinned-badge">📌 Pinned</div>}
            <div className="discussion-content">
              <h3>{discussion.title}</h3>
              <p className="discussion-excerpt">{discussion.content.substring(0, 150)}...</p>
              <div className="discussion-meta">
                <span className="meta-author">👤 {discussion.author}</span>
                <span className="meta-date">📅 {discussion.timestamp.toLocaleDateString()}</span>
                <span className="meta-category">{discussion.category}</span>
              </div>
              <div className="discussion-tags">
                {discussion.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="discussion-stats">
                <span className="stat">💬 {discussion.replies} replies</span>
                <span className="stat">👁️ {discussion.views} views</span>
                <span className="stat">❤️ {discussion.likes} likes</span>
              </div>
            </div>
            <div className="discussion-actions">
              <button className="read-more-btn">Read Discussion →</button>
            </div>
          </div>
        ))}
      </div>

      {showNewDiscussion && (
        <div className="modal-overlay" onClick={() => setShowNewDiscussion(false)}>
          <div className="discussion-form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Start New Discussion</h3>
            <form onSubmit={handleCreateDiscussion}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={newDiscussion.category} onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}>
                  <option value="general">General Safety</option>
                  <option value="privacy">Privacy</option>
                  <option value="cybersecurity">Cyber Security</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  rows={6}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Post Discussion</button>
                <button type="button" onClick={() => setShowNewDiscussion(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="guidelines-section">
        <h3>Community Guidelines</h3>
        <div className="guidelines-list">
          <div className="guideline-item">✓ Be respectful and supportive</div>
          <div className="guideline-item">✓ No sharing of personal information</div>
          <div className="guideline-item">✓ Report inappropriate content</div>
          <div className="guideline-item">✓ Help others stay safe</div>
        </div>
      </div>

      <style jsx>{`
        .safety-discussions {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .discussions-header {
          margin-bottom: 30px;
        }

        .discussions-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .discussions-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .discussions-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .category-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f0f0f0;
        }

        .filter-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .new-discussion-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .discussions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .discussion-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
          position: relative;
        }

        .discussion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .discussion-card.pinned {
          border-left: 4px solid #ffc107;
        }

        .pinned-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 12px;
          color: #ffc107;
        }

        .discussion-content h3 {
          margin: 0 0 10px 0;
          color: #007bff;
        }

        .discussion-excerpt {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .discussion-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 13px;
          color: #999;
        }

        .discussion-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 2px 8px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 11px;
          color: #666;
        }

        .discussion-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #999;
          margin-bottom: 15px;
        }

        .read-more-btn {
          padding: 8px 16px;
          background: none;
          border: 1px solid #007bff;
          color: #007bff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .read-more-btn:hover {
          background: #007bff;
          color: white;
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

        .discussion-form-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
        }

        .discussion-form-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .submit-btn, .cancel-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .submit-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .guidelines-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .guidelines-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .guidelines-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .guideline-item {
          padding: 8px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default SafetyDiscussions;
