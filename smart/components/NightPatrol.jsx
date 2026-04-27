import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, MapPin, AlertTriangle, Shield, Users, Clock, Bell } from 'lucide-react'
import { useLocation } from '../../../hooks/useLocation'

export default function NightPatrol() {
  const [isNight, setIsNight] = useState(false)
  const [patrolActive, setPatrolActive] = useState(false)
  const [nearbyPatrols, setNearbyPatrols] = useState([])
  const { location } = useLocation()

  useEffect(() => {
    const hour = new Date().getHours()
    setIsNight(hour < 6 || hour > 18)
  }, [])

  // Mock patrol data
  const mockPatrols = [
    { id: 1, name: 'Police Patrol Unit A', distance: '0.5 km', status: 'Active', eta: '2 min' },
    { id: 2, name: 'Community Watch', distance: '0.8 km', status: 'Active', eta: '3 min' },
    { id: 3, name: 'Women Safety Patrol', distance: '1.2 km', status: 'Patrolling', eta: '5 min' }
  ]

  const startPatrol = () => {
    setPatrolActive(true)
    setNearbyPatrols(mockPatrols)
  }

  const stopPatrol = () => {
    setPatrolActive(false)
    setNearbyPatrols([])
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 text-white ${isNight ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}>
        <div className="flex items-center space-x-3">
          {isNight ? <Moon size={32} /> : <Sun size={32} />}
          <div>
            <h3 className="text-xl font-bold">Night Patrol Safety</h3>
            <p className="opacity-90">
              {isNight ? 'Active night patrol monitoring' : 'Daytime safety monitoring'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-4 ${patrolActive ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Shield size={48} className={patrolActive ? 'text-green-600' : 'text-gray-400'} />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {patrolActive ? 'Patrol Active' : 'No Active Patrol'}
          </h4>
          <p className="text-gray-600 text-sm">
            {patrolActive 
              ? 'Your location is being monitored by nearby patrol units'
              : 'Start patrol to connect with nearby safety units'}
          </p>
        </div>

        {!patrolActive ? (
          <button
            onClick={startPatrol}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Night Patrol
          </button>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {nearbyPatrols.map(patrol => (
                <motion.div
                  key={patrol.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-gray-900">{patrol.name}</p>
                      <p className="text-xs text-gray-500">Distance: {patrol.distance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary-600 font-medium">ETA: {patrol.eta}</p>
                    <p className="text-xs text-gray-500">{patrol.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={stopPatrol}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Stop Patrol
            </button>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <Clock className="mx-auto text-primary-600 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900">Response Time</h4>
          <p className="text-2xl font-bold text-primary-600">2-5 min</p>
          <p className="text-xs text-gray-500">Average response time</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Users className="mx-auto text-primary-600 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900">Active Patrols</h4>
          <p className="text-2xl font-bold text-primary-600">24</p>
          <p className="text-xs text-gray-500">In your area</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Bell className="mx-auto text-primary-600 mb-2" size={24} />
          <h4 className="font-semibold text-gray-900">Safety Alerts</h4>
          <p className="text-2xl font-bold text-primary-600">3</p>
          <p className="text-xs text-gray-500">Today</p>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Night Safety Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Stay in well-lit areas and main roads</li>
              <li>• Share your location with trusted contacts</li>
              <li>• Keep emergency numbers on speed dial</li>
              <li>• Trust your instincts - if something feels wrong, leave immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
