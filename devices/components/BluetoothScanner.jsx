import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bluetooth, Smartphone, Watch, Heart, Activity, Battery, Wifi, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BluetoothScanner() {
  const [scanning, setScanning] = useState(false)
  const [devices, setDevices] = useState([])
  const [connectedDevice, setConnectedDevice] = useState(null)

  const startScan = () => {
    setScanning(true)
    // Simulate Bluetooth scanning
    setTimeout(() => {
      const mockDevices = [
        { id: '1', name: 'Sakhi Smart Band', type: 'wearable', battery: 85, rssi: -45, connected: false },
        { id: '2', name: 'Apple Watch', type: 'wearable', battery: 67, rssi: -52, connected: false },
        { id: '3', name: 'Fitbit Inspire', type: 'wearable', battery: 92, rssi: -48, connected: false }
      ]
      setDevices(mockDevices)
      setScanning(false)
      toast.success('Found 3 devices nearby')
    }, 2000)
  }

  const connectDevice = (device) => {
    setConnectedDevice(device)
    toast.success(`Connected to ${device.name}`)
  }

  const disconnectDevice = () => {
    setConnectedDevice(null)
    toast.success('Device disconnected')
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Bluetooth size={32} />
          <div>
            <h3 className="text-xl font-bold">Wearable Device Connection</h3>
            <p className="text-blue-100">Connect your smart wearable for enhanced safety</p>
          </div>
        </div>
      </div>

      {!connectedDevice ? (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <button
              onClick={startScan}
              disabled={scanning}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                scanning 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {scanning ? 'Scanning...' : 'Scan for Devices'}
            </button>
          </div>

          {devices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Available Devices</h4>
              {devices.map(device => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Watch size={24} className="text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Battery: {device.battery}%</span>
                        <span>•</span>
                        <span>Signal: {Math.abs(device.rssi)} dBm</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => connectDevice(device)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                  >
                    Connect
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Bluetooth size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{connectedDevice.name}</h4>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>
            <button
              onClick={disconnectDevice}
              className="text-red-600 text-sm hover:underline"
            >
              Disconnect
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Heart size={20} className="mx-auto text-red-500 mb-1" />
              <p className="text-sm text-gray-600">Heart Rate</p>
              <p className="text-xl font-bold text-gray-900">72 bpm</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Activity size={20} className="mx-auto text-blue-500 mb-1" />
              <p className="text-sm text-gray-600">Steps Today</p>
              <p className="text-xl font-bold text-gray-900">4,832</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Battery</span>
              <span className="text-gray-900 font-medium">{connectedDevice.battery}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${connectedDevice.battery}%` }}
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle size={16} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-800">
                Wearable device can trigger SOS on fall detection and abnormal heart rate.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
