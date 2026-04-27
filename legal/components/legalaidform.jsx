import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Send, AlertCircle, CheckCircle, Upload, User, Phone, Mail, MapPin } from 'lucide-react'
import { useAuthStore } from '../../../store/authstores'
import { db } from '../../../config/firebases'
import { collection, addDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function LegalAidForm() {
  const { user, userData } = useAuthStore()
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: user?.email || '',
    phone: userData?.phone || '',
    address: '',
    caseType: '',
    description: '',
    urgency: 'normal',
    documents: []
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState([])

  const caseTypes = [
    'Domestic Violence',
    'Sexual Harassment',
    'Dowry Harassment',
    'Child Custody',
    'Divorce',
    'Property Rights',
    'Employment Discrimination',
    'Cyber Crime',
    'Other'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await addDoc(collection(db, 'legal_aid_requests'), {
        ...formData,
        userId: user?.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        documents: uploadedDocs
      })
      
      toast.success('Legal aid request submitted successfully!')
      setFormData({
        ...formData,
        address: '',
        caseType: '',
        description: '',
        urgency: 'normal'
      })
      setUploadedDocs([])
    } catch (error) {
      toast.error('Failed to submit request. Please try again.')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newDocs = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: URL.createObjectURL(file)
    }))
    setUploadedDocs([...uploadedDocs, ...newDocs])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Apply for Legal Aid</h3>
          <p className="text-gray-600">Get free legal assistance from government schemes and NGOs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Type *</label>
            <select
              required
              value={formData.caseType}
              onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select case type</option>
              {caseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description of the Issue *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Please describe your legal issue in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
          <div className="flex space-x-4">
            {['normal', 'high', 'critical'].map(level => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={level}
                  checked={formData.urgency === level}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Upload size={18} />
              <span>Choose files</span>
            </label>
            {uploadedDocs.length > 0 && (
              <div className="mt-3 text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
                {uploadedDocs.map((doc, i) => (
                  <div key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Submit Legal Aid Request</span>
            </>
          )}
        </button>

        <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Your request will be reviewed within 2-3 business days. A legal aid representative will contact you shortly.
          </p>
        </div>
      </form>
    </motion.div>
  )
}





