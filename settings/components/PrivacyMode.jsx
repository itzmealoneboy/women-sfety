import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Shield, Smartphone, Globe, Users } from 'lucide-react'
import { useAuthStore } from '../../../store/authstores'
import toast from 'react-hot-toast'

export default function PrivacyMode() {
  const { userData, updateUserData } = useAuthStore()
  const [settings, setSettings] = useState({
    hideLocation: false,
    hideProfile: false,
    hideActivity: true,
    privateMode: false,
    anonymousMode: false,
    shareWithTrustedOnly: true
  })

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    await updateUserData({ privacySettings: newSettings })
    toast.success(`${key} settings updated`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">Privacy Mode</h3>
            <p className="text-indigo-100">Control who can see your information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <EyeOff size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Hide Location</h4>
              <p className="text-sm text-gray-500">Don't share your location in posts or activities</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('hideLocation')}
            className={`relative w-12 h-6 rounded-full transition ${
              settings.hideLocation ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.hideLocation ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Private Profile</h4>
              <p className="text-sm text-gray-500">Only approved followers can see your profile</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('privateMode')}
            className={`relative w-12 h-6 rounded-full transition ${
              settings.privateMode ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.privateMode ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Eye size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Hide Activity Status</h4>
              <p className="text-sm text-gray-500">Don't show when you're online or last active</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('hideActivity')}
            className={`relative w-12 h-6 rounded-full transition ${
              settings.hideActivity ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.hideActivity ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Lock size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Anonymous Mode</h4>
              <p className="text-sm text-gray-500">Browse anonymously without leaving traces</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('anonymousMode')}
            className={`relative w-12 h-6 rounded-full transition ${
              settings.anonymousMode ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.anonymousMode ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Globe size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Share with Trusted Only</h4>
              <p className="text-sm text-gray-500">Only share information with your trusted contacts</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('shareWithTrustedOnly')}
            className={`relative w-12 h-6 rounded-full transition ${
              settings.shareWithTrustedOnly ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.shareWithTrustedOnly ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Privacy Tips</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Review your privacy settings regularly</li>
          <li>• Be mindful of what you share publicly</li>
          <li>• Use anonymous mode for sensitive browsing</li>
          <li>• Only share location with trusted contacts</li>
        </ul>
      </div>
    </div>
  )
}

