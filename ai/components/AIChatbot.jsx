import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Mic, Volume2, Shield, AlertTriangle, Heart } from 'lucide-react'
import { useAuthStore } from '../../../store/authstores'

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Sakhi AI Assistant. How can I help you today? I can provide safety tips, legal information, and emergency guidance.",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { userData } = useAuthStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('sos') || msg.includes('emergency')) {
      return "🚨 **Emergency Alert!** 🚨\n\nIf you're in immediate danger, please:\n1. Press the SOS button in the app\n2. Call 100 (Police) or 112 (Emergency)\n3. Share your location with trusted contacts\n\nI'm here to help you through this. Would you like me to guide you on what to do next?"
    }
    
    if (msg.includes('harassment') || msg.includes('stalking')) {
      return "I'm sorry you're experiencing this. Here's what you can do:\n\n• Document everything (screenshots, dates, times)\n• Report to police or file an online complaint\n• Contact Women Helpline: 1091\n• Reach out to a trusted friend or family member\n\nWould you like me to help you file a complaint?"
    }
    
    if (msg.includes('legal') || msg.includes('lawyer')) {
      return "📚 **Legal Assistance:**\n\nYou can access:\n• Free legal aid through NALSA (Call 15100)\n• File complaints via our Legal Hub\n• Download legal document templates\n• Find nearby DLSA offices\n\nWould you like me to connect you with a legal aid officer?"
    }
    
    if (msg.includes('safety') || msg.includes('safe')) {
      return "🔒 **Safety Tips:**\n\n• Share your live location with trusted contacts\n• Keep emergency contacts on speed dial\n• Use the SOS button for immediate help\n• Avoid isolated areas, especially at night\n• Trust your instincts - if something feels wrong, leave\n\nWould you like more specific safety tips?"
    }
    
    if (msg.includes('domestic') || msg.includes('abuse')) {
      return "💜 **Domestic Violence Support:**\n\n• You have the right to live without fear\n• Call National Domestic Violence Helpline: 181\n• Protection of Women from Domestic Violence Act protects you\n• Seek help from nearby One Stop Centre\n\nRemember, you're not alone. Would you like me to find a support center near you?"
    }
    
    return "I understand this is difficult. Here are some resources that might help:\n\n• **Emergency**: SOS button for immediate help\n• **Legal Hub**: File complaints and find legal aid\n• **Safety Education**: Learn self-defense and safety tips\n• **Community**: Connect with other women for support\n\nIs there anything specific I can help you with?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Bot size={28} />
          <div>
            <h3 className="font-semibold">Sakhi AI Assistant</h3>
            <p className="text-xs text-primary-100">Always here for you, 24/7</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  {message.sender === 'user' ? (
                    <User size={16} className="text-primary-600" />
                  ) : (
                    <Bot size={16} className="text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition">
            <Mic size={20} />
          </button>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex justify-center space-x-4 mt-3">
          <button className="text-xs text-gray-500 hover:text-primary-600 flex items-center space-x-1">
            <Shield size={12} />
            <span>Safety Tips</span>
          </button>
          <button className="text-xs text-gray-500 hover:text-primary-600 flex items-center space-x-1">
            <AlertTriangle size={12} />
            <span>Emergency</span>
          </button>
          <button className="text-xs text-gray-500 hover:text-primary-600 flex items-center space-x-1">
            <Heart size={12} />
            <span>Legal Help</span>
          </button>
        </div>
      </div>
    </div>
  )
}

