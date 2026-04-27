import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, ExternalLink, Clock, CheckCircle, AlertCircle, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

const applications = [
  {
    id: 'complaint',
    name: 'Police Complaint',
    description: 'File a formal complaint with the police regarding harassment, violence, or any criminal offense.',
    steps: [
      'Visit the nearest police station',
      'Submit a written complaint',
      'Get acknowledgment receipt',
      'Follow up for action taken'
    ],
    documents: ['Identity proof', 'Address proof', 'Evidence if any', 'Witness statements'],
    timeline: 'FIR registration within 24-48 hours',
    link: 'https://ncw.nic.in/'
  },
  {
    id: 'domestic-violence',
    name: 'Domestic Violence Complaint',
    description: 'File complaint under Protection of Women from Domestic Violence Act, 2005.',
    steps: [
      'Approach Protection Officer',
      'File complaint at Magistrate court',
      'Seek protection orders',
      'Get medical examination if required'
    ],
    documents: ['Medical reports', 'Photographs of injuries', 'Police complaints if any', 'Marriage certificate'],
    timeline: 'Immediate relief within 24-48 hours',
    link: 'https://wcd.nic.in/'
  },
  {
    id: 'posh',
    name: 'POSH Complaint',
    description: 'Sexual harassment complaint at workplace under POSH Act, 2013.',
    steps: [
      'File complaint with Internal Complaints Committee',
      'Submit written complaint',
      'ICC investigation',
      'Redressal within 90 days'
    ],
    documents: ['Written complaint', 'Witness details', 'Evidence of harassment', 'Workplace details'],
    timeline: 'Complaint resolution within 90 days',
    link: 'https://ncw.nic.in/'
  },
  {
    id: 'legal-aid',
    name: 'Free Legal Aid',
    description: 'Apply for free legal services from Legal Services Authority.',
    steps: [
      'Fill legal aid application',
      'Submit income proof',
      'Get eligibility assessment',
      'Lawyer assigned'
    ],
    documents: ['Income certificate', 'Identity proof', 'Case details', 'Previous orders if any'],
    timeline: 'Legal aid provided within 7-15 days',
    link: 'https://nalsa.gov.in/'
  },
  {
    id: 'cyber-crime',
    name: 'Cyber Crime Complaint',
    description: 'Report online harassment, cyber stalking, or digital crimes.',
    steps: [
      'Visit cyber crime portal',
      'File online complaint',
      'Upload evidence',
      'Track complaint status'
    ],
    documents: ['Screenshots', 'URLs', 'Chat history', 'Bank statements if financial fraud'],
    timeline: 'Immediate reporting available online',
    link: 'https://cybercrime.gov.in/'
  }
]

export default function LegalApplications() {
  const [selectedApp, setSelectedApp] = useState(null)

  const handleApply = (app) => {
    window.open(app.link, '_blank')
    toast.success(`Redirecting to ${app.name} portal...`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FileText className="text-primary-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">{app.description}</p>
              </div>
            </div>

            {selectedApp === app.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100 space-y-3"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Process Steps:</h4>
                  <ul className="space-y-1">
                    {app.steps.map((step, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.documents.map((doc, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{app.timeline}</span>
                  </div>
                  <button
                    onClick={() => handleApply(app)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                  >
                    <ExternalLink size={14} />
                    <span>Apply Now</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <AlertCircle size={32} className="flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Need Immediate Legal Help?</h3>
            <p className="text-sm opacity-90 mb-4">
              Contact the National Legal Services Authority (NALSA) toll-free helpline for free legal assistance.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:15100"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition"
              >
                <Phone size={16} />
                <span>Call 15100</span>
              </a>
              <a
                href="https://nalsa.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
              >
                <ExternalLink size={16} />
                <span>Visit NALSA Website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Phone(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
