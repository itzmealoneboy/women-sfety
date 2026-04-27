import React, { useState, useEffect, useRef } from 'react';

const MessageSystem = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ id: 1, name: 'Current User', role: 'citizen' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // Simulate API call
      const mockConversations = [
        {
          id: 1,
          participant: { id: 2, name: 'Officer Smith', role: 'police', avatar: '👮' },
          lastMessage: 'Your report has been received',
          timestamp: new Date(2024, 0, 15, 14, 30),
          unread: 1
        },
        {
          id: 2,
          participant: { id: 3, name: 'Support Team', role: 'support', avatar: '🆘' },
          lastMessage: 'How can we help you today?',
          timestamp: new Date(2024, 0, 14, 9, 15),
          unread: 0
        },
        {
          id: 3,
          participant: { id: 4, name: 'Admin', role: 'admin', avatar: '👨‍💼' },
          lastMessage: 'Your account has been verified',
          timestamp: new Date(2024, 0, 13, 16, 45),
          unread: 0
        }
      ];

      const mockMessages = {
        1: [
          {
            id: 1,
            senderId: 2,
            text: 'Hello, I received your report about the incident.',
            timestamp: new Date(2024, 0, 15, 10, 0),
            read: true
          },
          {
            id: 2,
            senderId: 1,
            text: 'Thank you for the update. When can I expect more information?',
            timestamp: new Date(2024, 0, 15, 11, 30),
            read: true
          },
          {
            id: 3,
            senderId: 2,
            text: 'Your report has been received and is being reviewed. I will update you within 48 hours.',
            timestamp: new Date(2024, 0, 15, 14, 30),
            read: false
          }
        ],
        2: [
          {
            id: 1,
            senderId: 3,
            text: 'Welcome to the support chat! How can we help you today?',
            timestamp: new Date(2024, 0, 14, 9, 15),
            read: true
          }
        ],
        3: [
          {
            id: 1,
            senderId: 4,
            text: 'Your account has been verified successfully.',
            timestamp: new Date(2024, 0, 13, 16, 45),
            read: true
          }
        ]
      };

      setConversations(mockConversations);
      setMessages(mockMessages[1] || []);
      setSelectedConversation(mockConversations[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: user.id,
      text: newMessage,
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate sending to API
    try {
      // await fetch('/api/messages', { method: 'POST', body: JSON.stringify(message) });
      
      // Simulate auto-reply for demo
      if (selectedConversation.id === 1 && message.text.includes('update')) {
        setTimeout(() => {
          const reply = {
            id: Date.now() + 1,
            senderId: 2,
            text: 'I will check on this for you and get back to you shortly.',
            timestamp: new Date(),
            read: false
          };
          setMessages(prev => [...prev, reply]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="message-system">
      <div className="message-container">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h3>Messages</h3>
            <button className="new-message-btn">+ New</button>
          </div>
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedConversation(conv);
                  setMessages([]);
                  // In real app, fetch messages for this conversation
                }}
              >
                <div className="conversation-avatar">
                  {conv.participant.avatar}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">
                    {conv.participant.name}
                    <span className="conversation-role">{conv.participant.role}</span>
                  </div>
                  <div className="conversation-last-message">
                    {conv.lastMessage}
                  </div>
                </div>
                <div className="conversation-meta">
                  <div className="conversation-time">
                    {formatTime(conv.timestamp)}
                  </div>
                  {conv.unread > 0 && (
                    <div className="unread-badge">{conv.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-participant">
                  <span className="participant-avatar">
                    {selectedConversation.participant.avatar}
                  </span>
                  <div>
                    <div className="participant-name">
                      {selectedConversation.participant.name}
                    </div>
                    <div className="participant-status">Online</div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn">📞</button>
                  <button className="action-btn">📹</button>
                  <button className="action-btn">📁</button>
                </div>
              </div>

              <div className="messages-area">
                {loading ? (
                  <div className="loading-messages">Loading messages...</div>
                ) : (
                  <>
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          {message.text}
                        </div>
                        <div className="message-time">
                          {formatTime(message.timestamp)}
                          {message.senderId === user.id && (
                            <span className="message-status">
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="message-input-area">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={3}
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
        .message-system {
          height: 100vh;
          background: #f8f9fa;
        }

        .message-container {
          display: flex;
          height: 100%;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .conversations-sidebar {
          width: 320px;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h3 {
          margin: 0;
          color: #333;
        }

        .new-message-btn {
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          padding: 15px 20px;
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

        .conversation-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 12px;
        }

        .conversation-info {
          flex: 1;
        }

        .conversation-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .conversation-role {
          font-size: 11px;
          color: #666;
          margin-left: 8px;
          text-transform: capitalize;
        }

        .conversation-last-message {
          font-size: 13px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-meta {
          text-align: right;
        }

        .conversation-time {
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

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-participant {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .participant-avatar {
          font-size: 40px;
        }

        .participant-name {
          font-weight: 500;
          color: #333;
        }

        .participant-status {
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
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .message.sent {
          align-items: flex-end;
        }

        .message.received {
          align-items: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 12px;
          word-wrap: break-word;
        }

        .message.sent .message-content {
          background: #007bff;
          color: white;
        }

        .message.received .message-content {
          background: white;
          color: #333;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .message-time {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
        }

        .message-status {
          margin-left: 4px;
        }

        .message-input-area {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 10px;
        }

        .message-input-area textarea {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: none;
          font-family: inherit;
        }

        .send-btn {
          padding: 0 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .send-btn:hover {
          background: #0056b3;
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

        .loading-messages {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MessageSystem;
