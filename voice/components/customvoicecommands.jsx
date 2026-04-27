import React, { useState, useEffect, useRef } from 'react';

const CustomVoiceCommands = () => {
  const [commands, setCommands] = useState([
    { id: 1, phrase: "open dashboard", action: "Navigate to dashboard", enabled: true, response: "Opening dashboard" },
    { id: 2, phrase: "show reports", action: "Display reports", enabled: true, response: "Showing reports" },
    { id: 3, phrase: "emergency help", action: "Call emergency", enabled: true, response: "Calling emergency services" },
    { id: 4, phrase: "find parking", action: "Search parking", enabled: true, response: "Searching for nearby parking" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [newCommand, setNewCommand] = useState({ phrase: '', action: '', response: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        processCommand(transcriptText.toLowerCase());
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }
  }, [isListening]);

  const processCommand = (text) => {
    const matchedCommand = commands.find(cmd => 
      cmd.enabled && text.includes(cmd.phrase.toLowerCase())
    );
    
    if (matchedCommand) {
      const historyEntry = {
        id: Date.now(),
        command: matchedCommand.phrase,
        action: matchedCommand.action,
        timestamp: new Date(),
        response: matchedCommand.response
      };
      setCommandHistory([historyEntry, ...commandHistory.slice(0, 19)]);
      
      // Simulate command execution
      alert(`Command recognized: ${matchedCommand.phrase}\nAction: ${matchedCommand.action}\nResponse: ${matchedCommand.response}`);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    }
  };

  const addCommand = () => {
    if (newCommand.phrase && newCommand.action) {
      const newCmd = {
        id: Date.now(),
        phrase: newCommand.phrase.toLowerCase(),
        action: newCommand.action,
        enabled: true,
        response: newCommand.response || `Executing ${newCommand.action}`
      };
      setCommands([...commands, newCmd]);
      setNewCommand({ phrase: '', action: '', response: '' });
      setShowAddModal(false);
    }
  };

  const toggleCommand = (id) => {
    setCommands(commands.map(cmd => 
      cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd
    ));
  };

  const deleteCommand = (id) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };

  const editCommand = (command) => {
    setSelectedCommand(command);
    setNewCommand({
      phrase: command.phrase,
      action: command.action,
      response: command.response
    });
    setShowAddModal(true);
  };

  const updateCommand = () => {
    if (selectedCommand && newCommand.phrase && newCommand.action) {
      setCommands(commands.map(cmd => 
        cmd.id === selectedCommand.id 
          ? { ...cmd, phrase: newCommand.phrase.toLowerCase(), action: newCommand.action, response: newCommand.response }
          : cmd
      ));
      setSelectedCommand(null);
      setNewCommand({ phrase: '', action: '', response: '' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="voice-commands">
      <div className="commands-header">
        <h2>Custom Voice Commands</h2>
        <p>Create and manage your personalized voice commands</p>
        <button onClick={() => setShowAddModal(true)} className="add-command-btn">
          + Add New Command
        </button>
      </div>

      <div className="voice-controls">
        <div className="mic-status">
          <div className={`mic-icon ${isListening ? 'listening' : ''}`}>
            {isListening ? '🎤' : '🎙️'}
          </div>
          <div className="mic-text">
            {isListening ? 'Listening for commands...' : 'Click to start listening'}
          </div>
        </div>
        <div className="control-buttons">
          {!isListening ? (
            <button onClick={startListening} className="start-btn">
              Start Listening
            </button>
          ) : (
            <button onClick={stopListening} className="stop-btn">
              Stop Listening
            </button>
          )}
        </div>
        {transcript && (
          <div className="transcript">
            <strong>Heard:</strong> "{transcript}"
          </div>
        )}
      </div>

      <div className="commands-list">
        <h3>Your Voice Commands</h3>
        <div className="commands-grid">
          {commands.map(cmd => (
            <div key={cmd.id} className={`command-card ${!cmd.enabled ? 'disabled' : ''}`}>
              <div className="command-phrase">"{cmd.phrase}"</div>
              <div className="command-action">→ {cmd.action}</div>
              <div className="command-response">📢 {cmd.response}</div>
              <div className="command-controls">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={cmd.enabled}
                    onChange={() => toggleCommand(cmd.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button onClick={() => editCommand(cmd)} className="edit-btn">Edit</button>
                <button onClick={() => deleteCommand(cmd.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="command-history">
        <h3>Command History</h3>
        <div className="history-list">
          {commandHistory.map(entry => (
            <div key={entry.id} className="history-item">
              <div className="history-command">"{entry.command}"</div>
              <div className="history-action">{entry.action}</div>
              <div className="history-time">{entry.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddModal(false);
          setSelectedCommand(null);
          setNewCommand({ phrase: '', action: '', response: '' });
        }}>
          <div className="command-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedCommand ? 'Edit Command' : 'Add New Command'}</h3>
            <div className="form-group">
              <label>Voice Phrase</label>
              <input
                type="text"
                value={newCommand.phrase}
                onChange={(e) => setNewCommand({...newCommand, phrase: e.target.value})}
                placeholder="e.g., open dashboard"
              />
              <small>Say this phrase to trigger the command</small>
            </div>
            <div className="form-group">
              <label>Action Description</label>
              <input
                type="text"
                value={newCommand.action}
                onChange={(e) => setNewCommand({...newCommand, action: e.target.value})}
                placeholder="e.g., Navigate to dashboard"
              />
            </div>
            <div className="form-group">
              <label>Voice Response</label>
              <input
                type="text"
                value={newCommand.response}
                onChange={(e) => setNewCommand({...newCommand, response: e.target.value})}
                placeholder="e.g., Opening dashboard"
              />
              <small>What the voice assistant should say</small>
            </div>
            <div className="modal-actions">
              <button onClick={selectedCommand ? updateCommand : addCommand} className="save-btn">
                {selectedCommand ? 'Update' : 'Save'}
              </button>
              <button onClick={() => {
                setShowAddModal(false);
                setSelectedCommand(null);
                setNewCommand({ phrase: '', action: '', response: '' });
              }} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .voice-commands {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .commands-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .commands-header h2 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 28px;
        }

        .commands-header p {
          margin: 0;
          color: #666;
        }

        .add-command-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .voice-controls {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .mic-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .mic-icon {
          font-size: 60px;
          margin-bottom: 10px;
          transition: all 0.3s;
        }

        .mic-icon.listening {
          animation: pulse 1.5s infinite;
          color: #dc3545;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        .start-btn, .stop-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-size: 16px;
        }

        .start-btn {
          background: #28a745;
          color: white;
        }

        .stop-btn {
          background: #dc3545;
          color: white;
        }

        .transcript {
          margin-top: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }

        .commands-list {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .commands-list h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .commands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .command-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .command-card.disabled {
          opacity: 0.5;
        }

        .command-phrase {
          font-size: 16px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 8px;
        }

        .command-action {
          color: #666;
          margin-bottom: 8px;
        }

        .command-response {
          color: #28a745;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .command-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #28a745;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .edit-btn, .delete-btn {
          padding: 4px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .edit-btn {
          background: #007bff;
          color: white;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .command-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .command-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .history-command {
          font-weight: bold;
          color: #007bff;
        }

        .history-action {
          color: #666;
        }

        .history-time {
          font-size: 11px;
          color: #999;
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

        .command-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
        }

        .command-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #999;
          font-size: 11px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .save-btn, .cancel-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CustomVoiceCommands;