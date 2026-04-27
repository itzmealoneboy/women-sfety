import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Download, Upload, RefreshCw, CheckCircle, AlertCircle, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BackupRestore() {
  const [backingUp, setBackingUp] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [lastBackup, setLastBackup] = useState('2024-01-15 10:30 AM')
  const [backupSize, setBackupSize] = useState('2.3 MB')

  const handleBackup = async () => {
    setBackingUp(true)
    // Simulate backup process
    setTimeout(() => {
      setLastBackup(new Date().toLocaleString())
      setBackupSize('2.4 MB')
      setBackingUp(false)
      toast.success('Backup completed successfully!')
    }, 2000)
  }

  const handleRestore = async () => {
    setRestoring(true)
    // Simulate restore process
    setTimeout(() => {
      setRestoring(false)
      toast.success('Data restored successfully!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Cloud size={32} />
          <div>
            <h3 className="text-xl font-bold">Backup & Restore</h3>
            <p className="text-blue-100">Securely backup your data to the cloud</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database size={24} className="text-primary-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Last Backup</h4>
              <p className="text-sm text-gray-500">{lastBackup}</p>
              <p className="text-xs text-gray-400">Size: {backupSize}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBackup}
              disabled={backingUp}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {backingUp ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              <span>{backingUp ? 'Backing up...' : 'Backup Now'}</span>
            </button>
            
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              {restoring ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              <span>{restoring ? 'Restoring...' : 'Restore'}</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h5 className="font-medium text-gray-900 mb-2">What gets backed up?</h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Profile information</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Emergency contacts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Safety preferences</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Legal documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Settings & preferences</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Activity history</span>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Automatic Backup</p>
            <p className="text-xs text-blue-700 mt-1">
              Your data is automatically backed up weekly. You can also manually backup anytime.
              Restoring data will replace all current information with backup data.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Manual Export</h4>
          <p className="text-sm text-gray-600 mb-3">Export your data as a file for offline storage</p>
          <button className="text-primary-600 text-sm hover:underline">
            Download Data Export →
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Scheduled Backups</h4>
          <p className="text-sm text-gray-600 mb-3">Configure automatic backup frequency</p>
          <select className="text-sm border rounded-lg px-2 py-1">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>
    </div>
  )
}
