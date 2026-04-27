import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Calculator, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EligibilityChecker() {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    occupation: '',
    maritalStatus: '',
    location: '',
    education: ''
  })
  const [results, setResults] = useState(null)
  const [checking, setChecking] = useState(false)

  const schemes = [
    {
      name: 'Pradhan Mantri Matru Vandana Yojana',
      eligible: formData.occupation === 'pregnant' || formData.occupation === 'mother',
      benefit: '₹5,000',
      criteria: 'Pregnant and lactating mothers'
    },
    {
      name: 'Sukanya Samriddhi Yojana',
      eligible: parseInt(formData.age) < 10 && formData.maritalStatus === 'single',
      benefit: 'High interest savings',
      criteria: 'Girl child below 10 years'
    },
    {
      name: 'Working Women Hostel',
      eligible: formData.occupation === 'working' && parseInt(formData.age) >= 18,
      benefit: 'Safe accommodation',
      criteria: 'Working women away from home'
    },
    {
      name: 'Nari Shakti Puraskar',
      eligible: formData.occupation === 'entrepreneur' || formData.occupation === 'social-worker',
      benefit: 'Award & Recognition',
      criteria: 'Exceptional contribution to women empowerment'
    },
    {
      name: 'Skill Development Program',
      eligible: parseInt(formData.age) >= 18 && parseInt(formData.age) <= 45,
      benefit: 'Free training & certification',
      criteria: 'Women seeking employment'
    }
  ]

  const handleCheck = () => {
    if (!formData.age || !formData.occupation) {
      toast.error('Please fill in age and occupation')
      return
    }

    setChecking(true)
    setTimeout(() => {
      const eligibleSchemes = schemes.filter(scheme => scheme.eligible)
      const ineligibleSchemes = schemes.filter(scheme => !scheme.eligible)
      
      setResults({
        eligible: eligibleSchemes,
        ineligible: ineligibleSchemes,
        totalEligible: eligibleSchemes.length
      })
      setChecking(false)
      
      toast.success(`You are eligible for ${eligibleSchemes.length} schemes!`)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Calculator size={32} />
          <div>
            <h3 className="text-xl font-bold">Eligibility Checker</h3>
            <p className="text-green-100">Find government schemes you qualify for</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your age"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter annual income"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
            <select
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select occupation</option>
              <option value="student">Student</option>
              <option value="working">Working Professional</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="homemaker">Homemaker</option>
              <option value="pregnant">Pregnant</option>
              <option value="mother">Mother</option>
              <option value="social-worker">Social Worker</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleCheck}
          disabled={checking}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {checking ? 'Checking Eligibility...' : 'Check Eligibility'}
        </button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  You're eligible for {results.totalEligible} schemes!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  Based on your profile, these schemes match your eligibility criteria
                </p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>

          {results.eligible.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Eligible Schemes</h4>
              {results.eligible.map((scheme, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900">{scheme.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{scheme.criteria}</p>
                    </div>
                    <span className="text-primary-600 font-semibold">{scheme.benefit}</span>
                  </div>
                  <button className="mt-3 text-primary-600 text-sm hover:underline">
                    Apply Now →
                  </button>
                </div>
              ))}
            </div>
          )}

          {results.ineligible.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Schemes You May Not Qualify For</h4>
              {results.ineligible.map((scheme, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-gray-700">{scheme.name}</h5>
                      <p className="text-sm text-gray-500 mt-1">{scheme.criteria}</p>
                    </div>
                    <XCircle size={20} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
