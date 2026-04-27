import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Phone, Mail, Globe, Users, Award, ExternalLink } from 'lucide-react'

const ngos = [
  {
    id: 1,
    name: 'Sakshi Women Empowerment Trust',
    category: 'Women Empowerment',
    description: 'Working towards empowering women through education, skill development, and legal awareness.',
    address: 'New Delhi, India',
    phone: '+91-11-12345678',
    email: 'contact@sakshi.org',
    website: 'www.sakshi.org',
    rating: 4.9,
    volunteers: 250,
    causes: ['Education', 'Legal Aid', 'Employment'],
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 2,
    name: 'Nari Shakti Foundation',
    category: 'Domestic Violence',
    description: 'Providing shelter, counseling, and legal support to survivors of domestic violence.',
    address: 'Mumbai, Maharashtra',
    phone: '+91-22-87654321',
    email: 'help@narishakti.org',
    website: 'www.narishakti.org',
    rating: 4.8,
    volunteers: 180,
    causes: ['Shelter', 'Counseling', 'Legal Support'],
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 3,
    name: 'Digital Sakhi Initiative',
    category: 'Digital Literacy',
    description: 'Teaching digital skills and online safety to women across rural and urban areas.',
    address: 'Bangalore, Karnataka',
    phone: '+91-80-98765432',
    email: 'info@digitalsakhi.org',
    website: 'www.digitalsakhi.org',
    rating: 4.7,
    volunteers: 120,
    causes: ['Digital Literacy', 'Cyber Safety', 'Education'],
    image: 'https://via.placeholder.com/100'
  }
]

export default function NGOCard() {
  const [selectedNGO, setSelectedNGO] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNGOs = ngos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.causes.some(cause => cause.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Heart size={32} />
          <div>
            <h3 className="text-xl font-bold">NGO Partners</h3>
            <p className="text-green-100">Connect with organizations supporting women's safety</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, category, or cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNGOs.map((ngo, index) => (
          <motion.div
            key={ngo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedNGO(ngo)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{ngo.name}</h4>
                  <p className="text-sm text-primary-600 mt-1">{ngo.category}</p>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{ngo.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ngo.description}</p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <MapPin size={14} />
                <span>{ngo.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {ngo.causes.map(cause => (
                  <span key={cause} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                    {cause}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Users size={14} className="text-gray-400" />
                  <span>{ngo.volunteers}+ volunteers</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedNGO && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNGO(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedNGO.name}</h3>
                <button
                  onClick={() => setSelectedNGO(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedNGO.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-gray-700">{selectedNGO.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gray-400" />
                  <a href={`tel:${selectedNGO.phone}`} className="text-primary-600">
                    {selectedNGO.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-400" />
                  <a href={`mailto:${selectedNGO.email}`} className="text-primary-600">
                    {selectedNGO.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe size={18} className="text-gray-400" />
                  <a href={`https://${selectedNGO.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600">
                    {selectedNGO.website}
                  </a>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Causes Supported</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNGO.causes.map(cause => (
                    <span key={cause} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {cause}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                  Contact NGO
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                  <ExternalLink size={16} />
                  <span>Visit Website</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
