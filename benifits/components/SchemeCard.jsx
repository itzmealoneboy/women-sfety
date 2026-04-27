import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle, ExternalLink, Calendar, Users, IndianRupee } from 'lucide-react'

export default function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false)

  const getEligibilityColor = (eligibility) => {
    if (eligibility === 'Eligible') return 'text-green-600 bg-green-100'
    if (eligibility === 'Check Eligibility') return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getEligibilityColor(scheme.eligibility)}`}>
                {scheme.eligibility}
              </span>
              {scheme.category && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {scheme.category}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{scheme.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {scheme.benefit && (
            <div className="flex items-center space-x-1">
              <IndianRupee size={14} />
              <span>{scheme.benefit}</span>
            </div>
          )}
          {scheme.deadline && (
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Deadline: {scheme.deadline}</span>
            </div>
          )}
          {scheme.applicants && (
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{scheme.applicants}+ applied</span>
            </div>
          )}
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-100 space-y-3"
          >
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Eligibility Criteria</h4>
              <ul className="space-y-1">
                {scheme.eligibilityCriteria?.map((criteria, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Required Documents</h4>
              <div className="flex flex-wrap gap-2">
                {scheme.documents?.map((doc, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">How to Apply</h4>
              <ol className="space-y-1 list-decimal list-inside text-sm text-gray-600">
                {scheme.steps?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex space-x-3 pt-2">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Apply Now
              </button>
              <button className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                <ExternalLink size={14} />
                <span>Learn More</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
