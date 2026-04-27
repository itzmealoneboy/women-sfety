import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, Shield, FileText, Eye, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const mockCriminals = [
  {
    id: 1,
    name: 'John Doe',
    crimes: ['Sexual Harassment', 'Stalking'],
    location: 'Mumbai',
    status: 'Active',
    risk: 'High',
    lastSeen: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    crimes: ['Cyber Crime', 'Identity Theft'],
    location: 'Delhi',
    status: 'Inactive',
    risk: 'Medium',
    lastSeen: '2023-12-20'
  }
]

export default function CriminalDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCriminal, setSelectedCriminal] = useState(null)

  const filteredCriminals = mockCriminals.filter(criminal =>
    criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criminal.crimes.some(crime => crime.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={32} />
          <div>
            <h3 className="text-xl font-bold">Criminal Database</h3>
            <p className="text-red-100">Access registered criminal records for safety awareness</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or crime type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-3">
          {filteredCriminals.map(criminal => (
            <motion.div
              key={criminal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedCriminal(criminal)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{criminal.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {criminal.crimes.map(crime => (
                      <span key={crime} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {crime}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    criminal.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {criminal.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Risk: {criminal.risk}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCriminals.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No criminal records found</p>
          </div>
        )}
      </div>

      {selectedCriminal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCriminal(null)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Criminal Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold">{selectedCriminal.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Crimes</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedCriminal.crimes.map(crime => (
                    <span key={crime} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      {crime}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{selectedCriminal.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={selectedCriminal.status === 'Active' ? 'text-red-600' : 'text-green-600'}>
                  {selectedCriminal.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Seen</p>
                <p>{selectedCriminal.lastSeen}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCriminal(null)}
              className="mt-6 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
