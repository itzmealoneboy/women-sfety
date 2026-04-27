import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Fingerprint, Smartphone, Key, Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AppLock() {
  const [enabled, setEnabled] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)

  const handleSavePin = () => {
    if (pin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }
    
    if (pin !== confirmPin) {
      toast.error('PINs do not match')
      return
    }
    
    // Save PIN logic here
    toast.success('App lock enabled successfully')
    setEnabled(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Lock size={32} />
          <div>
            <h3 className="text-xl font-bold">App Lock</h3>
            <p className="text-gray-300">Secure your Sakhi app with additional protection</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-gray-900">Enable App Lock</h4>
            <p className="text-sm text-gray-500">Require authentication to open the app</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set 4-digit PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  pattern="\d*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-wider"
                  placeholder="****"
                />
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm PIN
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-wider"
                placeholder="****"
              />
            </div>

            <button
              onClick={handleSavePin}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Save PIN
            </button>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Fingerprint size={20} className="text-gray-600" />
                  <div>
                    <h5 className="font-medium text-gray-900">Biometric Authentication</h5>
                    <p className="text-xs text-gray-500">Use fingerprint or face ID</p>
                  </div>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`relative w-10 h-5 rounded-full transition ${
                    biometricEnabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${
                      biometricEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <Smartphone className="text-primary-600 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900 mb-1">Auto-lock</h4>
          <p className="text-sm text-gray-600">App automatically locks after 5 minutes of inactivity</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <Shield className="text-primary-600 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900 mb-1">Security</h4>
          <p className="text-sm text-gray-600">Failed attempts: 5 tries before lockout</p>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> If you forget your PIN, you'll need to reinstall the app. 
          Make sure to remember your PIN or set up biometric authentication as backup.
        </p>
      </div>
    </div>
  )
}
