import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Navigation, Phone, Clock, Star, Filter, MapPin } from 'lucide-react'

const shelters = [
  {
    id: 1,
    name: 'Sakhi Women Shelter',
    address: 'Sector 15, Near Metro Station',
    distance: '0.8 km',
    capacity: '15/20 beds available',
    phone: '1800-123-4567',
    rating: 4.8,
    services: ['24/7 Support', 'Medical Aid', 'Counseling', 'Legal Aid'],
    openHours: '24/7'
  },
  {
    id: 2,
    name: 'Nari Niketan',
    address: 'Civil Lines, Near Police Station',
    distance: '1.2 km',
    capacity: '8/15 beds available',
    phone: '1800-987-6543',
    rating: 4.6,
    services: ['Food', 'Shelter', 'Counseling', 'Rehabilitation'],
    openHours: '24/7'
  },
  {
    id: 3,
    name: 'Women Protection Home',
    address: 'Old City, Near Hospital',
    distance: '2.5 km',
    capacity: '5/12 beds available',
    phone: '1800-456-7890',
    rating: 4.5,
    services: ['Emergency Shelter', 'Legal Support', 'Medical Care'],
    openHours: '24/7'
  }
]

export default function EmergencyShelterLocator() {
  const [selectedShelter, setSelectedShelter] = useState(null)
  const [filter, setFilter] = useState('all')

  const filteredShelters = shelters.filter(shelter => {
    if (filter === 'nearest') return parseFloat(shelter.distance) <= 2
    return true
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Home size={32} />
          <div>
            <h3 className="text-xl font-bold">Emergency Shelter Locator</h3>
            <p className="text-pink-100">Find safe shelters near your location</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Shelters
        </button>
        <button
          onClick={() => setFilter('nearest')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'nearest' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Nearest (≤2km)
        </button>
      </div>

      <div className="space-y-4">
        {filteredShelters.map((shelter, index) => (
          <motion.div
            key={shelter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition hover:shadow-md ${
              selectedShelter?.id === shelter.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedShelter(shelter)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{shelter.name}</h4>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{shelter.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin size={14} />
                  <span>{shelter.address}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {shelter.services.slice(0, 3).map(service => (
                    <span key={service} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">{shelter.capacity}</span>
                  <span className="text-gray-500">{shelter.distance} away</span>
                </div>
              </div>
              <Navigation size={20} className="text-primary-600 flex-shrink-0" />
            </div>

            {selectedShelter?.id === shelter.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone size={14} className="text-gray-500" />
                      <a href={`tel:${shelter.phone}`} className="text-primary-600 text-sm">
                        {shelter.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{shelter.openHours}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700 transition">
                      Get Directions
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                      Call Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Emergency Contacts</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-blue-800">Women Helpline: <strong>1091</strong></p>
            <p className="text-blue-800">Police: <strong>100</strong></p>
          </div>
          <div>
            <p className="text-blue-800">Ambulance: <strong>102</strong></p>
            <p className="text-blue-800">Child Helpline: <strong>1098</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
