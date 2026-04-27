import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Copy, Check, AlertCircle, Printer, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const templates = [
  {
    id: 'police-complaint',
    name: 'Police Complaint Letter',
    description: 'Formal complaint letter to file with police station',
    sections: ['Complainant Details', 'Incident Details', 'Accused Details', 'Evidence List', 'Relief Sought']
  },
  {
    id: 'domestic-violence',
    name: 'Domestic Violence Complaint',
    description: 'Application under Protection of Women from Domestic Violence Act',
    sections: ['Personal Information', 'Details of Violence', 'Relief Required', 'Supporting Documents']
  },
  {
    id: 'posh-complaint',
    name: 'POSH Complaint',
    description: 'Sexual harassment complaint for workplace',
    sections: ['Complainant Details', 'Harassment Details', 'Witness Details', 'Evidence', 'Relief Sought']
  },
  {
    id: 'legal-aid',
    name: 'Legal Aid Application',
    description: 'Application for free legal assistance',
    sections: ['Personal Details', 'Income Details', 'Case Details', 'Documents Attached']
  },
  {
    id: 'cyber-complaint',
    name: 'Cyber Crime Complaint',
    description: 'Complaint for online harassment or fraud',
    sections: ['Complainant Details', 'Incident Details', 'Digital Evidence', 'Suspect Details']
  }
]

export default function LegalDocumentGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [generatedDoc, setGeneratedDoc] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setGeneratedDoc(null)
    setFormData({})
  }

  const generateDocument = () => {
    // This would generate actual legal document based on form data
    const document = `
      ${selectedTemplate.name.toUpperCase()}

      Date: ${new Date().toLocaleDateString()}

      To,
      The Station House Officer,
      [Police Station Name],
      [City/District].

      Subject: ${selectedTemplate.name}

      I, ${formData.name || '[Name]'}, residing at ${formData.address || '[Address]'}, wish to file a complaint regarding...

      Details of Incident:
      ${formData.incidentDetails || '[Provide details of the incident]'}

      I request you to take appropriate action as per law.

      List of Documents Attached:
      ${formData.documents || '[List of supporting documents]'}

      I declare that the above information is true to the best of my knowledge.

      Signature: ___________________

      Place: ${formData.place || '[Place]'}
      Date: ${new Date().toLocaleDateString()}
    `

    setGeneratedDoc(document)
    toast.success('Document generated successfully!')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDoc)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadDocument = () => {
    const blob = new Blob([generatedDoc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Document downloaded!')
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <FileText size={32} />
          <div>
            <h3 className="text-xl font-bold">Legal Document Generator</h3>
            <p className="text-primary-100">Generate ready-to-use legal complaint letters and applications</p>
          </div>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="text-primary-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.sections.map(section => (
                      <span key={section} className="text-xs text-gray-500">• {section}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-600">Fill in the details to generate your legal document</p>
            </div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Change Template
            </button>
          </div>

          {!generatedDoc ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Details</label>
                <textarea
                  rows={4}
                  value={formData.incidentDetails || ''}
                  onChange={(e) => setFormData({ ...formData, incidentDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the incident in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                <input
                  type="text"
                  value={formData.place || ''}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="City/District"
                />
              </div>

              <button
                onClick={generateDocument}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Generate Document
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{generatedDoc}</pre>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <button
                  onClick={downloadDocument}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              This is a draft document. Please consult a legal professional before submission. 
              Add specific case details, dates, and witness information for better legal protection.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
