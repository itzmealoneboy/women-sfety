import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Scale, BookOpen, Award, Shield, Heart, Users } from 'lucide-react'

const rightsData = [
  {
    id: 1,
    title: 'Right to Equality',
    icon: Scale,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'The Constitution guarantees equality before the law and prohibits discrimination on grounds of religion, race, caste, sex, or place of birth.',
    articles: ['Article 14', 'Article 15', 'Article 16'],
    details: [
      'Equal pay for equal work',
      'No discrimination in employment',
      'Equal opportunity in public employment'
    ]
  },
  {
    id: 2,
    title: 'Right to Life and Personal Liberty',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Protection of life and personal liberty, including the right to live with dignity.',
    articles: ['Article 21'],
    details: [
      'Right to live with human dignity',
      'Protection against sexual harassment at workplace',
      'Right to privacy',
      'Right to health and medical care'
    ]
  },
  {
    id: 3,
    title: 'Protection from Domestic Violence',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Protection of Women from Domestic Violence Act, 2005 provides comprehensive protection to women facing domestic violence.',
    articles: ['Protection of Women from Domestic Violence Act, 2005'],
    details: [
      'Right to reside in shared household',
      'Right to protection orders',
      'Right to monetary relief',
      'Right to custody of children'
    ]
  },
  {
    id: 4,
    title: 'Maternity Benefits',
    icon: Award,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'Maternity Benefit Act, 1961 and amendments provide for paid maternity leave and other benefits.',
    articles: ['Maternity Benefit Act, 1961'],
    details: [
      '26 weeks paid maternity leave',
      'Creche facility for working mothers',
      'Work from home option',
      'Nursing breaks'
    ]
  },
  {
    id: 5,
    title: 'Sexual Harassment at Workplace',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.',
    articles: ['POSH Act, 2013'],
    details: [
      'Right to file complaint',
      'Internal Complaints Committee in organizations',
      'Protection against retaliation',
      'Timely redressal of complaints'
    ]
  },
  {
    id: 6,
    title: 'Right to Education',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Right to free and compulsory education for children between 6-14 years.',
    articles: ['Article 21A', 'RTE Act, 2009'],
    details: [
      'Free education for girls',
      'Reservation for girls in schools',
      'Mid-day meal scheme',
      'Scholarships for higher education'
    ]
  }
]

export default function RightsCard() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="space-y-4">
      {rightsData.map((right, index) => (
        <motion.div
          key={right.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === right.id ? null : right.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${right.bgColor} rounded-lg`}>
                <right.icon className={right.color} size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{right.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{right.description.substring(0, 80)}...</p>
              </div>
            </div>
            {expandedId === right.id ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>

          {expandedId === right.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-6 border-t border-gray-100"
            >
              <div className="pt-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Provisions</h4>
                  <div className="flex flex-wrap gap-2">
                    {right.articles.map(article => (
                      <span key={article} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {article}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Rights & Benefits</h4>
                  <ul className="space-y-2">
                    {right.details.map((detail, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-sm text-primary-800">
                    <strong>How to claim this right:</strong> Contact the nearest legal aid cell or women's commission for assistance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
