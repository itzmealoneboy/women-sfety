import React, { useState, useRef, useEffect } from 'react';

const PrivateMessaging = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩',
      lastMessage: 'Thank you for your support!',
      timestamp: new Date(2024, 0, 15, 14, 30),
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      avatar: '👨',
      lastMessage: 'Can we discuss the safety workshop?',
      timestamp: new Date(2024, 0, 14, 10, 15),
      unread: 0,
      online: false
    }
  ]);

  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (convId) => {
    const mockMessages = {
      1: [
        { id: 1, sender: 'other', text: 'Hi there! I saw your post about cyber safety.', timestamp: new Date(2024, 0, 15, 14, 0), read: true },
        { id: 2, sender: 'me', text: 'Yes, I'm looking for tips to stay safe online.', timestamp: new Date(2024, 0, 15, 14, 15), read: true },
        { id: 3, sender: 'other', text: 'Thank you for your support!', timestamp: new Date(2024, 0, 15, 14, 30), read: false }
      ],
      2: [
        { id: 1, sender: 'other', text: 'Hi, are you attending the workshop tomorrow?', timestamp: new Date(2024, 0, 14, 10, 0), read: true },
        { id: 2, sender: 'me', text: 'Yes, I'll be there!', timestamp: new Date(2024, 0, 14, 10, 5), read: true },
        { id: 3, sender: 'other', text: 'Can we discuss the safety workshop?', timestamp: new Date(2024, 0, 14, 10, 15), read: true }
      ]
    };
    setMessages(mockMessages[convId] || []);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const message = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'other',
        text: "Thanks for reaching out! I'll get back to you shortly.",
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="private-messaging">
      <div className="messaging-header">
        <h2>Private Messages</h2>
        <p>Connect privately with community members</p>
      </div>

      <div className="messaging-container">
        <div className="conversations-sidebar">
          <div className="search-conversations">
            <input type="text" placeholder="Search conversations..." />
          </div>
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setActiveConversation(conv)}
              >
                <div className="conv-avatar">
                  {conv.avatar}
                  {conv.online && <span className="online-dot"></span>}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{conv.name}</div>
                  <div className="conv-last-message">{conv.lastMessage}</div>
                </div>
                <div className="conv-meta">
                  <div className="conv-time">{formatTime(conv.timestamp)}</div>
                  {conv.unread > 0 && <div className="unread-badge">{conv.unread}</div>}
                </div>
              </div>
            ))}
          </div>
          <button className="new-conversation-btn">+ New Message</button>
        </div>

        <div className="chat-area">
          {activeConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <div className="user-avatar">{activeConversation.avatar}</div>
                  <div>
                    <div className="user-name">{activeConversation.name}</div>
                    <div className="user-status">{activeConversation.online ? 'Online' : 'Offline'}</div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn">📞</button>
                  <button className="action-btn">📹</button>
                  <button className="action-btn">🔍</button>
                </div>
              </div>

              <div className="messages-area">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-bubble">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-area">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button onClick={handleSendMessage} className="send-btn">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .private-messaging {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .messaging-header {
          margin-bottom: 30px;
        }

        .messaging-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .messaging-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .messaging-container {
          display: flex;
          height: 600px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .conversations-sidebar {
          width: 320px;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
        }

        .search-conversations {
          padding: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .search-conversations input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          padding: 15px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f0f0f0;
        }

        .conversation-item:hover {
          background: #f8f9fa;
        }

        .conversation-item.active {
          background: #e7f3ff;
        }

        .conv-avatar {
          position: relative;
          font-size: 40px;
          margin-right: 12px;
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #28a745;
          border-radius: 50%;
          border: 2px solid white;
        }

        .conv-info {
          flex: 1;
        }

        .conv-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .conv-last-message {
          font-size: 13px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-meta {
          text-align: right;
        }

        .conv-time {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .unread-badge {
          background: #007bff;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          display: inline-block;
        }

        .new-conversation-btn {
          margin: 15px;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .chat-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          font-size: 40px;
        }

        .user-name {
          font-weight: 500;
          color: #333;
        }

        .user-status {
          font-size: 12px;
          color: #28a745;
        }

        .chat-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }

        .message {
          margin-bottom: 15px;
          display: flex;
        }

        .message.me {
          justify-content: flex-end;
        }

        .message.other {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 12px;
        }

        .message.me .message-bubble {
          background: #007bff;
          color: white;
        }

        .message.other .message-bubble {
          background: white;
          color: #333;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .message-text {
          margin-bottom: 5px;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.7;
        }

        .message-input-area {
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 10px;
        }

        .message-input-area textarea {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: none;
        }

        .send-btn {
          padding: 0 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .empty-state p {
          margin: 0;
          color: #666;
        }

        @media (max-width: 768px) {
          .messaging-container {
            flex-direction: column;
            height: auto;
          }
          
          .conversations-sidebar {
            width: 100%;
            max-height: 300px;
          }
          
          .chat-area {
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivateMessaging;
