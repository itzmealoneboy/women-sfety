import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for WebSocket connections
 * @param {string} url - WebSocket server URL
 * @param {Object} options - Configuration options
 * @returns {Object} WebSocket state and methods
 */
const useWebSocket = (url, options = {}) => {
  const {
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    heartbeatMessage = 'ping',
    protocols = []
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageStats, setMessageStats] = useState({
    sent: 0,
    received: 0,
    errors: 0
  });

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatTimeoutRef = useRef(null);
  const isUnmountingRef = useRef(false);
  const messageQueueRef = useRef([]);

  // Send heartbeat to keep connection alive
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const heartbeatMsg = typeof heartbeatMessage === 'function' 
        ? heartbeatMessage() 
        : heartbeatMessage;
      
      if (heartbeatMsg) {
        sendMessage(heartbeatMsg);
      }
    }
    
    // Schedule next heartbeat
    heartbeatTimeoutRef.current = setTimeout(sendHeartbeat, heartbeatInterval);
  }, [heartbeatInterval, heartbeatMessage]);

  // Clear heartbeats
  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = typeof data === 'object' ? JSON.stringify(data) : data;
      wsRef.current.send(message);
      
      setMessageStats(prev => ({
        ...prev,
        sent: prev.sent + 1
      }));
      
      return true;
    } else {
      // Queue message for when connection is established
      if (options.queueMessages) {
        messageQueueRef.current.push(data);
      }
      return false;
    }
  }, [options.queueMessages]);

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (!url) {
      console.error('WebSocket URL is required');
      return;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    setIsConnecting(true);
    setLastError(null);
    
    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;
      
      ws.onopen = (event) => {
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
        
        // Send queued messages
        if (options.queueMessages && messageQueueRef.current.length > 0) {
          messageQueueRef.current.forEach(msg => sendMessage(msg));
          messageQueueRef.current = [];
        }
        
        // Start heartbeat
        if (heartbeatInterval > 0) {
          sendHeartbeat();
        }
        
        if (onOpen) onOpen(event);
      };
      
      ws.onmessage = (event) => {
        let data = event.data;
        
        // Try to parse JSON
        try {
          data = JSON.parse(event.data);
        } catch (e) {
          // Keep as string if not JSON
        }
        
        setLastMessage(data);
        setMessages(prev => [...prev, { data, timestamp: Date.now() }].slice(-100)); // Keep last 100 messages
        setMessageStats(prev => ({
          ...prev,
          received: prev.received + 1
        }));
        
        if (onMessage) onMessage(data, event);
      };
      
      ws.onerror = (event) => {
        const error = new Error('WebSocket error');
        setLastError(error);
        setMessageStats(prev => ({
          ...prev,
          errors: prev.errors + 1
        }));
        
        if (onError) onError(error, event);
      };
      
      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        clearHeartbeat();
        
        // Attempt reconnection
        if (reconnect && !isUnmountingRef.current && reconnectAttempts < maxReconnectAttempts) {
          const delay = reconnectInterval * Math.pow(1.5, reconnectAttempts); // Exponential backoff
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
        
        if (onClose) onClose(event);
      };
      
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setLastError(error);
      setIsConnecting(false);
      if (onError) onError(error);
    }
  }, [url, protocols, reconnect, reconnectInterval, maxReconnectAttempts, 
      reconnectAttempts, onOpen, onMessage, onClose, onError, heartbeatInterval, 
      sendHeartbeat, clearHeartbeat, options.queueMessages, sendMessage]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    isUnmountingRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    clearHeartbeat();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  }, [clearHeartbeat]);

  // Subscribe to specific message types (if using JSON messages)
  const subscribe = useCallback((messageType, handler) => {
    const messageHandler = (data) => {
      if (data && data.type === messageType) {
        handler(data.payload || data);
      }
    };
    
    // Store handler for later cleanup
    if (!wsRef.current.handlers) {
      wsRef.current.handlers = new Map();
    }
    
    wsRef.current.handlers.set(messageType, messageHandler);
    
    // Override onMessage to handle subscriptions
    const originalOnMessage = wsRef.current.onmessage;
    wsRef.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        data = event.data;
      }
      
      // Call specific handlers
      if (data && data.type && wsRef.current.handlers.has(data.type)) {
        wsRef.current.handlers.get(data.type)(data);
      }
      
      // Call original handler
      if (originalOnMessage) originalOnMessage(event);
    };
    
    return () => {
      wsRef.current.handlers.delete(messageType);
    };
  }, []);

  // Send typed message (JSON with type field)
  const sendTypedMessage = useCallback((type, payload) => {
    return sendMessage({ type, payload, timestamp: Date.now() });
  }, [sendMessage]);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    if (!wsRef.current) return 'disconnected';
    
    switch (wsRef.current.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }, []);

  // Clear message history
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Reset message stats
  const resetStats = useCallback(() => {
    setMessageStats({
      sent: 0,
      received: 0,
      errors: 0
    });
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect]);

  return {
    // State
    isConnected,
    isConnecting,
    lastMessage,
    lastError,
    reconnectAttempts,
    messages,
    messageStats,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    sendTypedMessage,
    subscribe,
    getConnectionStatus,
    clearMessages,
    resetStats,
    
    // Raw WebSocket instance (use with caution)
    ws: wsRef.current
  };
};

// Hook for managing multiple WebSocket connections
export const useWebSocketManager = () => {
  const [connections, setConnections] = useState(new Map());

  const createConnection = useCallback((id, url, options = {}) => {
    if (connections.has(id)) {
      console.warn(`Connection with id ${id} already exists`);
      return connections.get(id);
    }

    const wsHook = useWebSocket(url, options);
    setConnections(prev => new Map(prev).set(id, wsHook));
    
    return wsHook;
  }, [connections]);

  const getConnection = useCallback((id) => {
    return connections.get(id);
  }, [connections]);

  const removeConnection = useCallback((id) => {
    const connection = connections.get(id);
    if (connection) {
      connection.disconnect();
      setConnections(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, [connections]);

  const disconnectAll = useCallback(() => {
    connections.forEach(connection => {
      connection.disconnect();
    });
    setConnections(new Map());
  }, [connections]);

  return {
    connections,
    createConnection,
    getConnection,
    removeConnection,
    disconnectAll
  };
};

// Hook for WebSocket with automatic reconnection and message queuing
export const useReconnectingWebSocket = (url, options = {}) => {
  const enhancedOptions = {
    reconnect: true,
    maxReconnectAttempts: 10,
    reconnectInterval: 2000,
    queueMessages: true,
    ...options
  };
  
  return useWebSocket(url, enhancedOptions);
};

// Hook for WebSocket with authentication
export const useAuthWebSocket = (url, getAuthToken, options = {}) => {
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      const authToken = typeof getAuthToken === 'function' 
        ? await getAuthToken() 
        : getAuthToken;
      setToken(authToken);
    };
    
    fetchToken();
  }, [getAuthToken]);
  
  const authenticatedUrl = token 
    ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
    : url;
  
  return useWebSocket(authenticatedUrl, options);
};

export default useWebSocket;
