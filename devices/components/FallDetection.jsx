import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Activity, Heart, Smartphone, Bell, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FallDetection() {
  const [enabled, setEnabled] = useState(false)
  const [sensitivity, setSensitivity] = useState('medium')
  const [lastFall, setLastFall] = useState(null)

  const simulateFall = () => {
    toast.error('⚠️ Fall detected! Sending alert...')
    setLastFall(new Date().toLocaleTimeString())
    setTimeout(() => {
      toast.success('Emergency contacts notified!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Activity size={32} />
          <div>
            <h3 className="text-xl font-bold">Fall Detection</h3>
            <p className="text-red-100">Automatic alert on fall detection</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-gray-900">Fall Detection</h4>
            <p className="text-sm text-gray-500">Automatically detect falls and send alerts</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition ${
              enabled ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                enabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sensitivity Level
              </label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSensitivity(level)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${
                      sensitivity === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Test Detection</span>
                <button
                  onClick={simulateFall}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Simulate Fall
                </button>
              </div>
              {lastFall && (
                <p className="text-xs text-gray-500 mt-2">
                  Last fall detected: {lastFall}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
              <Bell size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                When a fall is detected, the app will automatically send SOS alerts to your emergency contacts with your location.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4">
          <Heart className="text-red-500 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900">Emergency Response</h4>
          <p className="text-sm text-gray-600 mt-1">
            Immediate alert to emergency contacts with location
          </p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <Shield className="text-green-500 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900">24/7 Monitoring</h4>
          <p className="text-sm text-gray-600 mt-1">
            Continuous monitoring for enhanced safety
          </p>
        </div>
      </div>
    </div>
  )
}
