import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, AlertTriangle, Shield, Home, Building } from 'lucide-react'
import { useLocation } from '../../../hooks/useLocation'

// Mock safety zones data
const safetyZones = [
  { lat: 28.6139, lng: 77.2090, type: 'safe', name: 'Connaught Place', risk: 'Low' },
  { lat: 28.5355, lng: 77.3910, type: 'caution', name: 'Noida Sector 18', risk: 'Moderate' },
  { lat: 28.4595, lng: 77.0266, type: 'danger', name: 'Gurgaon Old City', risk: 'High' },
]

const safePlaces = [
  { type: 'police', icon: Shield, name: 'Police Station', color: 'text-blue-600' },
  { type: 'hospital', icon: Home, name: 'Hospital', color: 'text-red-600' },
  { type: 'shelter', icon: Building, name: 'Women Shelter', color: 'text-pink-600' },
]

export default function SafetyMap() {
  const { location, watchLocation } = useLocation()
  const [mapType, setMapType] = useState('standard')
  const [selectedPlace, setSelectedPlace] = useState(null)

  useEffect(() => {
    const watchId = watchLocation()
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['standard', 'safety', 'heatmap'].map(type => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                mapType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type} Map
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs">Safe</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span className="text-xs">Caution</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Danger</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl overflow-hidden relative h-[500px]">
        {/* Map placeholder - Integrate with Leaflet or Google Maps in production */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-600">Interactive Safety Map</p>
            <p className="text-sm text-gray-500">Showing real-time safety zones</p>
            {location && (
              <p className="text-xs text-gray-400 mt-2">
                Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Current location marker */}
        {location && (
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Your Location</span>
            </div>
          </div>
        )}

        {/* Nearby places panel */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <h4 className="text-sm font-semibold mb-2">Nearby Safe Places</h4>
          <div className="space-y-2">
            {safePlaces.map(place => (
              <button
                key={place.type}
                onClick={() => setSelectedPlace(place)}
                className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-1 rounded"
              >
                <place.icon size={16} className={place.color} />
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <Shield className="mx-auto text-green-600 mb-1" size={24} />
          <p className="text-sm font-semibold text-green-700">Safe Zones</p>
          <p className="text-xs text-green-600">24 locations nearby</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <AlertTriangle className="mx-auto text-yellow-600 mb-1" size={24} />
          <p className="text-sm font-semibold text-yellow-700">Caution Areas</p>
          <p className="text-xs text-yellow-600">3 areas ahead</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <Navigation className="mx-auto text-red-600 mb-1" size={24} />
          <p className="text-sm font-semibold text-red-700">Escape Routes</p>
          <p className="text-xs text-red-600">2 alternative routes</p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-4">
        <h4 className="font-semibold text-primary-900 mb-2">Safety Tips</h4>
        <ul className="space-y-1 text-sm text-primary-800">
          <li>• Stay in well-lit areas, especially at night</li>
          <li>• Share your live location with trusted contacts</li>
          <li>• Keep emergency numbers on speed dial</li>
          <li>• Trust your instincts - if something feels wrong, leave immediately</li>
        </ul>
      </div>
    </div>
  )
}
