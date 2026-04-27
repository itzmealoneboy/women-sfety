import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Users, Phone, Car, Home, Smartphone, Lock } from 'lucide-react'

const tipsCategories = [
  {
    id: 'personal',
    name: 'Personal Safety',
    icon: Shield,
    tips: [
      'Trust your instincts - if something feels wrong, leave immediately',
      'Keep emergency contacts on speed dial',
      'Share your location with trusted friends when going out',
      'Learn basic self-defense techniques',
      'Carry a personal safety alarm'
    ]
  },
  {
    id: 'travel',
    name: 'Travel Safety',
    icon: Car,
    tips: [
      'Share your travel details with family',
      'Use trusted transportation services',
      'Avoid traveling alone late at night',
      'Keep vehicle doors locked while driving',
      'Have your phone charged and ready'
    ]
  },
  {
    id: 'digital',
    name: 'Digital Safety',
    icon: Smartphone,
    tips: [
      'Use strong, unique passwords for accounts',
      'Enable two-factor authentication',
      'Be careful about sharing personal information online',
      'Report cyber harassment immediately',
      'Regularly check privacy settings'
    ]
  },
  {
    id: 'home',
    name: 'Home Safety',
    icon: Home,
    tips: [
      'Install secure locks on doors and windows',
      'Use peepholes before opening doors',
      'Keep emergency numbers visible',
      'Have a safe room or panic button',
      'Maintain good lighting around entrances'
    ]
  },
  {
    id: 'public',
    name: 'Public Places',
    icon: Users,
    tips: [
      'Stay aware of your surroundings',
      'Avoid isolated areas',
      'Keep valuables out of sight',
      'Walk confidently with purpose',
      'Use well-lit paths and main roads'
    ]
  },
  {
    id: 'emergency',
    name: 'Emergency Response',
    icon: Phone,
    tips: [
      'Know emergency numbers: 100 (Police), 102 (Ambulance), 1091 (Women Helpline)',
      'Learn basic first aid',
      'Have an emergency plan with family',
      'Know the location of nearest police station',
      'Save emergency contacts as ICE (In Case of Emergency)'
    ]
  }
]

export default function SafetyTips() {
  const [selectedCategory, setSelectedCategory] = useState(tipsCategories[0].id)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const currentCategory = tipsCategories.find(c => c.id === selectedCategory)
  const currentTips = currentCategory?.tips || []

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % currentTips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + currentTips.length) % currentTips.length)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">Safety Tips & Guidelines</h3>
            <p className="text-primary-100">Essential tips for your safety in different situations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {tipsCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id)
              setCurrentTipIndex(0)
            }}
            className={`p-3 rounded-lg text-center transition ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <category.icon className="mx-auto mb-1" size={24} />
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="text-yellow-500 mr-2" size={20} />
          {currentCategory?.name} Safety Tips
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-primary-50 rounded-lg p-6 mb-6"
          >
            <p className="text-gray-800 text-lg leading-relaxed">
              {currentTips[currentTipIndex]}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevTip}
                className="text-primary-600 hover:text-primary-700"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                Tip {currentTipIndex + 1} of {currentTips.length}
              </span>
              <button
                onClick={nextTip}
                className="text-primary-600 hover:text-primary-700"
              >
                Next →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 mb-2">All Tips</h4>
          {currentTips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => setCurrentTipIndex(index)}
            >
              <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-xl p-4">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
            <Phone size={16} className="mr-1" />
            Emergency Numbers
          </h4>
          <div className="space-y-1 text-sm text-red-700">
            <p>🚨 Police: <strong>100</strong></p>
            <p>🚑 Ambulance: <strong>102</strong></p>
            <p>👩 Women Helpline: <strong>1091</strong></p>
            <p>🛡️ National Women's Helpline: <strong>181</strong></p>
            <p>💻 Cyber Crime: <strong>155260</strong></p>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <Lock size={16} className="mr-1" />
            Quick Safety Checklist
          </h4>
          <div className="space-y-1 text-sm text-green-700">
            <p>✓ Share location with family</p>
            <p>✓ Keep phone charged</p>
            <p>✓ Carry pepper spray/whistle</p>
            <p>✓ Save emergency contacts</p>
            <p>✓ Be aware of surroundings</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Remember:</strong> Your safety is the top priority. Trust your instincts and don't hesitate to seek help when needed.
          These tips are meant to enhance your safety awareness and preparedness.
        </p>
      </div>
    </div>
  )
}
