import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authstores'
import { useSakshiEyeStore } from '../../store/sakshieyestore'
import { SakshiEyeSettingsPanel } from '../../components/sakshieye/SakshiEyeComponents'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebases'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import NotificationSettings from './components/notificationssettings'
import PrivacySettings from './components/PrivacySettings'
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  MapIcon,
  MicrophoneIcon,
  CameraIcon,
  FingerPrintIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'light',
    autoNight: true,
    autoSOS: true,
    autoCheckin: true,
    checkinInterval: 15,
    voiceActivation: true,
    voiceLanguage: 'en',
    emergencyAlerts: true,
    locationSharing: true,
    shareWithFamily: true,
    shareWithPolice: true,
    cameraAccess: false,
    microphoneAccess: false,
    bluetoothEnabled: false,
    notifications: {
      sos: true,
      emergency: true,
      family: true,
      community: true,
      updates: true,
      sound: true,
      vibration: true
    },
    privacy: {
      showProfile: true,
      showLocation: false,
      showActivity: false,
      allowTagging: true,
      allowMessages: true
    }
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Load from user document or local storage
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const saveSettings = async () => {
    setLoading(true)

    try {
      // Save to local storage
      localStorage.setItem('userSettings', JSON.stringify(settings))

      // Save to Firebase if user is logged in
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          settings: settings
        })
      }

      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
    { id: 'emergency', name: 'Emergency', icon: MapIcon },
    { id: 'voice', name: 'Voice & Audio', icon: MicrophoneIcon },
    { id: 'devices', name: 'Devices', icon: DevicePhoneMobileIcon },
    { id: 'sakshi-eye', name: 'SAKHI EYE', icon: EyeIcon }
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' }
  ]

  const checkPermissions = async () => {
    // Check camera permission
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
      cameraStream.getTracks().forEach(track => track.stop())
      setSettings({ ...settings, cameraAccess: true })
      toast.success('Camera access granted')
    } catch {
      setSettings({ ...settings, cameraAccess: false })
    }

    // Check microphone permission
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStream.getTracks().forEach(track => track.stop())
      setSettings({ ...settings, microphoneAccess: true })
      toast.success('Microphone access granted')
    } catch {
      setSettings({ ...settings, microphoneAccess: false })
    }

    // Check Bluetooth availability
    if (navigator.bluetooth) {
      setSettings({ ...settings, bluetoothEnabled: true })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          ⚙️ Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure your app preferences and security settings
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>

            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LanguageIcon className="w-4 h-4 inline mr-1" />
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      settings.theme === 'light'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <SunIcon className={`w-5 h-5 ${
                      settings.theme === 'light' ? 'text-primary-600' : 'text-gray-500'
                    }`} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <MoonIcon className={`w-5 h-5 ${
                      settings.theme === 'dark' ? 'text-primary-600' : 'text-gray-500'
                    }`} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Auto Night Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Night Mode (10PM - 6AM)</p>
                  <p className="text-sm text-gray-500">Automatically switch to dark theme at night</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoNight}
                    onChange={(e) => setSettings({ ...settings, autoNight: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Logout Button */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={() => navigate('/logout')}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign Out from SAKHI
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <NotificationSettings settings={settings} setSettings={setSettings} />
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <PrivacySettings settings={settings} setSettings={setSettings} />
        )}

        {/* Emergency Settings */}
        {activeTab === 'emergency' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Emergency Settings</h3>

            <div className="space-y-4">
              {/* Auto SOS */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto SOS on No Movement</p>
                  <p className="text-sm text-gray-500">Trigger SOS if no movement detected for 30 minutes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSOS}
                    onChange={(e) => setSettings({ ...settings, autoSOS: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Auto Check-in */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Check-in</p>
                  <p className="text-sm text-gray-500">Send automatic safety check-ins</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoCheckin}
                    onChange={(e) => setSettings({ ...settings, autoCheckin: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Check-in Interval */}
              {settings.autoCheckin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Interval (minutes)
                  </label>
                  <select
                    value={settings.checkinInterval}
                    onChange={(e) => setSettings({ ...settings, checkinInterval: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              )}

              {/* Location Sharing */}
              <div>
                <p className="font-medium mb-2">Share Location With</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.shareWithFamily}
                      onChange={(e) => setSettings({ ...settings, shareWithFamily: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm">Family Members</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.shareWithPolice}
                      onChange={(e) => setSettings({ ...settings, shareWithPolice: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm">Police/Emergency Services</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Voice & Audio Settings */}
        {activeTab === 'voice' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Voice & Audio Settings</h3>

            <div className="space-y-4">
              {/* Voice Activation */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voice Activation</p>
                  <p className="text-sm text-gray-500">Trigger commands with voice</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.voiceActivation}
                    onChange={(e) => setSettings({ ...settings, voiceActivation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Voice Language */}
              {settings.voiceActivation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Recognition Language
                  </label>
                  <select
                    value={settings.voiceLanguage}
                    onChange={(e) => setSettings({ ...settings, voiceLanguage: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Voice Commands List */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-medium text-primary-800 mb-2">Available Voice Commands</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-primary-700">
                  <span>"Help Me"</span>
                  <span>"Emergency"</span>
                  <span>"Start Tracking"</span>
                  <span>"Fake Call"</span>
                  <span>"Silent Mode"</span>
                  <span>"Police"</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Devices Settings */}
        {activeTab === 'devices' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Device Permissions</h3>

            <div className="space-y-4">
              <button
                onClick={checkPermissions}
                className="w-full p-4 bg-primary-50 rounded-lg flex items-center justify-between hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FingerPrintIcon className="w-5 h-5 text-primary-600" />
                  <div className="text-left">
                    <p className="font-medium text-primary-800">Check Permissions</p>
                    <p className="text-sm text-primary-600">Verify camera, microphone and Bluetooth access</p>
                  </div>
                </div>
                <ArrowPathIcon className="w-5 h-5 text-primary-600" />
              </button>

              {/* Camera Access */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CameraIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Camera Access</p>
                    <p className="text-xs text-gray-500">Required for photos and face recognition</p>
                  </div>
                </div>
                {settings.cameraAccess ? (
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                ) : (
                  <span className="text-xs text-gray-500">Not granted</span>
                )}
              </div>

              {/* Microphone Access */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MicrophoneIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Microphone Access</p>
                    <p className="text-xs text-gray-500">Required for voice commands and recording</p>
                  </div>
                </div>
                {settings.microphoneAccess ? (
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                ) : (
                  <span className="text-xs text-gray-500">Not granted</span>
                )}
              </div>

              {/* Bluetooth */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Bluetooth</p>
                    <p className="text-xs text-gray-500">Required for wearable devices</p>
                  </div>
                </div>
                {settings.bluetoothEnabled ? (
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                ) : (
                  <span className="text-xs text-gray-500">Not supported</span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Location Services</p>
                    <p className="text-xs text-gray-500">Required for tracking and safety features</p>
                  </div>
                </div>
                <span className="text-xs text-success">Active</span>
              </div>
            </div>
          </Card>
        )}

        {/* SAKHI EYE Settings */}
        {activeTab === 'sakshi-eye' && (
          <SakshiEyeSettingsPanel
            settings={{
              isEnabled: settings.isEnabled || true,
              autoFaceCapture: settings.autoFaceCapture || true,
              cloudBackup: settings.cloudBackup || true,
              predictiveAlerts: settings.predictiveAlerts || true,
              sensitivity: settings.sensitivity || 0.7
            }}
            onToggle={(key) => setSettings({ 
              ...settings, 
              [key]: !settings[key] 
            })}
            onSensitivityChange={(value) => setSettings({ 
              ...settings, 
              sensitivity: value 
            })}
          />
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={saveSettings}
            loading={loading}
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Settings





