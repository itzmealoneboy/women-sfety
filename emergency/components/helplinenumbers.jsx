import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, PhoneCall, AlertCircle, Shield, Heart, Users, Scale, Briefcase, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const helplineCategories = [
  {
    id: 'emergency',
    name: 'Emergency Services',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    numbers: [
      { name: 'Police Control Room', number: '100', description: 'General police emergency' },
      { name: 'Women Helpline', number: '1091', description: 'Women in distress' },
      { name: 'National Women\'s Helpline', number: '181', description: '24/7 women support' },
      { name: 'Ambulance', number: '102', description: 'Medical emergency' },
      { name: 'Fire Brigade', number: '101', description: 'Fire emergency' },
      { name: 'Disaster Management', number: '108', description: 'Disaster response' },
    ]
  },
  {
    id: 'women',
    name: 'Women Support',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    numbers: [
      { name: 'National Commission for Women', number: '7827170170', description: 'NCW helpline' },
      { name: 'One Stop Centre', number: '181', description: 'Integrated women support' },
      { name: 'Mahila Police', number: '1090', description: 'Women police helpline' },
      { name: 'Domestic Violence Helpline', number: '1800-102-7228', description: 'Protection against domestic violence' },
      { name: 'Child Marriage Helpline', number: '1800-110-088', description: 'Stop child marriage' },
    ]
  },
  {
    id: 'legal',
    name: 'Legal Aid',
    icon: Scale,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    numbers: [
      { name: 'National Legal Aid', number: '15100', description: 'Free legal services' },
      { name: 'NALSA Helpline', number: '1800-111-111', description: 'National Legal Services Authority' },
      { name: 'Lok Adalat', number: '1800-345-6789', description: 'Alternative dispute resolution' },
      { name: 'Women Legal Cell', number: '1800-233-8910', description: 'Legal assistance for women' },
    ]
  },
  {
    id: 'child',
    name: 'Child Protection',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    numbers: [
      { name: 'Child Helpline', number: '1098', description: 'CHILDLINE India' },
      { name: 'NCPCR Helpline', number: '1800-111-111', description: 'National Commission for Protection of Child Rights' },
      { name: 'Missing Children', number: '1094', description: 'Track missing children' },
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber Crime',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    numbers: [
      { name: 'Cyber Crime Helpline', number: '155260', description: 'Report cyber crimes' },
      { name: 'National Cyber Crime Portal', number: '1930', description: 'Cyber fraud helpline' },
      { name: 'Cyber Cell', number: '1800-123-4444', description: 'Cyber crime investigation' },
    ]
  },
  {
    id: 'career',
    name: 'Career & Support',
    icon: Briefcase,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    numbers: [
      { name: 'Women Employment Helpline', number: '1800-300-4567', description: 'Job assistance for women' },
      { name: 'MSME Helpline', number: '1800-180-6767', description: 'Business support for women' },
      { name: 'Mental Health Helpline', number: '1800-599-0019', description: 'Psychological support' },
    ]
  }
]

export default function HelplineNumbers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dialing, setDialing] = useState(null)

  const handleCall = (number, name) => {
    setDialing(number)
    window.location.href = `tel:${number}`
    toast.success(`Calling ${name}...`)
    setTimeout(() => setDialing(null), 2000)
  }

  const filteredCategories = helplineCategories.filter(category => {
    if (selectedCategory && category.id !== selectedCategory) return false
    if (searchTerm) {
      const matches = category.numbers.some(num => 
        num.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        num.number.includes(searchTerm) ||
        num.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return matches
    }
    return true
  })

  const allNumbers = helplineCategories.flatMap(c => c.numbers)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search helpline numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              !selectedCategory 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {helplineCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <cat.icon size={16} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const filteredNumbers = category.numbers.filter(num =>
            !searchTerm || 
            num.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            num.number.includes(searchTerm) ||
            num.description.toLowerCase().includes(searchTerm.toLowerCase())
          )

          if (filteredNumbers.length === 0) return null

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className={`${category.bgColor} px-6 py-4`}>
                <div className="flex items-center space-x-3">
                  <category.icon className={category.color} size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredNumbers.map((number, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{number.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{number.description}</p>
                        <div className="mt-2">
                          <a
                            href={`tel:${number.number}`}
                            className="text-primary-600 font-mono text-lg font-semibold hover:underline"
                          >
                            {number.number}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCall(number.number, number.name)}
                        disabled={dialing === number.number}
                        className={`ml-4 px-6 py-3 rounded-lg font-medium transition flex items-center space-x-2 ${
                          dialing === number.number
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <PhoneCall size={18} />
                        <span>{dialing === number.number ? 'Calling...' : 'Call'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No helpline numbers found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <Phone size={32} className="flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Access Tips</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Save important numbers to your phone contacts for quick dialing</li>
              <li>• For emergencies, dial 112 (Single Emergency Helpline Number)</li>
              <li>• Save your trusted contacts as speed dial for faster access</li>
              <li>• Enable location sharing during SOS to help responders find you faster</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
