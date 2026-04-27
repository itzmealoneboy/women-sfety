import React, { useState } from 'react';

const CrisisSupport = () => {
  const [activeTab, setActiveTab] = useState('hotlines');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const hotlines = [
    { name: 'National Helpline', number: '1800-123-4567', timing: '24/7', type: 'General Support' },
    { name: 'Mental Health Support', number: '1800-987-6543', timing: '24/7', type: 'Mental Health' },
    { name: 'Women Helpline', number: '1091', timing: '24/7', type: 'Women Safety' },
    { name: 'Child Helpline', number: '1098', timing: '24/7', type: 'Child Protection' }
  ];

  const resources = [
    { title: 'Emergency Contact Guide', description: 'List of all emergency numbers', link: '#' },
    { title: 'Self-Care Techniques', description: 'Managing stress and anxiety', link: '#' },
    { title: 'Safety Planning', description: 'Create a personal safety plan', link: '#' },
    { title: 'Legal Rights', description: 'Know your rights and protections', link: '#' }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setMessages([...messages, { text: currentMessage, sender: 'user', timestamp: new Date() }]);
    setCurrentMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I hear you. Can you tell me more about what's going on? Remember, you're not alone. We're here to help.", 
        sender: 'support', 
        timestamp: new Date() 
      }]);
    }, 1000);
  };

  return (
    <div className="crisis-support">
      <div className="support-header">
        <h2>Crisis Support Center</h2>
        <p>Immediate help and resources for those in crisis</p>
      </div>

      <div className="emergency-banner">
        <div className="emergency-icon">⚠️</div>
        <div className="emergency-content">
          <h3>If this is an emergency, please call 112 immediately</h3>
          <p>Emergency services are available 24/7</p>
        </div>
      </div>

      <div className="support-tabs">
        <button className={`tab ${activeTab === 'hotlines' ? 'active' : ''}`} onClick={() => setActiveTab('hotlines')}>
          Crisis Helplines
        </button>
        <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          Live Chat Support
        </button>
        <button className={`tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
          Self-Help Resources
        </button>
      </div>

      {activeTab === 'hotlines' && (
        <div className="hotlines-section">
          <div className="hotlines-grid">
            {hotlines.map((hotline, i) => (
              <div key={i} className="hotline-card">
                <div className="hotline-icon">📞</div>
                <div className="hotline-info">
                  <h4>{hotline.name}</h4>
                  <p className="hotline-number">{hotline.number}</p>
                  <p className="hotline-timing">{hotline.timing} • {hotline.type}</p>
                </div>
                <button className="call-btn" onClick={() => window.location.href = `tel:${hotline.number}`}>
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="chat-section">
          {!chatActive ? (
            <div className="chat-start">
              <div className="chat-icon">💬</div>
              <h3>Need to talk to someone?</h3>
              <p>Our trained crisis counselors are here to listen and support you.</p>
              <button onClick={() => setChatActive(true)} className="start-chat-btn">
                Start Anonymous Chat
              </button>
              <div className="chat-note">
                <small>Your chat is completely confidential and anonymous</small>
              </div>
            </div>
          ) : (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-status">
                  <span className="status-dot"></span>
                  Connected to Crisis Counselor
                </div>
                <button onClick={() => setChatActive(false)} className="close-chat">×</button>
              </div>
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.sender}`}>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="resources-section">
          <div className="resources-grid">
            {resources.map((resource, i) => (
              <div key={i} className="resource-card">
                <div className="resource-icon">📚</div>
                <h4>{resource.title}</h4>
                <p>{resource.description}</p>
                <a href={resource.link} className="resource-link">View Resource →</a>
              </div>
            ))}
          </div>

          <div className="self-care-tips">
            <h3>Self-Care Tips</h3>
            <div className="tips-list">
              <div className="tip-item">🧘 Take deep breaths - inhale for 4 seconds, exhale for 6</div>
              <div className="tip-item">🚶 Take a short walk to clear your mind</div>
              <div className="tip-item">📝 Write down your thoughts and feelings</div>
              <div className="tip-item">💧 Stay hydrated and eat if you can</div>
              <div className="tip-item">🤝 Reach out to someone you trust</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .crisis-support {
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

        .emergency-banner {
          background: #dc3545;
          color: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .emergency-icon {
          font-size: 40px;
        }

        .emergency-content h3 {
          margin: 0 0 5px 0;
        }

        .emergency-content p {
          margin: 0;
          opacity: 0.9;
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

        .hotlines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .hotline-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hotline-icon {
          font-size: 40px;
        }

        .hotline-info {
          flex: 1;
        }

        .hotline-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .hotline-number {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
          margin: 0 0 5px 0;
        }

        .hotline-timing {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        .call-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .chat-section {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chat-start {
          text-align: center;
          padding: 60px;
        }

        .chat-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .start-chat-btn {
          margin-top: 20px;
          padding: 12px 30px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .chat-note {
          margin-top: 20px;
          color: #999;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          height: 500px;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .close-chat {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 12px;
        }

        .message.user {
          align-self: flex-end;
          background: #007bff;
          color: white;
        }

        .message.support {
          align-self: flex-start;
          background: #f0f0f0;
          color: #333;
        }

        .message-time {
          font-size: 10px;
          margin-top: 5px;
          opacity: 0.7;
        }

        .chat-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #e0e0e0;
        }

        .chat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-right: 10px;
        }

        .chat-input button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .resource-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .resource-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .resource-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .resource-card p {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .resource-link {
          color: #007bff;
          text-decoration: none;
        }

        .self-care-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .self-care-tips h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .tip-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CrisisSupport;
