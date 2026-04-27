import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, Command, Shield, AlertTriangle, Home, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function VoiceCommand() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [recognition, setRecognition] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-IN'

      recognitionInstance.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript
        setTranscript(transcriptText)
        processCommand(transcriptText.toLowerCase())
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        toast.error('Could not recognize voice. Please try again.')
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      toast.error('Voice recognition not supported in this browser')
    }
  }, [])

  const processCommand = (command) => {
    let actionResponse = ''

    if (command.includes('sos') || command.includes('emergency') || command.includes('help')) {
      actionResponse = '🚨 Activating SOS emergency alert!'
      setResponse(actionResponse)
      setTimeout(() => navigate('/emergency/sos'), 1000)
      toast.error('SOS Activated! Help is on the way.')
    }
    else if (command.includes('call') && command.includes('police')) {
      actionResponse = 'Calling Police Control Room...'
      setResponse(actionResponse)
      window.location.href = 'tel:100'
    }
    else if (command.includes('call') && command.includes('women') || command.includes('helpline')) {
      actionResponse = 'Calling Women Helpline...'
      setResponse(actionResponse)
      window.location.href = 'tel:1091'
    }
    else if (command.includes('share') && command.includes('location')) {
      actionResponse = 'Sharing your live location with emergency contacts...'
      setResponse(actionResponse)
      toast.success('Location shared with emergency contacts')
    }
    else if (command.includes('navigate') || command.includes('go to')) {
      if (command.includes('dashboard')) {
        actionResponse = 'Navigating to Dashboard'
        navigate('/dashboard')
      } else if (command.includes('legal')) {
        actionResponse = 'Navigating to Legal Hub'
        navigate('/legal')
      } else if (command.includes('safety')) {
        actionResponse = 'Navigating to Safety Map'
        navigate('/safety')
      } else {
        actionResponse = 'Where would you like to go? Try saying: Go to dashboard'
      }
      setResponse(actionResponse)
    }
    else if (command.includes('safety tip') || command.includes('tip')) {
      const tips = [
        'Always share your location with trusted contacts',
        'Keep your phone charged and within reach',
        'Trust your instincts - if something feels wrong, leave immediately',
        'Learn basic self-defense techniques',
        'Save emergency numbers on speed dial'
      ]
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      actionResponse = `Safety Tip: ${randomTip}`
      setResponse(actionResponse)
    }
    else {
      actionResponse = "I didn't understand that. Try saying: SOS, Call Police, Share Location, or Safety Tip"
      setResponse(actionResponse)
    }

    // Text to speech for response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(actionResponse)
      utterance.lang = 'en-IN'
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognition) {
      setTranscript('')
      setResponse('')
      recognition.start()
      setIsListening(true)
      toast.info('Listening... Say your command')
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Command size={32} />
          <div>
            <h3 className="text-xl font-bold">Voice Commands</h3>
            <p className="text-purple-100">Control Sakhi with your voice</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <motion.div
          animate={{
            scale: isListening ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 1,
            repeat: isListening ? Infinity : 0
          }}
          className="mb-6"
        >
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isListening ? <MicOff size={48} /> : <Mic size={48} />}
            {isListening && (
              <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
            )}
          </button>
        </motion.div>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {isListening ? 'Listening...' : 'Click to Speak'}
        </h4>
        <p className="text-gray-600 mb-4">
          {isListening ? 'Say a command' : 'Tap the microphone and say a command'}
        </p>

        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 rounded-lg p-4 mb-4"
            >
              <p className="text-sm text-gray-500 mb-1">You said:</p>
              <p className="text-gray-900 font-medium">"{transcript}"</p>
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary-50 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 size={16} className="text-primary-600" />
                <p className="text-sm text-primary-600 font-medium">Assistant Response:</p>
              </div>
              <p className="text-gray-800">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Mic size={16} className="mr-2" />
            Available Commands
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">• <strong>"SOS"</strong> or <strong>"Emergency"</strong> - Trigger SOS alert</p>
            <p className="text-gray-600">• <strong>"Call Police"</strong> - Dial 100</p>
            <p className="text-gray-600">• <strong>"Call Women Helpline"</strong> - Dial 1091</p>
            <p className="text-gray-600">• <strong>"Share Location"</strong> - Share with contacts</p>
            <p className="text-gray-600">• <strong>"Safety Tip"</strong> - Get a safety tip</p>
            <p className="text-gray-600">• <strong>"Go to [page]"</strong> - Navigate to dashboard, legal, safety</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Shield size={16} className="mr-2" />
            Quick Voice Actions
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => processCommand('sos')}
              className="w-full flex items-center justify-between p-2 bg-red-50 rounded-lg hover:bg-red-100 transition"
            >
              <span className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span className="text-sm text-red-700">Trigger SOS</span>
              </span>
              <span className="text-xs text-red-500">Say "SOS"</span>
            </button>
            
            <button
              onClick={() => processCommand('call police')}
              className="w-full flex items-center justify-between p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-600" />
                <span className="text-sm text-blue-700">Call Police</span>
              </span>
              <span className="text-xs text-blue-500">Say "Call Police"</span>
            </button>
            
            <button
              onClick={() => processCommand('go to dashboard')}
              className="w-full flex items-center justify-between p-2 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <span className="flex items-center space-x-2">
                <Home size={16} className="text-green-600" />
                <span className="text-sm text-green-700">Go to Dashboard</span>
              </span>
              <span className="text-xs text-green-500">Say "Go to Dashboard"</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
