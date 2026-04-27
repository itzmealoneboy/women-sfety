import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Phone, X, Volume2, Vibrate } from 'lucide-react'
import { useEmergencyStore } from '../../../store/emergencystore'
import { useAuthStore } from '../../../store/authstores'
import { useLocation } from '../../../hooks/useLocation'
import toast from 'react-hot-toast'

export default function SOSButton({ variant = 'full', className = '' }) {
  const [isPressed, setIsPressed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { triggerSOS, cancelSOS, isSOSActive } = useEmergencyStore()
  const { userData } = useAuthStore()
  const { getLocation } = useLocation()

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && isPressed) {
      sendSOS()
    }
    return () => clearTimeout(timer)
  }, [countdown, isPressed])

  const sendSOS = async () => {
    try {
      const location = await getLocation()
      const sosData = {
        userId: userData?.uid,
        userName: userData?.name,
        userPhone: userData?.phone,
        location,
        timestamp: new Date().toISOString(),
        contacts: userData?.emergencyContacts || [],
        message: `EMERGENCY SOS! ${userData?.name} needs immediate help!`,
      }
      
      await triggerSOS(sosData)
      toast.success('🚨 SOS Alert Sent! Help is on the way.')
      setIsPressed(false)
      setCountdown(0)
      setShowConfirmation(false)
    } catch (error) {
      toast.error('Failed to send SOS. Please check your connection.')
      console.error('SOS error:', error)
    }
  }

  const handlePressStart = () => {
    if (isSOSActive) return
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    setIsPressed(true)
    setCountdown(5)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setIsPressed(false)
    setCountdown(0)
    cancelSOS()
  }

  if (variant === 'minimal') {
    return (
      <>
        <button
          onClick={handlePressStart}
          className={`relative group ${className}`}
          disabled={isSOSActive}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition">
            <Shield size={24} />
          </div>
        </button>

        <ConfirmationModal
          isOpen={showConfirmation}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        <SOSCountdownModal
          isOpen={isPressed && countdown > 0}
          countdown={countdown}
          onCancel={handleCancel}
          onSendNow={sendSOS}
        />
      </>
    )
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePressStart}
          className="relative group"
          disabled={isSOSActive}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse-ring"></div>
          <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center space-x-4 hover:shadow-red-500/50 transition-all">
            <AlertTriangle size={32} className="animate-pulse" />
            <div className="text-left">
              <div className="text-2xl font-bold">SOS Emergency</div>
              <div className="text-sm opacity-90">Press and hold to trigger alert</div>
            </div>
          </div>
        </motion.button>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <Phone className="mx-auto text-gray-500 mb-1" size={20} />
            <p className="text-xs text-gray-600">Auto-dial Police</p>
          </div>
          <div className="text-center">
            <Volume2 className="mx-auto text-gray-500 mb-1" size={20} />
            <p className="text-xs text-gray-600">Loud Alarm</p>
          </div>
          <div className="text-center">
            <Vibrate className="mx-auto text-gray-500 mb-1" size={20} />
            <p className="text-xs text-gray-600">Vibration Alert</p>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <SOSCountdownModal
        isOpen={isPressed && countdown > 0}
        countdown={countdown}
        onCancel={handleCancel}
        onSendNow={sendSOS}
      />
    </>
  )
}

function ConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={40} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trigger SOS Alert?</h3>
            <p className="text-gray-600 mb-6">
              Your emergency contacts and nearby police will be notified with your live location.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm SOS
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function SOSCountdownModal({ isOpen, countdown, onCancel, onSendNow }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
              <div className="relative w-32 h-32 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white">{countdown}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">SOS Alert in Progress</h3>
            <p className="text-gray-600 mb-6">
              SOS will be sent in {countdown} seconds. Tap cancel if this was a mistake.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSendNow}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Send Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

