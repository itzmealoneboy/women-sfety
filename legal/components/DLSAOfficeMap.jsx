import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'

const dlsaOffices = [
  {
    id: 1,
    name: 'Delhi DLSA',
    address: 'District Court Complex, Tis Hazari, Delhi - 110054',
    phone: '011-23900186',
    email: 'dlsa.delhi@nic.in',
    hours: '10:00 AM - 5:00 PM',
    lat: 28.6689,
    lng: 77.2287,
    services: ['Free Legal Aid', 'Lok Adalat', 'Mediation', 'Legal Awareness']
  },
  {
    id: 2,
    name: 'Mumbai DLSA',
    address: 'City Civil Court, Bombay High Court, Mumbai - 400032',
    phone: '022-22672700',
    email: 'dlsa.mumbai@nic.in',
    hours: '10:00 AM - 5:00 PM',
    lat: 18.9289,
    lng: 72.8297,
    services: ['Legal Assistance', 'Lok Adalat', 'Women Helpline', 'Child Welfare']
  },
  {
    id: 3,
    name: 'Chennai DLSA',
    address: 'City Civil Court, Chennai - 600104',
    phone: '044-25364000',
    email: 'dlsa.chennai@nic.in',
    hours: '10:00 AM - 5:00 PM',
    lat: 13.0809,
    lng: 80.1994,
    services: ['Free Legal Services', 'Lok Adalat', 'Victim Compensation']
  },
  {
    id: 4,
    name: 'Kolkata DLSA',
    address: 'City Civil Court, Kolkata - 700001',
    phone: '033-22487000',
    email: 'dlsa.kolkata@nic.in',
    hours: '10:00 AM - 5:00 PM',
    lat: 22.5726,
    lng: 88.3639,
    services: ['Legal Aid', 'Mediation', 'Lok Adalat']
  },
  {
    id: 5,
    name: 'Bangalore DLSA',
    address: 'City Civil Court, Bangalore - 560009',
    phone: '080-22995500',
    email: 'dlsa.bangalore@nic.in',
    hours: '10:00 AM - 5:00 PM',
    lat: 12.9716,
    lng: 77.5946,
    services: ['Free Legal Services', 'Lok Adalat', 'Women Rights Cell']
  }
]

export default function DLSAOfficeMap() {
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const filteredOffices = dlsaOffices.filter(office =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1) return null
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const openInGoogleMaps = (office) => {
    window.open(`https://www.google.com/maps/search/${office.lat},${office.lng}`, '_blank')
  }

  const getDirections = (office) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${office.lat},${office.lng}`, '_blank')
    } else {
      openInGoogleMaps(office)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search DLSA offices by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredOffices.map((office, index) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
                  selectedOffice?.id === office.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                }`}
                onClick={() => setSelectedOffice(office)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{office.name}</h3>
                    <div className="flex items-start space-x-2 mt-2">
                      <MapPin size={14} className="text-gray-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{office.address}</p>
                    </div>
                    {userLocation && (
                      <p className="text-xs text-primary-600 mt-2">
                        ~{getDistance(userLocation.lat, userLocation.lng, office.lat, office.lng).toFixed(1)} km away
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => getDirections(office)}
                    className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                    title="Get directions"
                  >
                    <Navigation size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gray-100 rounded-lg overflow-hidden h-[400px] relative">
            {/* Map placeholder - In production, integrate with Google Maps or Leaflet */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Map integration with Google Maps</p>
                <p className="text-sm text-gray-400">Showing approximate locations</p>
              </div>
            </div>
            
            {selectedOffice && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold text-gray-900">{selectedOffice.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedOffice.address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedOffice.services.map(service => (
                    <span key={service} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => getDirections(selectedOffice)}
                  className="mt-3 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Get Directions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOffice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedOffice.name} - Contact Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <a href={`tel:${selectedOffice.phone}`} className="text-gray-900 hover:text-primary-600">
                  {selectedOffice.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${selectedOffice.email}`} className="text-gray-900 hover:text-primary-600">
                  {selectedOffice.email}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Working Hours</p>
                <p className="text-gray-900">{selectedOffice.hours}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ExternalLink size={20} className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href="https://nalsa.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-primary-600"
                >
                  Visit NALSA Website
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">What is DLSA?</h3>
        <p className="text-sm text-blue-800">
          District Legal Services Authority (DLSA) provides free legal services to eligible persons. 
          Services include legal advice, representation in courts, Lok Adalats, and mediation. 
          Women, children, SC/ST, and economically weaker sections are eligible for free legal aid.
        </p>
      </div>
    </div>
  )
}
